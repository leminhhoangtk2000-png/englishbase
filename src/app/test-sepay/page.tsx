'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  TestTube, 
  Check, 
  AlertCircle,
  ExternalLink,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentModal from '@/components/PaymentModal';

export default function SepayTestPage() {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [testForm, setTestForm] = useState({
    productType: 'PREMIUM_MEMBERSHIP',
    productName: 'Test Premium Membership',
    amount: 199000,
    userId: 'test-user-id',
    customerName: 'Test User',
    customerEmail: 'test@example.com'
  });

  const [statusCheck, setStatusCheck] = useState({
    orderId: '',
    loading: false,
    result: null as any
  });

  // Test create order
  const handleCreateTestOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sepay/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: testForm.userId,
          productType: testForm.productType,
          productName: testForm.productName,
          amount: testForm.amount,
          customerInfo: {
            name: testForm.customerName,
            email: testForm.customerEmail
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderData(result.data);
        setPaymentModalOpen(true);
        toast.success('Tạo đơn hàng test thành công!');
      } else {
        toast.error(result.message || 'Lỗi tạo đơn hàng');
      }
    } catch (error) {
      console.error('Create order error:', error);
      toast.error('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  // Test check order status
  const handleCheckOrderStatus = async () => {
    if (!statusCheck.orderId) {
      toast.error('Vui lòng nhập Order ID');
      return;
    }

    setStatusCheck(prev => ({ ...prev, loading: true }));
    try {
      const response = await fetch(`/api/sepay/orders/${statusCheck.orderId}/status`);
      const result = await response.json();

      setStatusCheck(prev => ({ 
        ...prev, 
        result: result,
        loading: false 
      }));

      if (result.success) {
        toast.success('Đã lấy trạng thái đơn hàng');
      } else {
        toast.error(result.message || 'Không tìm thấy đơn hàng');
      }
    } catch (error) {
      console.error('Check status error:', error);
      toast.error('Lỗi kiểm tra trạng thái');
      setStatusCheck(prev => ({ ...prev, loading: false }));
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`Đã sao chép ${label}`);
    } catch (error) {
      toast.error('Không thể sao chép');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <TestTube className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">SePay Integration Test</h1>
          <p className="text-gray-600">
            Trang test chức năng tích hợp thanh toán SePay
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Create Order Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Test Tạo Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productType">Loại sản phẩm</Label>
                <Select 
                  value={testForm.productType} 
                  onValueChange={(value) => setTestForm(prev => ({ ...prev, productType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREMIUM_MEMBERSHIP">Premium Membership</SelectItem>
                    <SelectItem value="COURSE">Course</SelectItem>
                    <SelectItem value="TUTORING">Tutoring</SelectItem>
                    <SelectItem value="MATERIALS">Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="productName">Tên sản phẩm</Label>
                <Input
                  id="productName"
                  value={testForm.productName}
                  onChange={(e) => setTestForm(prev => ({ ...prev, productName: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="amount">Số tiền (VND)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={testForm.amount}
                  onChange={(e) => setTestForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div>
                <Label htmlFor="customerName">Tên khách hàng</Label>
                <Input
                  id="customerName"
                  value={testForm.customerName}
                  onChange={(e) => setTestForm(prev => ({ ...prev, customerName: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="customerEmail">Email khách hàng</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={testForm.customerEmail}
                  onChange={(e) => setTestForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                />
              </div>

              <Separator />

              <Button 
                onClick={handleCreateTestOrder}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Tạo Đơn Hàng Test
                  </>
                )}
              </Button>

              {orderData && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Check className="w-4 h-4 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Tạo đơn hàng thành công!</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Order ID:</span>
                      <div className="flex items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">
                          {orderData.orderId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(orderData.orderId, 'Order ID')}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Mã thanh toán:</span>
                      <code className="bg-yellow-100 px-2 py-1 rounded text-xs">
                        {orderData.sepayCode}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Số tiền:</span>
                      <span className="font-medium">{formatCurrency(orderData.amount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Check Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Test Kiểm Tra Trạng Thái
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="Nhập Order ID để kiểm tra"
                  value={statusCheck.orderId}
                  onChange={(e) => setStatusCheck(prev => ({ ...prev, orderId: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleCheckOrderStatus}
                disabled={statusCheck.loading || !statusCheck.orderId}
                className="w-full"
                variant="outline"
              >
                {statusCheck.loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Đang kiểm tra...
                  </div>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Kiểm Tra Trạng Thái
                  </>
                )}
              </Button>

              {statusCheck.result && (
                <div className="mt-4 p-4 border rounded-lg">
                  {statusCheck.result.success ? (
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-medium">Tìm thấy đơn hàng</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Trạng thái:</span>
                          <Badge 
                            variant={statusCheck.result.data.status === 'PAID' ? 'default' : 'secondary'}
                            className="ml-2"
                          >
                            {statusCheck.result.data.status}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-gray-500">Sản phẩm:</span>
                          <p className="font-medium">{statusCheck.result.data.productName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Số tiền:</span>
                          <p className="font-medium">{formatCurrency(statusCheck.result.data.amount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Mã SePay:</span>
                          <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                            {statusCheck.result.data.sepayCode}
                          </code>
                        </div>
                      </div>

                      {statusCheck.result.data.timeRemaining !== null && (
                        <div className="text-sm">
                          <span className="text-gray-500">Thời gian còn lại:</span>
                          <span className="ml-2 font-medium">
                            {Math.floor(statusCheck.result.data.timeRemaining / 60)}:
                            {(statusCheck.result.data.timeRemaining % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      <span>{statusCheck.result.message}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Endpoints Documentation */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <Badge variant="secondary" className="mb-2">POST</Badge>
                <code className="ml-2">/api/sepay/orders</code>
                <p className="text-gray-600 mt-1">Tạo đơn hàng mới</p>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-2">GET</Badge>
                <code className="ml-2">/api/sepay/orders/[orderId]/status</code>
                <p className="text-gray-600 mt-1">Kiểm tra trạng thái đơn hàng</p>
              </div>
              
              <div>
                <Badge variant="secondary" className="mb-2">POST</Badge>
                <code className="ml-2">/api/sepay/webhook</code>
                <p className="text-gray-600 mt-1">Webhook xử lý thanh toán từ SePay</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-6 flex gap-4 justify-center">
          <Button variant="outline" asChild>
            <a href="https://my.sepay.vn" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              SePay Dashboard
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/premium" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Premium Page
            </a>
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={orderData?.orderId}
        onPaymentSuccess={() => {
          setPaymentModalOpen(false);
          toast.success('Test payment thành công! 🎉');
        }}
      />
    </div>
  );
}
