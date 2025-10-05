import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center space-x-2", className)}>
      <Image
        src="/avt.png"
        alt="Deutsch.vn Logo"
        width={32}
        height={32}
        className="rounded-lg"
        priority
      />
      <span className="font-body text-xl font-bold">Deutsch.vn</span>
    </Link>
  );
}
