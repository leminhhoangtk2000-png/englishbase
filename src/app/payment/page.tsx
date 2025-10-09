'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Heart, Star, Coffee, Rocket } from "lucide-react";
import Link from 'next/link';
import * as React from 'react';
import { MainNav } from "@/components/main-nav";

const supporterTiers = [
  {
    id: 'monthly',
    name: 'Premium 1 tháng',
    price: '25.000đ',
    icon: <Coffee className="w-12 h-12" />,
    duration: '1 tháng',
    features: [
      'Theo dõi tiến độ học tập chi tiết',
      'Đặt mục tiêu học tập cá nhân',
      'Xem lại lịch sử hoạt động',
      'Thống kê học tập nâng cao',
      'Bạn đang giúp đỡ 20 bạn học khác'
    ]
  },
  {
    id: 'yearly',
    name: 'Premium 1 năm',
    price: '300.000đ',
    icon: <Heart className="w-12 h-12" />,
    duration: '12 tháng',
    features: [
      'Theo dõi tiến độ học tập chi tiết',
      'Đặt mục tiêu học tập cá nhân', 
      'Xem lại lịch sử hoạt động',
      'Thống kê học tập nâng cao',
      'Bạn đang giúp đỡ 240 bạn học khác'
    ]
  },
  {
    id: 'lifetime',
    name: 'Premium vĩnh viễn',
    price: '500.000đ',
    icon: <Rocket className="w-12 h-12" />,
    duration: 'Vĩnh viễn',
    savings: 'Đầu tư tốt nhất!',
    features: [
      'Theo dõi tiến độ học tập chi tiết',
      'Đặt mục tiêu học tập cá nhân',
      'Xem lại lịch sử hoạt động', 
      'Thống kê học tập nâng cao',
      'Huy hiệu "Lifetime Supporter" đặc biệt',
      'Bạn đang giúp đỡ 400+ bạn học khác'
    ],
    popular: true
  }
];

export default function PaymentPage() {
  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Crown className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold font-headline mb-4">Nâng cấp Premium</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Mở khóa tính năng theo dõi tiến độ học tập, đặt mục tiêu cá nhân và xem thống kê chi tiết để học hiệu quả hơn.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Chào các bạn, về cơ bản bọn mình tính được chi phí cho mỗi người dùng trên tháng là <strong>250đ</strong> thôi. Nhưng để tăng cao trải nghiệm bọn mình có tạo thêm một phần tracking việc học của các bạn. Việc này sẽ tốn khá nhiều dung lượng và dữ liệu máy chủ. Nhưng trung bình một bạn cũng chỉ tiêu tốn hết <strong>20.000đ</strong> chi phí sử dụng nếu sử dụng thêm phần mở rộng.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Do là ý do bọn mình có gói người hỗ trợ <strong>25.000đ</strong>. Nếu các bạn sử dụng gói hỗ trợ này, đồng nghĩa với việc các bạn đang giúp bọn mình <strong>cover chi phí cho một 20 bạn học khác</strong>.
              </p>
              <p className="text-muted-foreground leading-relaxed italic text-center font-medium">
                "Kiến thức là miễn phí, và bọn mình tin chắc việc làm của chúng ta là có ý nghĩa và sẽ ý nghĩa hơn từng ngày."
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Về cơ bản nếu bạn ủng hộ 49.000đ, 99.000đ hay 25.000đ thì <strong>chất lượng trải nghiệm cũng sẽ như nhau</strong>. Vì vậy hãy <strong>cân nhắc kỹ khi hỗ trợ nhé</strong>. Bọn mình sẽ <strong>không thu phí theo hình thức subscription</strong>, đây là khoản phí <strong>trả một lần</strong>, để tránh việc các bạn quên và khoản phí sẽ tự động gia hạn.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {supporterTiers.map((tier) => (
          <Card key={tier.id} className={`relative flex flex-col h-full ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Phổ biến
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4">{tier.icon}</div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">{tier.price}</div>
                {tier.savings && (
                  <div className="text-sm text-green-600 font-medium">
                    {tier.savings}
                  </div>
                )}
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                / {tier.duration}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center pb-2 flex-grow">
              <ul className="space-y-2 text-sm text-left">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="pt-4 mt-auto">
              <Button 
                className={`w-full ${
                  tier.id === 'lifetime' 
                    ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg animate-pulse' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
                asChild
              >
                <Link href={`#`}>
                  {tier.id === 'lifetime' ? '🚀 Mua ngay - Đầu tư tốt nhất!' : 
                   tier.id === 'yearly' ? 'Đăng ký 1 năm' : 'Dùng thử 1 tháng'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Ngoài tiếng Đức</strong>, bọn mình đã và đang xây dựng team để có thể <strong>xây dựng thêm nền tảng học tiếng Anh miễn phí</strong>. Vì vậy <strong>kinh phí là một khoản thật sự cần thiết</strong>.
          </p>
          <p className="font-medium">
            <strong>Rất cảm ơn vì sự ủng hộ của các bạn!</strong>
          </p>
        </div>
      </div>
      </div>
    </>
  );
}
