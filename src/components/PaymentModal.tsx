'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Copy, 
  CheckCircle2, 
  Clock, 
  QrCode, 
  CreditCard,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  onPaymentSuccess?: () => void;
}

interface OrderData {
  orderId: string;
  sepayCode: string;
  amount: number;
  currency: string;
  expiresAt: string;
  expiresIn: number;
  qrCode?: string;
  deeplink?: string;
  status: string;
  timeRemaining?: number;
  paymentInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    transferContent: string;
    amount: number;
    instructions: string[];
  };
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    transferContent: string;
    amount: number;
  };
  paymentInstructions?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
  };
}

export default function PaymentModal({ isOpen, onClose, orderId, onPaymentSuccess }: PaymentModalProps) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'expired' | 'failed'>('pending');

  // Fetch order data when modal opens
  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderStatus();
    }
  }, [isOpen, orderId]);

  // Countdown timer
  useEffect(() => {
    if (orderData?.timeRemaining && paymentStatus === 'pending') {
      setTimeLeft(orderData.timeRemaining);
      
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setPaymentStatus('expired');
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [orderData, paymentStatus]);

  // Auto-check payment status every 30 seconds
  useEffect(() => {
    if (paymentStatus === 'pending' && orderId) {
      const statusChecker = setInterval(() => {
        checkPaymentStatus();
      }, 30000); // Check every 30 seconds

      return () => clearInterval(statusChecker);
    }
  }, [paymentStatus, orderId]);

  const fetchOrderStatus = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/sepay/orders/${orderId}/status`);
      const result = await response.json();
      
      if (result.success) {
        const data = result.data;
        setOrderData(data);
        
        // Set payment status based on order status
        if (data.status === 'PAID') {
          setPaymentStatus('success');
          onPaymentSuccess?.();
        } else if (data.status === 'EXPIRED') {
          setPaymentStatus('expired');
        } else {
          setPaymentStatus('pending');
        }
      } else {
        toast.error('Không thể tải thông tin đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Lỗi tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!orderId || checking) return;
    
    setChecking(true);
    try {
      const response = await fetch(`/api/sepay/orders/${orderId}/status`);
      const result = await response.json();
      
      if (result.success && result.data.status === 'PAID') {
        setPaymentStatus('success');
        toast.success('Thanh toán thành công!');
        onPaymentSuccess?.();
      }
    } catch (error) {
      console.error('Error checking payment:', error);
    } finally {
      setChecking(false);
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Helper function to get bank info from any available source
  const getBankInfo = () => {
    return {
      bankName: orderData?.paymentInfo?.bankName || orderData?.bankInfo?.bankName || 'MBBank (Ngân hàng Quân đội)',
      accountNumber: orderData?.paymentInfo?.accountNumber || orderData?.bankInfo?.accountNumber || '0776161075',
      accountName: orderData?.paymentInfo?.accountName || orderData?.bankInfo?.accountName || 'TRAN QUOC BAO',
      transferContent: orderData?.paymentInfo?.transferContent || orderData?.bankInfo?.transferContent || `${orderData?.sepayCode || 'DTV'} Payment`,
      amount: orderData?.paymentInfo?.amount || orderData?.bankInfo?.amount || orderData?.amount || 0
    };
  };

  const openBankingApp = () => {
    if (orderData?.deeplink) {
      window.open(orderData.deeplink, '_blank');
    } else {
      toast.info('Vui lòng mở ứng dụng ngân hàng để thanh toán');
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Đang tải thông tin thanh toán</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải thông tin thanh toán...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {paymentStatus === 'success' ? (
              <div className="flex items-center text-green-600">
                <CheckCircle2 className="w-6 h-6 mr-2" />
                Thanh toán thành công
              </div>
            ) : paymentStatus === 'expired' ? (
              <div className="flex items-center text-red-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                Đơn hàng đã hết hạn
              </div>
            ) : (
              <div className="flex items-center text-blue-600">
                <Clock className="w-6 h-6 mr-2" />
                Thanh toán đơn hàng
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        {orderData && (
          <div className="space-y-6">
            {/* Order Info */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Mã đơn hàng:</span>
                    <p className="font-medium">{orderData.sepayCode}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Số tiền:</span>
                    <p className="font-bold text-lg text-blue-600">
                      {formatCurrency(orderData.amount)}
                    </p>
                  </div>
                </div>
                
                {paymentStatus === 'pending' && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-amber-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">Thời gian còn lại:</span>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-600">
                      {formatTime(timeLeft)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {paymentStatus === 'success' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center text-green-700">
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Thanh toán đã được xác nhận. Tài khoản của bạn sẽ được cập nhật trong vài phút.
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {paymentStatus === 'expired' && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center text-red-700 mb-3">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Đơn hàng đã hết hạn thanh toán. Vui lòng tạo đơn hàng mới.
                    </span>
                  </div>
                  <Button onClick={onClose} className="w-full">
                    Đóng
                  </Button>
                </CardContent>
              </Card>
            )}

            {paymentStatus === 'pending' && (
              <>
                {/* QR Code Section */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-4">
                      <QrCode className="w-5 h-5 mr-2" />
                      <span className="font-medium">Quét mã QR để thanh toán</span>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg inline-block border">
                      {orderData?.qrCode ? (
                        <img 
                          src={orderData.qrCode} 
                          alt="QR Code thanh toán"
                          className="w-48 h-48 mx-auto"
                          onLoad={() => console.log('QR Code loaded successfully:', orderData.qrCode)}
                          onError={(e) => {
                            console.error('QR Code failed to load:', orderData.qrCode);
                            console.error('Error details:', e);
                          }}
                        />
                      ) : (
                        <div className="w-48 h-48 mx-auto flex items-center justify-center border-2 border-dashed border-gray-300 rounded">
                          <div className="text-center">
                            <QrCode className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">QR Code đang tải...</p>
                            {orderData?.sepayCode && (
                              <p className="text-xs text-gray-400 mt-1 break-all">
                                Manual URL: https://qr.sepay.vn/img?acc=0776161075&bank=MBBank&amount={getBankInfo().amount}&des={encodeURIComponent(getBankInfo().transferContent)}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                      
                      <div className="mt-4 space-y-2">
                        <Button 
                          onClick={openBankingApp}
                          className="w-full"
                          size="lg"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Mở ứng dụng ngân hàng
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={checkPaymentStatus}
                          disabled={checking}
                          className="w-full"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
                          {checking ? 'Đang kiểm tra...' : 'Kiểm tra thanh toán'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                <Separator />

                {/* Manual Transfer Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center mb-4">
                      <CreditCard className="w-5 h-5 mr-2" />
                      <span className="font-medium">Hoặc chuyển khoản thủ công</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-gray-500">Ngân hàng:</span>
                        <span className="col-span-2 font-medium">
                          {orderData.paymentInfo?.bankName || orderData.bankInfo?.bankName || 'MBBank (Ngân hàng Quân đội)'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-gray-500">Số tài khoản:</span>
                        <div className="col-span-2 flex items-center">
                          <span className="font-medium mr-2">
                            {orderData.paymentInfo?.accountNumber || orderData.bankInfo?.accountNumber || '0776161075'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(
                              orderData.paymentInfo?.accountNumber || orderData.bankInfo?.accountNumber || '0776161075', 
                              'số tài khoản'
                            )}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-gray-500">Chủ tài khoản:</span>
                        <span className="col-span-2 font-medium">{getBankInfo().accountName}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-gray-500">Số tiền:</span>
                        <div className="col-span-2 flex items-center">
                          <span className="font-bold text-blue-600 mr-2">
                            {formatCurrency(getBankInfo().amount)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(getBankInfo().amount.toString(), 'số tiền')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <span className="text-gray-500">Nội dung CK:</span>
                        <div className="col-span-2 flex items-center">
                          <span className="font-medium mr-2 bg-yellow-100 px-2 py-1 rounded text-xs">
                            {getBankInfo().transferContent}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(getBankInfo().transferContent, 'nội dung chuyển khoản')}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Instructions */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Hướng dẫn thanh toán:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                      <li>{orderData?.paymentInstructions?.step1 || orderData?.paymentInfo?.instructions?.[0] || 'Mở ứng dụng ngân hàng của bạn'}</li>
                      <li>{orderData?.paymentInstructions?.step2 || orderData?.paymentInfo?.instructions?.[1] || 'Quét mã QR hoặc chuyển khoản thủ công'}</li>
                      <li>{orderData?.paymentInstructions?.step3 || orderData?.paymentInfo?.instructions?.[2] || `Nhập nội dung: ${getBankInfo().transferContent}`}</li>
                      <li>{orderData?.paymentInstructions?.step4 || orderData?.paymentInfo?.instructions?.[3] || 'Xác nhận giao dịch'}</li>
                      <li>{orderData?.paymentInstructions?.step5 || orderData?.paymentInfo?.instructions?.[4] || 'Hệ thống sẽ tự động xử lý trong 1-2 phút'}</li>
                    </ol>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {paymentStatus === 'success' && (
                <Button onClick={onClose} className="flex-1">
                  Hoàn tất
                </Button>
              )}
              
              {paymentStatus !== 'success' && (
                <>
                  <Button variant="outline" onClick={onClose} className="flex-1">
                    Đóng
                  </Button>
                  {paymentStatus === 'pending' && (
                    <Button 
                      onClick={checkPaymentStatus} 
                      disabled={checking}
                      className="flex-1"
                    >
                      {checking ? 'Kiểm tra...' : 'Kiểm tra thanh toán'}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
