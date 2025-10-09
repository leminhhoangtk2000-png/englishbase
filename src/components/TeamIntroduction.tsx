'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  DollarSign, 
  Award,
  CheckCircle2,
  MapPin,
  Briefcase
} from 'lucide-react';

export default function TeamIntroduction() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Team Introduction */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Đội Ngũ Deutsch.vn
          </CardTitle>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi là một đội ngũ chuyên gia về giáo dục tiếng Đức, 
            cam kết mang đến trải nghiệm học tập tốt nhất cho học viên Việt Nam.
          </p>
        </CardHeader>
      </Card>

      {/* CFO Introduction */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <DollarSign className="w-6 h-6 mr-3 text-green-600" />
            Giám Đốc Tài Chính - Trần Quốc Bảo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-2">Vai trò và trách nhiệm</h4>
              <p className="text-gray-600 mb-3">
                <strong>Trần Quốc Bảo</strong> là Giám đốc Tài chính (CFO) của Deutsch.vn, 
                chịu trách nhiệm quản lý toàn bộ các giao dịch tài chính và thanh toán của công ty.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Quản lý tài chính công ty</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Xử lý thanh toán học phí</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Kiểm soát ngân sách</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Báo cáo tài chính</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Tuân thủ quy định</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm">Hỗ trợ học viên</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Security */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Shield className="w-6 h-6 mr-3 text-blue-600" />
            Bảo Mật Thanh Toán
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Thông Tin Tài Khoản Chính Thức
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Ngân hàng:</span>
                <p className="text-gray-700">MBBank (Quân đội)</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Chủ tài khoản:</span>
                <p className="text-gray-700">TRAN QUOC BAO</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Số tài khoản:</span>
                <p className="text-gray-700 font-mono">0776161075</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Cam kết an toàn:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <Badge variant="outline" className="mt-1 mr-3 text-green-600 border-green-600">
                  ✓
                </Badge>
                <div>
                  <span className="font-medium">Tài khoản chính thức</span>
                  <p className="text-sm text-gray-600">
                    Đây là tài khoản ngân hàng chính thức duy nhất của Deutsch.vn
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge variant="outline" className="mt-1 mr-3 text-green-600 border-green-600">
                  ✓
                </Badge>
                <div>
                  <span className="font-medium">Bảo mật SePay</span>
                  <p className="text-sm text-gray-600">
                    Tích hợp SePay để theo dõi giao dịch tự động và an toàn
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge variant="outline" className="mt-1 mr-3 text-green-600 border-green-600">
                  ✓
                </Badge>
                <div>
                  <span className="font-medium">Xác nhận nhanh</span>
                  <p className="text-sm text-gray-600">
                    Thanh toán được xác nhận tự động trong 1-2 phút
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Badge variant="outline" className="mt-1 mr-3 text-green-600 border-green-600">
                  ✓
                </Badge>
                <div>
                  <span className="font-medium">Hỗ trợ 24/7</span>
                  <p className="text-sm text-gray-600">
                    Đội ngũ tài chính luôn sẵn sàng hỗ trợ khi cần
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-l-4 border-l-red-500 bg-red-50">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Lưu ý quan trọng
          </h4>
          <p className="text-red-700 text-sm">
            <strong>Deutsch.vn chỉ có duy nhất một tài khoản ngân hàng chính thức:</strong> 
            <span className="font-mono bg-red-100 px-2 py-1 rounded ml-1">0776161075 - TRAN QUOC BAO - MBBank</span>
            <br />
            Vui lòng không chuyển tiền vào bất kỳ tài khoản nào khác để tránh bị lừa đảo.
          </p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardContent className="p-6 text-center">
          <h4 className="font-semibold text-gray-800 mb-2">Cần hỗ trợ?</h4>
          <p className="text-gray-600 text-sm mb-4">
            Nếu bạn có bất kỳ thắc mắc nào về thanh toán hoặc tài chính, 
            đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              📧 finance@deutsch.vn
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              📞 Hotline: 1900-xxxx
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
