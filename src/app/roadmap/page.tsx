'use client';

import { MainNav } from "@/components/main-nav";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Database, Shield, GraduationCap, BookOpen, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function RoadmapPage() {
  const [visiblePhases, setVisiblePhases] = useState<number[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const phaseId = parseInt(entry.target.getAttribute('data-phase') || '0');
          setVisiblePhases(prev => {
            if (!prev.includes(phaseId)) {
              return [...prev, phaseId].sort((a, b) => a - b);
            }
            return prev;
          });
        }
      });
    }, observerOptions);

    // Observe all phase elements
    setTimeout(() => {
      const phaseElements = document.querySelectorAll('[data-phase]');
      phaseElements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);
  const phases = [
    {
      id: 1,
      title: "Giai đoạn 1",
      icon: <GraduationCap className="w-16 h-16 text-blue-600" />,
      items: [
        "Xây dựng nền tảng học tiếng Đức miễn phí.",
        "Cung cấp thông tin liên mạch, các tài liệu học có bản văn logic.",
        "Trang web không chứa quảng cáo, tập trung vào trải nghiệm học tập."
      ],
      illustration: "👨‍🎓"
    },
    {
      id: 2,
      title: "Giai đoạn 2", 
      icon: <Users className="w-16 h-16 text-green-600" />,
      items: [
        "Tích hợp tính năng đăng ký gía)",
        "để có thể nhận hoá trại nghiệm học.",
        "Tạo các bài tập tương tác, giúp người học rèn luyện kỹ năng.",
        "Mỗi người có thể giới độ gồp ý và đóng viên lần nhau."
      ],
      illustration: "📋"
    },
    {
      id: 3,
      title: "Giai đoạn 3",
      icon: <Database className="w-16 h-16 text-purple-600" />,
      items: [
        "Tích hợp hệ thống theo dõi quá trình học tập cá nhân.",
        "Xây dựng thư viện để hỗ trợ người học luyện tập.",
        "Cung cấp lời khuyên và lộ trình phù hợp cho người học."
      ],
      illustration: "📊"
    },
    {
      id: 4,
      title: "Giai đoạn 4",
      icon: <Shield className="w-16 h-16 text-orange-600" />,
      items: [
        "Tích hợp cộng cụ Moodle hoặc các hệ thống LMS giúp giáo viên quản lý lớp học.",
        "Tăng tương tác giữa giáo viên và học viên."
      ],
      illustration: "👥"
    },
    {
      id: 5,
      title: "Giai đoạn 5",
      icon: <BookOpen className="w-16 h-16 text-teal-600" />,
      items: [
        "Tạo nền tảng giúp người học có thể tự tạo workshop.",
        "Hỗ trợ thành toán.",
        "Xây dựng trang portfolio giúp xác minh trình độ người tạo workshop.",
        "Hỗ trợ các trung tâm dạy học có tâm trong việc bán khóa học."
      ],
      illustration: "🎓"
    },
    {
      id: 6,
      title: "Giai đoạn 6",
      icon: <Trophy className="w-16 h-16 text-red-600" />,
      items: [
        "Xây dựng quy trình thành toán an toàn cho du học sinh.",
        "Xây dựng quy trình ra soát 'quy trình làm hồ sơ' của đơn vị dịch vụ.",
        "Tăng tính minh bạch và giảm rủi ro."
      ],
      illustration: "🛡️"
    },
    {
      id: 7,
      title: "Giai đoạn 7",
      icon: <CheckCircle className="w-16 h-16 text-indigo-600" />,
      items: [
        "Mua bản quyền và đến xuất bản sách đầu sách chất lượng về tiếng Đức."
      ],
      illustration: "📚"
    }
  ];

  return (
    <>
      <MainNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Kế hoạch phát triển dự án
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Lộ trình phát triển từng bước để xây dựng nền tảng học tiếng Đức toàn diện và chuyên nghiệp
          </p>
        </div>

        {/* Phases with Simple Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Simple Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 bg-gray-300 dark:bg-gray-600 h-full">
            {/* Progressive timeline fill */}
            <div 
              className="w-full bg-blue-500 transition-all duration-1000 ease-out"
              style={{ 
                height: `${(visiblePhases.length / phases.length) * 100}%`
              }}
            />
          </div>

          {/* Timeline Numbers */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full h-full pointer-events-none">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="absolute left-1/2 transform -translate-x-1/2"
                style={{ 
                  top: `${((phase.id - 1) / (phases.length - 1)) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full border-2 
                  font-semibold text-sm transition-all duration-500
                  ${visiblePhases.includes(phase.id) 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-400'
                  }
                `}>
                  {phase.id}
                </div>
              </div>
            ))}
          </div>

          {/* Phase Content */}
          <div className="space-y-16 pt-4 pb-4">
            {phases.map((phase, index) => (
              <div 
                key={phase.id} 
                data-phase={phase.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-start transition-all duration-700 ${
                  visiblePhases.includes(phase.id) 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-30 transform translate-y-4'
                } ${index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'}`}
              >
                {/* Content */}
                <div className={`${index % 2 === 0 ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'}`}>
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {phase.title}
                    </h2>
                    <div className="w-8 h-0.5 bg-blue-500 rounded-full"></div>
                  </div>
                  
                  <Card className="shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <CardContent className="p-4">
                      <ul className="space-y-2">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start text-sm">
                            <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3"></div>
                            <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Illustration */}
                <div className={`${index % 2 === 0 ? 'lg:order-2 lg:pl-8' : 'lg:order-1 lg:pr-8'}`}>
                  <Card className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-3 opacity-80">
                          {phase.illustration}
                        </div>
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          {phase.title}
                        </div>
                        <div className="opacity-50 scale-75">
                          {phase.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <Card className="border shadow-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Cùng nhau xây dựng tương lai
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Mỗi giai đoạn đều hướng đến mục tiêu tạo ra một hệ sinh thái học tiếng Đức 
                toàn diện, minh bạch và hiệu quả cho cộng đồng Việt Nam.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
