import { Separator } from "@/components/ui/separator";

export function IntroductionPage() {
  return (
    <>
      <h2 id="overview">Tổng quan</h2>
      <p>
        Chào mừng bạn đến với khóa học tiếng Đức cấp độ A2 tại Deutsch.vn. 
        Đây là khóa học trung cấp thấp dành cho những ai đã hoàn thành cấp độ A1.
      </p>
      <p>
        Khóa học A2 sẽ giúp bạn phát triển thêm kỹ năng nghe, nói, đọc, viết
        và mở rộng vốn từ vựng cũng như kiến thức ngữ pháp.
      </p>

      <Separator className="my-6" />

      <h2 id="key-features">Tính năng chính</h2>
      <ul>
        <li>
          <strong>Ngữ pháp nâng cao:</strong> Học các cấu trúc ngữ pháp 
          phức tạp hơn như thì quá khứ, tương lai.
        </li>
        <li>
          <strong>Từ vựng mở rộng:</strong> Nắm vững khoảng 1000-1500 từ vựng
          trong các chủ đề đa dạng.
        </li>
        <li>
          <strong>Giao tiếp thực tế:</strong> Luyện tập các tình huống giao tiếp
          hàng ngày như mua sắm, đặt phòng.
        </li>
        <li>
          <strong>Đọc hiểu cơ bản:</strong> Đọc và hiểu các văn bản ngắn,
          thông báo, email đơn giản.
        </li>
      </ul>

      <Separator className="my-6" />

      <h2 id="getting-help">Nhận trợ giúp</h2>
      <p>
        Nếu bạn gặp bất kỳ khó khăn nào trong quá trình học cấp độ A2, 
        cộng đồng học viên và đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn.
      </p>

      <blockquote>
        <p>
          Cấp độ A2 là bước đệm quan trọng giúp bạn tự tin hơn trong việc
          sử dụng tiếng Đức trong các tình huống cơ bản của cuộc sống.
        </p>
      </blockquote>
    </>
  );
}
