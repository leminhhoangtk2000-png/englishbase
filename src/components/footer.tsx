
import Link from 'next/link';
import { MapPin, Mail, Youtube, Instagram, Facebook } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
            <div className="col-span-1 md:col-span-2">
              <h3 className="font-bold text-lg mb-2">Deutsch.vn</h3>
              <p className="text-muted-foreground mb-4">Cùng nhau xây dựng một cộng đồng học tiếng Đức cởi mở, thân thiện và hiệu quả cho người Việt.</p>
              <div className="flex gap-4">
                <Link href="#"><Facebook className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#"><Instagram className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
                <Link href="#"><Youtube className="w-6 h-6 text-muted-foreground hover:text-primary" /></Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-1 shrink-0"/><span>Tp. Hồ Chí Minh, Việt Nam</span></li>
                <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-1 shrink-0" /><span>deutschvn.info@gmail.com</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Thông tin</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary">Về dự án</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Lộ trình</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Đội nhóm</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Liên hệ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Partner</h4>
              <ul className="space-y-3">
                 <li><Link href="#" className="text-muted-foreground hover:text-primary">Deutsche Ecke</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Copyright © {new Date().getFullYear()} Deutsch.vn</p>
          </div>
      </div>
    </footer>
  );
}
