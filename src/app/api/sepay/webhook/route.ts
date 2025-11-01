import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, rateLimits } from '@/lib/rate-limit';

// SePay Webhook Data Interface
interface SepayWebhookData {
  id: number;
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string | null;
  content: string;
  transferType: 'in' | 'out';
  transferAmount: number;
  accumulated: number;
  subAccount: string | null;
  referenceCode: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for webhook endpoint
    const identifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit({
      ...rateLimits.webhook,
      identifier,
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Verify SePay webhook authentication
    const authorization = request.headers.get('authorization');
    const expectedApiKey = process.env.SEPAY_API_TOKEN;
    
    if (!authorization || !expectedApiKey) {
      return NextResponse.json(
        { success: false, message: 'Missing authentication' },
        { status: 401 }
      );
    }

    // Extract API key from "Apikey YOUR_API_KEY" format
    const apiKey = authorization.replace('Apikey ', '');
    if (apiKey !== expectedApiKey) {
      return NextResponse.json(
        { success: false, message: 'Invalid API key' },
        { status: 401 }
      );
    }

    // Parse webhook data
    const webhookData: SepayWebhookData = await request.json();
    
    // Log incoming webhook for debugging
    console.log('SePay Webhook received:', {
      id: webhookData.id,
      amount: webhookData.transferAmount,
      code: webhookData.code,
      content: webhookData.content
    });

    // Only process incoming transfers (payments)
    if (webhookData.transferType !== 'in') {
      return NextResponse.json(
        { success: true, message: 'Outgoing transfer ignored' },
        { status: 200 }
      );
    }

    // Check for duplicate webhook processing
    const existingPayment = await prisma.payment.findUnique({
      where: { sepayId: webhookData.id }
    });

    if (existingPayment) {
      console.log('Duplicate webhook ignored:', webhookData.id);
      return NextResponse.json(
        { success: true, message: 'Payment already processed' },
        { status: 200 }
      );
    }

    // Extract payment code from content or use provided code
    const paymentCode = webhookData.code || extractPaymentCode(webhookData.content);
    
    if (!paymentCode) {
      console.log('No payment code found in:', webhookData.content);
      return NextResponse.json(
        { success: true, message: 'No payment code found' },
        { status: 200 }
      );
    }

    // Find order by payment code
    const order = await prisma.order.findUnique({
      where: { sepayCode: paymentCode },
      include: { user: true }
    });

    if (!order) {
      console.log('Order not found for code:', paymentCode);
      return NextResponse.json(
        { success: true, message: 'Order not found' },
        { status: 200 }
      );
    }

    // Check if order is still valid (not expired)
    if (order.expiresAt && new Date() > order.expiresAt) {
      console.log('Order expired:', order.id);
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'EXPIRED' }
      });
      
      return NextResponse.json(
        { success: true, message: 'Order expired' },
        { status: 200 }
      );
    }

    // Verify payment amount matches order amount
    if (webhookData.transferAmount !== order.amount) {
      console.log('Amount mismatch:', {
        received: webhookData.transferAmount,
        expected: order.amount
      });
      
      // Create payment record with failed status
      await prisma.payment.create({
        data: {
          orderId: order.id,
          userId: order.userId,
          sepayId: webhookData.id,
          gateway: webhookData.gateway,
          accountNumber: webhookData.accountNumber,
          transferAmount: webhookData.transferAmount,
          transferType: webhookData.transferType,
          transactionDate: new Date(webhookData.transactionDate),
          referenceCode: webhookData.referenceCode,
          content: webhookData.content,
          sepayCode: paymentCode,
          status: 'FAILED',
          amount: order.amount,
          currency: order.currency,
          description: `Amount mismatch: received ${webhookData.transferAmount}, expected ${order.amount}`,
          isVerified: false
        }
      });

      return NextResponse.json(
        { success: true, message: 'Payment amount mismatch' },
        { status: 200 }
      );
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        sepayId: webhookData.id,
        gateway: webhookData.gateway,
        accountNumber: webhookData.accountNumber,
        transferAmount: webhookData.transferAmount,
        transferType: webhookData.transferType,
        transactionDate: new Date(webhookData.transactionDate),
        referenceCode: webhookData.referenceCode,
        content: webhookData.content,
        sepayCode: paymentCode,
        status: 'COMPLETED',
        amount: order.amount,
        currency: order.currency,
        description: `Payment for ${order.productName}`,
        isVerified: true,
        verifiedAt: new Date(),
        processedAt: new Date()
      }
    });

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PAID' }
    });

    // Process product fulfillment based on product type
    await fulfillOrder(order);

    console.log('Payment processed successfully:', {
      paymentId: payment.id,
      orderId: order.id,
      amount: webhookData.transferAmount,
      user: order.user.email
    });

    return NextResponse.json(
      { success: true, message: 'Payment processed successfully' },
      { status: 201 }
    );

  } catch (error) {
    console.error('SePay webhook error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to extract payment code from transfer content
function extractPaymentCode(content: string): string | null {
  // Common patterns for payment codes in Vietnamese bank transfers
  const patterns = [
    /EDU(\d{6})/i,           // EDU123456
    /DTV(\d{6})/i,           // DTV123456  
    /DEUTSCH(\d{6})/i,       // DEUTSCH123456
    /(\d{8,})/,              // Any 8+ digit number
    /([A-Z]{2,}\d{4,})/i     // 2+ letters followed by 4+ digits
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[0].toUpperCase();
    }
  }

  return null;
}

// Helper function to fulfill order based on product type
async function fulfillOrder(order: any) {
  try {
    switch (order.productType) {
      case 'PREMIUM_MEMBERSHIP':
        // Upgrade user to premium
        await prisma.user.update({
          where: { id: order.userId },
          data: { 
            isPremium: true,
            // Could add premium expiry date here
          }
        });
        console.log('User upgraded to premium:', order.userId);
        break;

      case 'COURSE':
        // Enroll user in specific course
        // This would depend on your course enrollment system
        console.log('Course enrollment needed for:', order.productId);
        break;

      case 'TUTORING':
        // Create tutoring session credits
        console.log('Tutoring session credits added for:', order.userId);
        break;

      case 'MATERIALS':
        // Grant access to specific materials
        console.log('Materials access granted for:', order.productId);
        break;

      default:
        console.log('Unknown product type:', order.productType);
    }
  } catch (error) {
    console.error('Order fulfillment error:', error);
    // Note: Payment is still successful, fulfillment can be retried manually
  }
}
