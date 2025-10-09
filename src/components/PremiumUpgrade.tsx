'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Download,
  MessageCircle,
  BookOpen,
  Award,
  Clock,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import PaymentModal from './PaymentModal';
import PaymentConfirmationDialog from './PaymentConfirmationDialog';

interface PremiumUpgradeProps {
  userId?: string;
  currentPlan?: 'free' | 'premium';
  onUpgradeSuccess?: () => void;
}

interface PricingTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration: string;
  popular?: boolean;
  savings?: string;
  features: string[];
  description: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'premium-1month',
    name: 'Premium 1 Tháng',
    price: 199000,
    duration: '1 tháng',
    description: 'Trải nghiệm đầy đủ tính năng Premium',
    features: [
      'Truy cập toàn bộ khóa học',
      'Tải tài liệu PDF không giới hạn',
      'Học 1-1 với giáo viên',
      'Bài tập nâng cao',
      'Hỗ trợ 24/7',
      'Chứng chỉ hoàn thành'
    ]
  },
  {
    id: 'premium-3months',
    name: 'Premium 3 Tháng',
    price: 499000,
    originalPrice: 597000,
    duration: '3 tháng',
    popular: true,
    savings: 'Tiết kiệm 98.000đ',
    description: 'Lựa chọn phổ biến nhất - tiết kiệm 16%',
    features: [
      'Tất cả tính năng Premium',
      'Kế hoạch học cá nhân hóa',
      'Nhóm học tập riêng',
      'Workshop trực tuyến hàng tuần',
      'Tư vấn việc làm',
      'Ưu tiên hỗ trợ'
    ]
  },
  {
    id: 'premium-6months',
    name: 'Premium 6 Tháng',
    price: 899000,
    originalPrice: 1194000,
    duration: '6 tháng',
    savings: 'Tiết kiệm 295.000đ',
    description: 'Gói học nghiêm túc - tiết kiệm 25%',
    features: [
      'Tất cả tính năng Premium',
      'Đánh giá tiến độ chi tiết',
      'Mock test B1/B2 không giới hạn',
      'Mentoring 1-1 hàng tuần',
      'Tham gia cộng đồng VIP',
      'Cam kết đầu ra'
    ]
  }
];

export default function PremiumUpgrade({ userId, currentPlan = 'free', onUpgradeSuccess }: PremiumUpgradeProps) {
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleUpgrade = async (tier: PricingTier) => {
    if (!userId) {
      toast.error('Vui lòng đăng nhập để nâng cấp');
      return;
    }

    // Show confirmation dialog first
    setSelectedTier(tier);
    setConfirmationDialogOpen(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedTier) return;
    
    setConfirmationDialogOpen(false);
    setLoading(true);

    try {
      const response = await fetch('/api/sepay/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          productType: 'PREMIUM_MEMBERSHIP',
          productId: selectedTier.id,
          productName: selectedTier.name,
          amount: selectedTier.price,
          currency: 'VND',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.data.orderId);
        setPaymentModalOpen(true);
        toast.success('Đã tạo đơn hàng thành công!');
      } else {
        toast.error(result.message || 'Không thể tạo đơn hàng');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      toast.error('Lỗi hệ thống, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentModalOpen(false);
    setOrderId(null);
    setSelectedTier(null);
    toast.success('Nâng cấp Premium thành công! 🎉');
    onUpgradeSuccess?.();
  };

  const handleCloseConfirmation = () => {
    setConfirmationDialogOpen(false);
    setSelectedTier(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (currentPlan === 'premium') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Bạn đã là thành viên Premium!</h2>
            <p className="text-gray-600">
              Bạn đang tận hưởng tất cả tính năng cao cấp của Deutsch.vn
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <span className="text-sm">Khóa học đầy đủ</span>
            </div>
            <div className="text-center">
              <Download className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <span className="text-sm">Tài liệu Premium</span>
            </div>
            <div className="text-center">
              <MessageCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <span className="text-sm">Hỗ trợ 1-1</span>
            </div>
          </div>
          
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            Vào Dashboard học tập
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Nâng cấp lên 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 ml-2">
            Premium
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Mở khóa toàn bộ tính năng cao cấp và tăng tốc quá trình học tiếng Đức của bạn
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Khóa học đầy đủ</h3>
          <p className="text-gray-600 text-sm">
            Truy cập không giới hạn tất cả khóa học từ A1 đến B2
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Học 1-1</h3>
          <p className="text-gray-600 text-sm">
            Học riêng với giáo viên bản ngữ, được cá nhân hóa
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Chứng chỉ</h3>
          <p className="text-gray-600 text-sm">
            Nhận chứng chỉ hoàn thành được công nhận
          </p>
        </Card>
      </div>

      {/* Pricing Tiers */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {pricingTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`relative ${tier.popular ? 'border-2 border-blue-600 shadow-lg' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Phổ biến nhất
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="mt-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold">{formatPrice(tier.price)}</span>
                  {tier.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(tier.originalPrice)}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">cho {tier.duration}</p>
                {tier.savings && (
                  <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                    {tier.savings}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">{tier.description}</p>
            </CardHeader>
            
            <CardContent>
              <Button 
                onClick={() => handleUpgrade(tier)}
                disabled={loading && selectedTier?.id === tier.id}
                className={`w-full mb-6 ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                size="lg"
              >
                {loading && selectedTier?.id === tier.id ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Nâng cấp ngay
                  </>
                )}
              </Button>
              
              <Separator className="mb-4" />
              
              <div className="space-y-3">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Support Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-semibold mb-2">Hỗ trợ tận tâm</h3>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Đây là khoản thanh toán nhằm hỗ trợ team phát triển nền tảng giáo dục. 
            Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất cho bạn.
          </p>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <PaymentConfirmationDialog
        isOpen={confirmationDialogOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmPayment}
        productName={selectedTier?.name || ''}
        amount={selectedTier?.price || 0}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        orderId={orderId || undefined}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
