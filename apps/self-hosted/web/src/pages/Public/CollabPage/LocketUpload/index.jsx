export default function LocketUpload() {
  return (
    <div className="p-4 mx-auto min-h-screen max-w-3xl text-base-content space-y-4">
      {/* Tiêu đề chính */}
      <h1 className="text-3xl md:text-4xl font-bold">
        Locket QQ x Locket Upload
      </h1>

      <p className="text-base text-base-content/80">
        Locket QQ hân hạnh hợp tác cùng{" "}
        <span className="font-semibold">Locket Upload </span>
        nhằm mang đến trải nghiệm chia sẻ ảnh nhanh chóng, ổn định và tiện lợi
        hơn cho người dùng.
      </p>

      {/* Giới thiệu */}
      <h2 className="text-xl font-semibold mt-6 text-secondary">
        Giới thiệu về Locket QQ
      </h2>
      <p>
        Locket QQ là một web app được cài đặt bằng cách thêm vào màn hình chính
        (PWA). Ứng dụng mang đến nhiều tính năng nâng cao giúp việc đăng ảnh lên
        Locket trở nên dễ dàng hơn.
      </p>

      {/* Vấn đề Android */}
      <h2 className="text-xl font-semibold mt-6 text-error">
        Vấn đề trên Android
      </h2>
      <p>
        Trên Android, theo ước tính có tới{" "}
        <span className="font-semibold">70% thiết bị </span>
        gặp lỗi không thể sử dụng camera trực tiếp trong Locket QQ.
      </p>
      <p>
        Nguyên nhân đến từ việc hệ điều hành Android quản lý quyền camera rất
        phức tạp, khác nhau giữa các hãng và phiên bản hệ điều hành, khiến việc
        tích hợp camera trong web app trở nên không ổn định.
      </p>

      {/* iOS */}
      <h2 className="text-xl font-semibold mt-6 text-success">
        Trải nghiệm trên iOS
      </h2>
      <p>
        Trên <span className="font-semibold">iOS</span>, việc sử dụng camera
        trong Locket QQ nhìn chung{" "}
        <span className="font-semibold">ổn định và mượt mà</span>, không gặp
        nhiều vấn đề nghiêm trọng như Android.
      </p>

      {/* Giải pháp */}
      <h2 className="text-xl font-semibold mt-6 text-primary">
        Giải pháp: Locket Upload
      </h2>
      <p>
        <span className="font-semibold">Locket Upload</span> được phát triển
        nhằm giải quyết triệt để các vấn đề camera trên Android.
      </p>
      <p>
        Với Locket Upload, bạn chỉ cần mở ứng dụng, chụp ảnh một cách dễ dàng,
        sau đó ảnh sẽ được{" "}
        <span className="font-semibold">tự động đồng bộ </span>
        với Locket QQ hoặc Locket Widget của bạn.
      </p>

      {/* Link */}
      <div className="mt-6 rounded-xl space-y-3">
        <p className="font-semibold">Tham khảo & liên hệ:</p>

        <a
          href="https://quockhanh020924.id.vn/locket_upload.html"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline break-all"
        >
          🌐 Trang giới thiệu Locket Upload
        </a>

        <a
          href="https://www.facebook.com/share/1CFW7iFe4Y/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline break-all"
        >
          📘 Trang Facebook chính thức
        </a>

        <a
          href="https://m.me/cm/AbbIL5opkgSMzs9x/"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-primary underline break-all"
        >
          💬 Nhóm Messenger hỗ trợ & trao đổi
        </a>
      </div>

      {/* Hình ảnh minh họa */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-primary">
          Hình ảnh Locket Upload
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl overflow-hidden shadow">
            <img
              src="https://quockhanh020924.id.vn/markdown/assets/images/screenshot15_a.png"
              alt="Giao diện Locket Upload - Theme Preview"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow">
            <img
              src="https://quockhanh020924.id.vn/markdown/assets/images/screenshot15.png"
              alt="Giao diện Locket Upload - Theme Selection"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="rounded-xl overflow-hidden shadow">
            <img
              src="https://quockhanh020924.id.vn/markdown/assets/images/screenshot2.png"
              alt="Giao diện Locket Upload - Main Screen Camera"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="rounded-xl overflow-hidden shadow">
            <img
              src="https://quockhanh020924.id.vn/markdown/assets/images/screenshot9_a.png"
              alt="Giao diện Locket Upload - Photo View"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
