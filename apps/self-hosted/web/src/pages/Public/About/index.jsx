import FeatureList from "@/components/ui/FeatureList";
import MockupiPhone from "@/components/ui/MockupiPhone";
import React from "react";
import Marquee from "react-fast-marquee";
import RotatingCircleText from "./RotatingCircleText";

export default function AboutLocketQQ() {
  return (
    <section className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Giới thiệu về <span className="text-purple-600">Locket QQ</span>
          </h1>
          <p className="text-lg text-base-content/80 max-w-2xl mx-auto">
            Locket QQ — nền tảng mở rộng dành cho Locket Widget, giúp bạn chia
            sẻ ảnh và video trực tiếp với giao diện hiện đại, nhanh chóng và
            tiện lợi.
          </p>
        </div>

        {/* Demo & Features */}
        <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
          <div className="flex justify-center">
            <MockupiPhone />
          </div>
          <div>
            <FeatureList />
          </div>
        </div>

        {/* What is Locket QQ */}
        <div className="bg-base-300 rounded-3xl shadow-md p-5 mb-8">
          <h2 className="text-2xl font-bold mb-4">Locket QQ là gì?</h2>
          <p className="text-base-content/80 leading-relaxed mb-3">
            - Locket QQ là nền tảng web được thiết kế để mở rộng khả năng của
            ứng dụng Locket Widget. Với Locket QQ, bạn có thể dễ dàng tải lên
            và chia sẻ ảnh, video từ máy tính hoặc bất kỳ thiết bị nào có trình
            duyệt web. <br />- Là một dự án cá nhân, hoạt động độc lập. Không
            liên kết với bên thứ ba nào khác ngoài QQ.
          </p>
          <p className="text-base-content/80 leading-relaxed text-sm">
            *Không cần cài đặt ứng dụng, không cần chuyển file phức tạp — chỉ
            cần truy cập website, đăng nhập và chia sẻ những khoảnh khắc đáng
            nhớ cùng bạn bè và người thân.
          </p>
        </div>

        {/* Mission & Story */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-base-300 rounded-xl shadow-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl font-semibold">Sứ mệnh</h3>
            </div>
            <p className="text-base-content/80 leading-relaxed">
              Mang đến trải nghiệm chia sẻ khoảnh khắc đơn giản, nhanh chóng và
              tiện lợi nhất cho người dùng Locket Widget trên mọi thiết bị.
            </p>
          </div>

          <div className="bg-base-300 rounded-xl shadow-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">💡</span>
              <h3 className="text-xl font-semibold">Câu chuyện</h3>
            </div>
            <p className="text-base-content/80 leading-relaxed">
              “Locket QQ” được tạo ra từ nhu cầu thực tế:
              <br />• Làm sao để chia sẻ ảnh từ máy tính hoặc điện thoại lên
              Locket Widget mà không cần mua gói Locket Gold? <br />• Làm sao để
              đổi màu caption theo sở thích cá nhân? <br />• Làm sao để truy cập
              các tính năng ẩn của Locket?
              <br />
              Từ những câu hỏi đó, Locket QQ ra đời như một giải pháp mở rộng,
              giúp người dùng tận hưởng trọn vẹn trải nghiệm Locket — không giới
              hạn bởi thiết bị hay nền tảng.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl py-6 mb-8 shadow-sm overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-center text-primary">
            Giá trị cốt lõi
            <RotatingCircleText />
          </h2>
          <Marquee speed={30}>
            <div className="flex items-center gap-6 px-2">
              <div className="bg-base-300 rounded-lg px-6 py-4 text-center w-50">
                <div className="text-4xl mb-2">💻</div>
                <h3 className="font-semibold mb-1">Đa nền tảng</h3>
                <p className="text-sm text-gray-600">
                  Hỗ trợ mọi thiết bị: PC, laptop, tablet
                </p>
              </div>
              <div className="bg-base-300 rounded-lg px-6 py-4 text-center w-50">
                <div className="text-4xl mb-2">🚀</div>
                <h3 className="font-semibold mb-1">Nhanh & tiện lợi</h3>
                <p className="text-sm text-gray-600">
                  Giao diện tối ưu, tốc độ vượt trội
                </p>
              </div>
              <div className="bg-base-300 rounded-lg px-6 py-4 text-center w-50">
                <div className="text-4xl mb-2">🔄</div>
                <h3 className="font-semibold mb-1">Đồng bộ tức thì</h3>
                <p className="text-sm text-gray-600">
                  Ảnh và video được cập nhật ngay lập tức
                </p>
              </div>
              <div className="bg-base-300 rounded-lg px-6 py-4 text-center w-50">
                <div className="text-4xl mb-2">🛡️</div>
                <h3 className="font-semibold mb-1">Bảo mật</h3>
                <p className="text-sm text-gray-600">
                  Dữ liệu luôn được đảm bảo an toàn
                </p>
              </div>
            </div>
          </Marquee>
        </div>

        {/* Technology & Community */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">
              ⚙️ Công nghệ hiện đại
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Xây dựng trên nền tảng web mới nhất, đảm bảo tốc độ, bảo mật và
              trải nghiệm mượt mà. Tôi luôn không ngừng cập nhật, tối ưu để mang
              lại hiệu năng tốt nhất.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">
              🧩 Thách thức trong quá trình phát triển
            </h3>

            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Mặc dù Locket QQ được xây dựng với nền tảng web hiện đại, mình
              vẫn gặp không ít khó khăn trong quá trình phát triển và tối ưu để
              mọi người có thể sử dụng mượt mà nhất.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Một số thiết bị cũ — đặc biệt là các máy iPhone đời thấp (iOS 13
              trở xuống) hoặc trình duyệt cũ — có thể không hiển thị đúng giao
              diện hoặc không truy cập được một số tính năng nâng cao.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Tuy vậy, mình luôn theo dõi phản hồi, tối ưu từng phần, và cố gắng
              mang lại trải nghiệm tốt nhất trên nhiều thiết bị nhất có thể — từ
              điện thoại cũ đến laptop hiện đại. Đây là hành trình lâu dài,
              nhưng cũng chính là động lực để Locket QQ ngày càng hoàn thiện
              hơn.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5">
            <h3 className="text-lg font-semibold mb-3 text-purple-600">
              👥 Cộng đồng & Cảm ơn
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Locket QQ được phát triển bởi QQ — người yêu công nghệ và đam mê
              sáng tạo. Tôi luôn lắng nghe phản hồi từ cộng đồng để không ngừng
              hoàn thiện sản phẩm.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-2">
              Xin gửi lời cảm ơn chân thành đến cộng đồng{" "}
              <strong>J2Team</strong> đã chia sẻ nhiều tài nguyên và API hữu
              ích, giúp mình hiểu rõ hơn và phát triển dự án này.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cảm ơn những nhà tài trợ đã đóng góp và đồng hành với "Locket QQ"
              trong suốt thời gian phát triển vừa qua.
            </p>
          </div>
          <div className="relative bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl shadow-md p-5 overflow-hidden">
            {/* Vòng tròn đồng tâm động (phía sau nội dung, phía trên nền) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute -top-12 -right-12 w-24 h-24 border-2 border-purple-300 rounded-full opacity-30 animate-pulse-circle" />
              <div
                className="absolute -top-16 -right-16 w-32 h-32 border-2 border-purple-400 rounded-full opacity-20 animate-pulse-circle"
                style={{ animationDelay: "0.6s" }}
              />
            </div>

            {/* Nội dung */}
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-3 text-purple-700 text-center">
                💬 Phản hồi từ người dùng
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-600 text-sm italic">
                    “Giao diện cực mượt và dễ dùng, cảm giác như bản mở rộng
                    chính thức của Locket vậy!”
                  </p>
                  <p className="text-right text-xs text-gray-500 mt-2">
                    — Gà Siêu Quậy
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-gray-600 text-sm italic">
                    “Tính năng tải ảnh từ máy tính thực sự cứu mình, không cần
                    dùng Locket Gold nữa :3”
                  </p>
                  <p className="text-right text-xs text-gray-500 mt-2">
                    — Tuấn Khang
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm sm:col-span-2">
                  <p className="text-gray-600 text-sm italic">
                    “Thêm web vào màn hình chính dùng như app ý quá đỉnh shop
                    ạ.”
                  </p>
                  <p className="text-right text-xs text-gray-500 mt-2">
                    — Quý Cô Thuỷ Tề
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
