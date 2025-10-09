import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Order creation request interface
interface CreateOrderRequest {
  userId: string;
  productType: 'PREMIUM_MEMBERSHIP' | 'COURSE' | 'TUTORING' | 'MATERIALS';
  productId?: string;
  productName: string;
  amount: number;
  currency?: string;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

// QR Code generation for SePay
interface SepayQRResponse {
  status: boolean;
  messages: string;
  data?: {
    qr: string;
    deeplink: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequest = await request.json();

    // Validate required fields
    if (!body.userId || !body.productType || !body.productName || !body.amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Missing required fields: userId, productType, productName, amount' 
        },
        { status: 400 }
      );
    }

    // Validate or create user
    let user = await prisma.user.findUnique({
      where: { id: body.userId }
    });

    if (!user) {
      // Auto-create guest user if not exists
      user = await prisma.user.create({
        data: {
          id: body.userId,
          email: `${body.userId}@guest.local`,
          name: body.customerInfo?.name || `Guest User ${Date.now().toString().slice(-4)}`,
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });
    }

    // Generate unique payment code and order number
    const sepayCode = generatePaymentCode(body.productType);
    const orderNumber = `DTV-${Date.now().toString().slice(-8)}`;

    // Calculate expiry time (30 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    // Create order record
    const order = await prisma.order.create({
      data: {
        userId: body.userId,
        orderNumber: orderNumber,
        productType: body.productType,
        productId: body.productId,
        productName: body.productName,
        amount: body.amount,
        currency: body.currency || 'VND',
        sepayCode: sepayCode,
        status: 'PENDING',
        expiresAt: expiresAt,
        customerName: body.customerInfo?.name || user.name,
        customerEmail: body.customerInfo?.email || user.email,
        customerPhone: body.customerInfo?.phone
      }
    });

    // Generate QR code via SePay API
    const qrData = await generateSepayQR(sepayCode, body.amount, body.productName);
    console.log('QR Data:', qrData);

    // Prepare bank transfer information
    const bankInfo = {
      bankName: 'MBBank (Ngân hàng Quân đội)',
      accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || '0776161075',
      accountName: process.env.SEPAY_ACCOUNT_NAME || 'TRAN QUOC BAO',
      transferContent: `${sepayCode} ${body.productName}`,
      amount: body.amount
    };

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        sepayCode: sepayCode,
        amount: body.amount,
        currency: order.currency,
        expiresAt: expiresAt.toISOString(),
        expiresIn: 30 * 60, // 30 minutes in seconds
        qrCode: qrData?.qr || `https://qr.sepay.vn/img?acc=0776161075&bank=MBBank&amount=${body.amount}&des=${encodeURIComponent(`${sepayCode} ${body.productName}`)}`,
        deeplink: qrData?.deeplink || `banking://transfer?amount=${body.amount}&receiver=0776161075&note=${encodeURIComponent(`${sepayCode} ${body.productName}`)}`,
        bankInfo: bankInfo,
        paymentInstructions: {
          step1: 'Mở ứng dụng ngân hàng của bạn',
          step2: 'Quét mã QR hoặc chuyển khoản thủ công',
          step3: `Nhập nội dung chuyển khoản: ${sepayCode} ${body.productName}`,
          step4: 'Xác nhận giao dịch',
          step5: 'Hệ thống sẽ tự động xử lý trong vòng 1-2 phút'
        }
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId parameter required' },
        { status: 400 }
      );
    }

    // Build query filters
    const where: any = { userId };
    if (status) {
      where.status = status;
    }

    // Get orders with pagination
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          payments: {
            where: { status: 'COMPLETED' },
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      }),
      prisma.order.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orders: orders.map(order => ({
          id: order.id,
          productType: order.productType,
          productName: order.productName,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
          sepayCode: order.sepayCode,
          createdAt: order.createdAt,
          expiresAt: order.expiresAt,
          paidAt: order.payments[0]?.createdAt || null
        })),
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate unique payment code
function generatePaymentCode(productType: string): string {
  const prefix = getProductPrefix(productType);
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  
  return `${prefix}${timestamp}${random}`;
}

function getProductPrefix(productType: string): string {
  switch (productType) {
    case 'PREMIUM_MEMBERSHIP':
      return 'DTV';
    case 'COURSE':
      return 'EDU';
    case 'TUTORING':
      return 'TUT';
    case 'MATERIALS':
      return 'MAT';
    default:
      return 'DEU';
  }
}

// Helper function to generate QR code via SePay API
async function generateSepayQR(
  paymentCode: string, 
  amount: number, 
  description: string
): Promise<SepayQRResponse['data'] | null> {
  try {
    const sepayApiKey = process.env.SEPAY_API_TOKEN;
    const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER;

    if (!sepayApiKey || !accountNumber) {
      console.warn('SePay credentials not configured, using SePay QR format');
      // Use SePay QR format as per documentation - correct bank code for MBBank
      const bankCode = 'MBBank'; // Correct code for MBBank (Ngân hàng TMCP Quân đội)
      const qrUrl = `https://qr.sepay.vn/img?acc=${accountNumber || '0776161075'}&bank=${bankCode}&amount=${amount}&des=${encodeURIComponent(`${paymentCode} ${description}`)}`;
      
      return {
        qr: qrUrl,
        deeplink: `banking://transfer?amount=${amount}&receiver=${accountNumber || '0776161075'}&note=${encodeURIComponent(`${paymentCode} ${description}`)}`
      };
    }

    const response = await fetch('https://my.sepay.vn/userapi/transactions/create-qr-code', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sepayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account_number: accountNumber,
        amount: amount,
        content: `${paymentCode} ${description}`,
      }),
    });

    if (!response.ok) {
      console.error('SePay QR API error:', response.status, response.statusText);
      return null;
    }

    const result: SepayQRResponse = await response.json();
    
    if (result.status && result.data) {
      return result.data;
    } else {
      console.error('SePay QR generation failed:', result.messages);
      return null;
    }

  } catch (error) {
    console.error('QR generation error:', error);
    return null;
  }
}
