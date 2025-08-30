import { Separator } from "@/components/ui/separator";

export function IntroductionPage() {
  return (
    <>
      <h2 id="overview">Tổng quan</h2>
      <p>
        Chào mừng bạn đến với khóa học tiếng Đức cấp độ A1 tại Deutsch.vn. 
        Đây là khóa học cơ bản dành cho người mới bắt đầu học tiếng Đức.
      </p>
      <p>
        Khóa học A1 sẽ giúp bạn nắm vững các kiến thức nền tảng của tiếng Đức,
        từ phát âm, ngữ pháp cơ bản đến từ vựng thiết yếu trong đời sống hàng ngày.
      </p>

      <Separator className="my-6" />

      <h2 id="key-features">Tính năng chính</h2>
      <ul>
        <li>
          <strong>Ngữ pháp cơ bản:</strong> Học các cấu trúc ngữ pháp cơ bản
          của tiếng Đức một cách dễ hiểu.
        </li>
        <li>
          <strong>Từ vựng thiết yếu:</strong> Nắm vững khoảng 500-800 từ vựng
          quan trọng nhất trong đời sống.
        </li>
        <li>
          <strong>Phát âm chuẩn:</strong> Luyện phát âm với các âm thanh 
          và video hướng dẫn chi tiết.
        </li>
        <li>
          <strong>Bài tập thực hành:</strong> Hệ thống bài tập đa dạng
          giúp củng cố kiến thức.
        </li>
      </ul>

      <Separator className="my-6" />

      <h2 id="getting-help">Nhận trợ giúp</h2>
      <p>
        Nếu bạn gặp bất kỳ khó khăn nào trong quá trình học, đừng ngần ngại
        liên hệ với cộng đồng học viên hoặc đội ngũ hỗ trợ của chúng tôi.
      </p>

      <blockquote>
        <p>
          Học tiếng Đức không chỉ là học một ngôn ngữ, mà còn là khám phá
          một nền văn hóa phong phú và mở ra nhiều cơ hội mới trong cuộc sống.
        </p>
      </blockquote>
    </>
  );
}
