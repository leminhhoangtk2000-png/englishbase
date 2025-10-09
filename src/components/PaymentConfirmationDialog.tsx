'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  Info,
  Shield,
  CheckCircle2
} from 'lucide-react';

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  amount: number;
  currency?: string;
}

export default function PaymentConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  productName,
  amount,
  currency = 'VND'
}: PaymentConfirmationDialogProps) {
  const [hasReadTerms, setHasReadTerms] = React.useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleConfirm = () => {
    if (hasReadTerms) {
      onConfirm();
      // Reset state for next time
      setHasReadTerms(false);
    }
  };

  const handleClose = () => {
    setHasReadTerms(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Shield className="w-6 h-6 mr-3 text-blue-600" />
            Xác Nhận Thanh Toán
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2" />
              Thông tin gói đăng ký
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-600">Gói dịch vụ:</span>
                <span className="font-medium text-blue-800">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Số tiền:</span>
                <span className="font-bold text-lg text-blue-800">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <div className="space-y-2">
                <p className="font-semibold">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Đây là khoản thanh toán nhằm hỗ trợ team phát triển nền tảng</li>
                  <li><strong>Không thể hoàn tiền</strong> sau khi đã thanh toán thành công</li>
                  <li>Vui lòng kiểm tra kỹ thông tin trước khi xác nhận</li>
                  <li>Sau khi thanh toán, tài khoản sẽ được nâng cấp ngay lập tức</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Support Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Cam kết từ Deutsch.vn
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ Truy cập đầy đủ tính năng Premium</li>
              <li>✓ Hỗ trợ kỹ thuật 24/7</li>
              <li>✓ Cập nhật nội dung liên tục</li>
              <li>✓ Tài khoản được bảo mật tuyệt đối</li>
            </ul>
          </div>

          {/* Terms Confirmation */}
          <div className="border-2 border-red-200 bg-red-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms-confirmation"
                checked={hasReadTerms}
                onCheckedChange={(checked) => setHasReadTerms(checked as boolean)}
                className="mt-1"
              />
              <label 
                htmlFor="terms-confirmation" 
                className="text-sm text-red-800 font-medium cursor-pointer leading-5"
              >
                Tôi đã đọc và hiểu rằng <strong>"Đây là khoản thanh toán nhằm hỗ trợ team, không thể hoàn tiền"</strong>. 
                Tôi xác nhận muốn tiếp tục thanh toán cho gói <strong>{productName}</strong> với số tiền <strong>{formatCurrency(amount)}</strong>.
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="flex-1"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!hasReadTerms}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {hasReadTerms ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Tiếp tục thanh toán
              </>
            ) : (
              'Vui lòng xác nhận điều khoản'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
