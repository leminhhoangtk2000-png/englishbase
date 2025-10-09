import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order with related payment information
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5 // Get latest 5 payment attempts
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order has expired
    const now = new Date();
    const isExpired = order.expiresAt && now > order.expiresAt;
    
    // Auto-update expired orders
    if (isExpired && order.status === 'PENDING') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'EXPIRED' }
      });
      order.status = 'EXPIRED';
    }

    // Get the latest successful payment
    const successfulPayment = order.payments.find(p => p.status === 'COMPLETED');
    
    // Calculate time remaining for pending orders
    let timeRemaining = null;
    if (order.status === 'PENDING' && order.expiresAt && !isExpired) {
      timeRemaining = Math.max(0, Math.floor((order.expiresAt.getTime() - now.getTime()) / 1000));
    }

    // Prepare response data
    const responseData: any = {
      orderId: order.id,
      status: order.status,
      productType: order.productType,
      productId: order.productId,
      productName: order.productName,
      amount: order.amount,
      currency: order.currency,
      sepayCode: order.sepayCode,
      createdAt: order.createdAt,
      expiresAt: order.expiresAt,
      timeRemaining: timeRemaining,
      isExpired: isExpired,
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone
      },
      payment: successfulPayment ? {
        id: successfulPayment.id,
        sepayId: successfulPayment.sepayId,
        gateway: successfulPayment.gateway,
        transferAmount: successfulPayment.transferAmount,
        transactionDate: successfulPayment.transactionDate,
        verifiedAt: successfulPayment.verifiedAt,
        processedAt: successfulPayment.processedAt
      } : null,
      statusHistory: order.payments.map(payment => ({
        status: payment.status,
        amount: payment.transferAmount || Number(payment.amount),
        gateway: payment.gateway,
        createdAt: payment.createdAt,
        description: payment.description,
        isVerified: payment.isVerified
      }))
    };

    // Add status-specific information
    switch (order.status) {
      case 'PENDING':
        responseData.message = isExpired 
          ? 'Đơn hàng đã hết hạn thanh toán'
          : 'Đang chờ thanh toán';
        
        if (!isExpired) {
          responseData.paymentInfo = {
            bankName: 'MBBank (Ngân hàng Quân đội)',
            accountNumber: process.env.SEPAY_ACCOUNT_NUMBER || '0776161075',
            accountName: process.env.SEPAY_ACCOUNT_NAME || 'TRAN QUOC BAO',
            transferContent: `${order.sepayCode} ${order.productName}`,
            amount: order.amount,
            instructions: [
              'Mở ứng dụng ngân hàng của bạn',
              'Chuyển khoản đến thông tin tài khoản trên',
              `Nhập nội dung: ${order.sepayCode} ${order.productName}`,
              'Xác nhận giao dịch',
              'Hệ thống sẽ tự động xử lý trong 1-2 phút'
            ]
          };
          
          // Add QR Code for pending orders
          responseData.qrCode = `https://qr.sepay.vn/img?acc=${process.env.SEPAY_ACCOUNT_NUMBER || '0776161075'}&bank=MBBank&amount=${order.amount}&des=${encodeURIComponent(`${order.sepayCode} ${order.productName}`)}`;
          responseData.deeplink = `banking://transfer?amount=${order.amount}&receiver=${process.env.SEPAY_ACCOUNT_NUMBER || '0776161075'}&note=${encodeURIComponent(`${order.sepayCode} ${order.productName}`)}`;
        }
        break;

      case 'PAID':
        responseData.message = 'Thanh toán thành công';
        responseData.fulfillmentStatus = await checkFulfillmentStatus(order);
        break;

      case 'EXPIRED':
        responseData.message = 'Đơn hàng đã hết hạn thanh toán';
        responseData.canRetry = true;
        break;

      case 'CANCELLED':
        responseData.message = 'Đơn hàng đã bị hủy';
        break;

      case 'REFUNDED':
        responseData.message = 'Đơn hàng đã được hoàn tiền';
        break;
    }

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error) {
    console.error('Get order status error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to check fulfillment status
async function checkFulfillmentStatus(order: any) {
  try {
    switch (order.productType) {
      case 'PREMIUM_MEMBERSHIP':
        const user = await prisma.user.findUnique({
          where: { id: order.userId },
          select: { isPremium: true }
        });
        return {
          type: 'premium_membership',
          fulfilled: user?.isPremium || false,
          message: user?.isPremium 
            ? 'Tài khoản Premium đã được kích hoạt'
            : 'Đang xử lý kích hoạt Premium...'
        };

      case 'COURSE':
        // Check course enrollment status
        // This would depend on your course system implementation
        return {
          type: 'course_enrollment',
          fulfilled: true, // Placeholder
          message: 'Đã ghi danh khóa học thành công'
        };

      case 'TUTORING':
        return {
          type: 'tutoring_credits',
          fulfilled: true, // Placeholder
          message: 'Đã thêm giờ học 1-1 vào tài khoản'
        };

      case 'MATERIALS':
        return {
          type: 'materials_access',
          fulfilled: true, // Placeholder
          message: 'Đã cấp quyền truy cập tài liệu'
        };

      default:
        return {
          type: 'unknown',
          fulfilled: false,
          message: 'Loại sản phẩm không xác định'
        };
    }
  } catch (error) {
    console.error('Fulfillment status check error:', error);
    return {
      type: 'error',
      fulfilled: false,
      message: 'Lỗi kiểm tra trạng thái xử lý'
    };
  }
}

// PUT endpoint for manual order updates (admin only)
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const body = await request.json();

    // TODO: Add admin authentication check here
    // const user = await authenticateAdmin(request);
    
    const { status, note } = body;

    if (!['PENDING', 'PAID', 'EXPIRED', 'CANCELLED', 'REFUNDED'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: status,
        // Add admin note to a notes field if it exists
      }
    });

    // If marking as paid manually, trigger fulfillment
    if (status === 'PAID' && order.status !== 'PAID') {
      // TODO: Trigger fulfillment process
      console.log('Manual order fulfillment needed for:', orderId);
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        oldStatus: order.status,
        newStatus: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
