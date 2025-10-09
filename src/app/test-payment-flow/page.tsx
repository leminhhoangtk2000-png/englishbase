'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentConfirmationDialog from '@/components/PaymentConfirmationDialog';
import PaymentModal from '@/components/PaymentModal';

export default function TestPaymentFlowPage() {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleTestConfirmation = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmPayment = async () => {
    setConfirmationOpen(false);
    
    // Simulate creating order
    try {
      const response = await fetch('/api/sepay/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'test-user-id',
          productType: 'PREMIUM_MEMBERSHIP',
          productId: 'premium-1month',
          productName: 'Premium 1 Tháng',
          amount: 199000,
          currency: 'VND',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.data.orderId);
        setPaymentModalOpen(true);
      }
    } catch (error) {
      console.error('Error creating test order:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Test Payment Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Test the new payment confirmation dialog flow
            </p>
            
            <Button onClick={handleTestConfirmation} className="w-full" size="lg">
              Test Premium 1 Tháng - 199.000đ
            </Button>

            <div className="text-sm text-gray-500">
              <p><strong>Flow:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click button trên</li>
                <li>Confirmation dialog xuất hiện</li>
                <li>Đọc và tick checkbox</li>
                <li>Click "Tiếp tục thanh toán"</li>
                <li>Payment modal với QR code</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <PaymentConfirmationDialog
          isOpen={confirmationOpen}
          onClose={() => setConfirmationOpen(false)}
          onConfirm={handleConfirmPayment}
          productName="Premium 1 Tháng"
          amount={199000}
        />

        {/* Payment Modal */}
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          orderId={orderId || undefined}
          onPaymentSuccess={() => {
            setPaymentModalOpen(false);
            setOrderId(null);
            alert('Payment successful!');
          }}
        />
      </div>
    </div>
  );
}
