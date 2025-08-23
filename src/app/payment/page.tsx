"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, ArrowRight, Home, Banknote, ShieldCheck, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = {
  bronze: { name: "Người hỗ trợ Đồng", price: 25000, icon: "🥉" },
  silver: { name: "Người hỗ trợ Bạc", price: 49000, icon: "🥈" },
  gold: { name: "Người hỗ trợ Vàng", price: 99000, icon: "🥇" },
};

const durations = [
  { value: "1", label: "1 tháng" },
  { value: "3", label: "3 tháng" },
  { value: "6", label: "6 tháng" },
  { value: "12", label: "12 tháng" },
];

const steps = [
  { id: 1, name: "Chọn gói" },
  { id: 2, name: "Chính sách" },
  { id: 3, name: "Thanh toán" },
  { id: 4, name: "Hoàn tất" },
];

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<keyof typeof tiers>("bronze");
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  useEffect(() => {
    const tierParam = searchParams.get("tier");
    if (tierParam && tierParam in tiers) {
      setSelectedTier(tierParam as keyof typeof tiers);
    }
  }, [searchParams]);

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const totalAmount = tiers[selectedTier].price * parseInt(selectedDuration);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Stepper */}
        <div className="mb-12 flex items-center justify-between">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center text-center">
                        <div
                            className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors",
                                currentStep > step.id ? "bg-primary border-primary text-primary-foreground" :
                                currentStep === step.id ? "border-primary text-primary" : "border-border bg-muted text-muted-foreground"
                            )}
                        >
                           {currentStep > step.id ? <CheckCircle className="h-6 w-6" /> : <span className="font-bold">{step.id}</span>}
                        </div>
                        <p className={cn(
                            "mt-2 text-sm font-medium",
                            currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                        )}>{step.name}</p>
                    </div>
                    {index < steps.length - 1 && (
                        <div className={cn(
                            "flex-1 h-1 mx-4 transition-colors",
                             currentStep > index + 1 ? "bg-primary" : "bg-border"
                        )} />
                    )}
                </React.Fragment>
            ))}
        </div>

        <Card>
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><Banknote className="w-6 h-6"/>Chọn Gói Hỗ Trợ</CardTitle>
                <CardDescription>Chọn gói và thời gian bạn muốn hỗ trợ dự án.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Label className="text-base font-semibold">Chọn gói</Label>
                  <RadioGroup value={selectedTier} onValueChange={(value) => setSelectedTier(value as keyof typeof tiers)} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    {Object.entries(tiers).map(([key, tier]) => (
                      <Label key={key} htmlFor={key} className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:border-primary", { "border-primary bg-primary/5": selectedTier === key })}>
                        <RadioGroupItem value={key} id={key} className="sr-only" />
                        <span className="text-4xl mb-2">{tier.icon}</span>
                        <span className="font-bold">{tier.name}</span>
                        <span className="text-muted-foreground text-sm">{tier.price.toLocaleString()}đ / tháng</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label className="text-base font-semibold">Chọn thời hạn</Label>
                  <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {durations.map(duration => (
                      <Label key={duration.value} htmlFor={`duration-${duration.value}`} className={cn("flex items-center justify-center rounded-md border p-4 cursor-pointer hover:border-primary", { "border-primary bg-primary/5": selectedDuration === duration.value })}>
                        <RadioGroupItem value={duration.value} id={`duration-${duration.value}`} className="sr-only" />
                        <span className="font-medium">{duration.label}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <div className="text-center bg-muted p-4 rounded-lg">
                  <p className="text-muted-foreground">Tổng cộng</p>
                  <p className="text-3xl font-bold">{totalAmount.toLocaleString()}đ</p>
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button onClick={handleNextStep}>Tiếp tục <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </CardFooter>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><ShieldCheck className="w-6 h-6"/>Điều Khoản và Chính Sách</CardTitle>
                <CardDescription>Vui lòng đọc và đồng ý với các điều khoản của chúng tôi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-h-60 overflow-y-auto border p-4 rounded-md">
                  <h4>Đây là khoản phí trả một lần</h4>
                  <p>Chúng tôi không thu phí theo hình thức đăng ký tự động gia hạn (subscription). Khoản hỗ trợ của bạn là khoản phí một lần để tránh việc các bạn quên và bị trừ tiền không mong muốn.</p>
                  <h4>Ý nghĩa của việc hỗ trợ</h4>
                  <p>Khoản phí này giúp chúng tôi trang trải chi phí máy chủ và phát triển các tính năng mới, cũng như hỗ trợ chi phí cho các bạn học sinh, sinh viên khác. Toàn bộ kiến thức cốt lõi trên nền tảng sẽ luôn được miễn phí.</p>
                  <h4>Hoàn tiền</h4>
                  <p>Vì đây là một khoản đóng góp tự nguyện để hỗ trợ cộng đồng, chúng tôi rất tiếc không thể thực hiện chính sách hoàn tiền. Rất mong bạn cân nhắc kỹ trước khi thực hiện giao dịch.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={agreedToPolicy} onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)} />
                  <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Tôi đã đọc và đồng ý với các điều khoản
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>Quay lại</Button>
                <Button onClick={handleNextStep} disabled={!agreedToPolicy}>Xác nhận và Thanh toán <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </CardFooter>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><QrCode className="w-6 h-6"/>Thanh Toán</CardTitle>
                <CardDescription>Quét mã QR dưới đây để hoàn tất thanh toán.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6">
                <p>Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã.</p>
                <div className="p-4 border-4 border-primary rounded-lg bg-white">
                   <Image src="https://placehold.co/256x256.png" data-ai-hint="qr code" width={256} height={256} alt="Mã QR thanh toán" />
                </div>
                <div className="text-center w-full">
                    <p className="text-sm text-muted-foreground">Số tiền</p>
                    <p className="text-2xl font-bold">{totalAmount.toLocaleString()}đ</p>
                    <p className="text-sm text-muted-foreground mt-2">Nội dung chuyển khoản</p>
                    <p className="text-lg font-mono p-2 bg-muted rounded-md inline-block">DEUTSCHVN {Math.floor(Math.random() * 900000) + 100000}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevStep}>Quay lại</Button>
                <Button onClick={handleNextStep}>Tôi đã thanh toán</Button>
              </CardFooter>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader className="items-center text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <CardTitle className="text-2xl font-headline">Thanh Toán Thành Công!</CardTitle>
                <CardDescription>Cảm ơn bạn rất nhiều vì đã hỗ trợ dự án Deutsch.vn!</CardDescription>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground">
                <p>Tài khoản của bạn đã được nâng cấp. Huy hiệu "Người hỗ trợ" sẽ sớm xuất hiện trên hồ sơ của bạn.</p>
                <p className="mt-2">Sự đóng góp của bạn là động lực to lớn để chúng tôi tiếp tục phát triển.</p>
              </CardContent>
              <CardFooter className="justify-center">
                 <Button asChild>
                    <Link href="/"><Home className="mr-2 w-4 h-4" /> Về trang chủ</Link>
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
