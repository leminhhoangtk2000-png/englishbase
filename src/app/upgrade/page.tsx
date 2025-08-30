'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, Heart, Star } from "lucide-react";
import Link from 'next/link';
import * as React from 'react';

const supporterTiers = [
  {
    id: 'bronze',
    name: 'Người hỗ trợ Đồng',
    price: '25.000đ',
    icon: '🥉',
    description: ' 250đ thôi. Bạn đã hỗ trợ chi phí học cho 20 bạn.',
    features: [
      'Truy cập đầy đủ tất cả nội dung',
      'Huy hiệu "Người hỗ trợ" đặc biệt',
      'Bạn đang giúp đỡ 100 bạn học',
      'Góp phần duy trì server và chi phí'
    ]
  },
  {
    id: 'silver',
    name: 'Người hỗ trợ Bạc',
    icon: '🥈',
    price: '49.000đ',
    description: ' 250đ thôi. Bạn đã hỗ trợ chi phí học cho 116 bạn.',
    features: [
      'Tất cả tính năng gói Đồng',
      'Huy hiệu "Người hỗ trợ" đặc biệt',
      'Bạn đang giúp đỡ 196 bạn học',
      'Góp phần phát triển tính năng mới'
    ],
    popular: true
  },
  {
    id: 'gold',
    name: 'Người hỗ trợ Vàng',
    icon: '🥇',
    price: '99.000đ',
    description: ' 250đ thôi. Bạn đã hỗ trợ chi phí học cho 316 bạn.',
    features: [
      'Tất cả tính năng gói Bạc',
      'Huy hiệu "Người hỗ trợ" đặc biệt',
      'Bạn đang giúp đỡ 396 bạn học',
      'Góp phần phát triển nội dung mới'
    ]
  }
];

export default function UpgradePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Crown className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold font-headline mb-4">Trở thành người hỗ trợ</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Giúp duy trì và phát triển nền tảng học tiếng Đức miễn phí cho cộng đồng
        </p>
      </div>

      {/* Mission Statement */}
      <div className="max-w-4xl mx-auto mb-12">
        <Card className="border-2 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Sứ mệnh của chúng tôi</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Đây là một dự án <strong>không nhằm mục đích thu lợi nhuận</strong>. 
                  Nhưng hiện tại dự án đang trong đà phát triển quá nhanh, bọn mình đã bắt đầu phải 
                  thuê server riêng, và có nhiều chi phí phát sinh khác.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Vì vậy có một vài phần <strong>không quá quan trọng</strong>, chỉ nhằm mục đích 
                  <strong> tăng cao trải nghiệm</strong> bọn mình sẽ giới hạn lại để tiết kiệm chi phí dự án.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Đó là lý do bọn mình có gói người hỗ trợ <strong>25.000đ</strong>. 
                  Nếu các bạn sử dụng gói hỗ trợ này, đồng nghĩa với việc các bạn đang giúp bọn mình 
                  <strong> cover chi phí cho 100 bạn học khác</strong>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
        {supporterTiers.map((tier) => (
          <Card key={tier.id} className={`relative ${tier.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Phổ biến
                </div>
              </div>
            )}
            
            <CardHeader className="text-center pb-2">
              <div className="text-4xl mb-2">{tier.icon}</div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="text-center pb-2">
              <div className="text-3xl font-bold text-primary mb-4">{tier.price}</div>
              <ul className="space-y-2 text-sm text-left">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter className="pt-4">
              <Button 
                className="w-full" 
                variant={tier.popular ? 'default' : 'outline'}
                asChild
              >
                <Link href={`/payment?tier=${tier.id}`}>
                  Chọn gói {tier.name.split(' ').slice(-1)[0]}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="max-w-2xl mx-auto text-center">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Lưu ý quan trọng</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Đây là phần <strong>không thật sự cần thiết cho việc học</strong>, 
              bọn mình làm phần này vì <strong>đam mê</strong> tạo ra một sản phẩm trải nghiệm tốt. 
              Nếu các bạn không có nhu cầu đó thì <strong>không cần trả phí</strong> cho phần này đâu nha.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
