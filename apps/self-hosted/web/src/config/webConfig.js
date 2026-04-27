//config/webConfig.js

export const CONFIG = {
  api: {
    baseUrl: import.meta.env.VITE_BASE_API_URL, // API chính (socket + API)
    authUrl: import.meta.env.VITE_AUTH_API_URL,
    storage: import.meta.env.VITE_STORAGE_API_URL, // API lưu trữ file
    data: import.meta.env.VITE_DATA_API_URL, // API data local
    payment: import.meta.env.VITE_PAYMENT_API_URL, // API thanh toán
    cdnUrl: import.meta.env.VITE_CDN_URL, // API cdn
    locketApi: import.meta.env.VITE_LOCKET_API_URL, // API Locket chính thức
    exportApi: import.meta.env.VITE_EXPORTS_API_URL, // API export data pdf, excel,...
    convertApi: import.meta.env.VITE_CONVERTS_API_URL,
    extenApi: import.meta.env.VITE_EXTENS_API_URL,
  },

  keys: {
    vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY, // Push notification
    turnstileKey: import.meta.env.VITE_TURNSTILE_SITE_KEY, // Cloudflare Turnstile

    apiKey: import.meta.env.VITE_PUBLIC_API_KEY,
  },

  app: {
    name: "Locket QQ", // Tên app hiển thị
    author: "QQ",
    shortname: "LocketQQ",
    fullName: "Locket QQ - Đăng ảnh & Video lên Locket", // Tên đầy đủ
    clientVersion: "Beta2.5.5.2.4", // Version client
    apiVersion: "v2.2.1", // Version API
    startYear: 2025,
    env: import.meta.env.MODE, // development | production
    camera: {
      limits: {
        maxRecordTime: 10, // giây
        maxImageSizeMB: 10,
        maxVideoSizeMB: 10,
      },
      resolutions: {
        imageSizePx: 1920, // ảnh vuông
        videoResolutionPx: 1080,
      },
      constraints: {
        default: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        ultraHD: {
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
      },
    },
    moments: {
      initialVisible: 50, // Số lượng moments hiển thị ban đầu
      maxDisplayLimit: 5000, // Giới hạn tối đa moments hiển thị trên client
      loadMoreLimit: 50, // Số lượng moments tải thêm mỗi lần
      duplicateThreshold: 3, // Ngưỡng trùng lặp để dừng tải thêm
    },
    messages: {
      initialVisible: 50, // Số lượng messages hiển thị ban đầu
      maxDisplayLimit: 5000, // Giới hạn tối đa messages hiển thị trên client
      loadMoreLimit: 50, // Số lượng messages tải thêm mỗi lần
    },
    contact: {
      supportEmail: "protv2006@gmail.com",
      supportNumber: "1800-123-456",
    },
    community: {
      discord: "https://discord.gg/yf5xvBVw",
      telegram: "https://t.me/+KWZ84cH7JxBkYWJl",
      messenger: " ",
    },
    sponsors: {
      urlImg: "/images/STK.png",
      bankName: "Ngân hàng Vietcombank (VCB)",
      accountNumber: "1031889213",
      accountName: "LA VAN QUYEN",
    },
    bankInfo: {
      bankCode: "VCB",
      short_name: "Vietcombank",
      urlImg: "/images/STK.png",
      bankName: "Ngân hàng Vietcombank (VCB)",
      accountNumber: "1031889213",
      accountName: "LA VAN QUYEN",
    },
    myInfo: {
      fullName: "La Văn Quyền (QQ)",
      email: "protv2006@gmail.com",
      phone: "0123456789",
      github: "https://github.com/lvquyen15506",
      avatarUrl: "https://avatars.githubusercontent.com/u/184629363?s=400&u=2ae0bde7cc465c34e851081b14554f8615ce72dd&v=4",
    },
    docs: {
      personal_authorization:
        " ",
    },
    videoTutorials: {
      youtubeChannel: "https://www.youtube.com/@LocketQQ",
      iosAddscreen: {
        title: "Hướng dẫn thêm Locket QQ vào màn hình chính trên iPhone!",
        url: "https://www.youtube.com/embed/iElPAnQ7lNY",
      }, // Hướng dẫn thêm trang web vào màn hình chính trên iPhone (Safari)
      androidAddscreen: {
        title: "Hướng dẫn thêm Locket QQ vào màn hình chính trên Android!",
        url: "https://www.youtube.com/embed/JtgfTNbKTZY",
      }, // Hướng dẫn thêm trang web vào màn hình chính trên Android (Chrome)
    },
  },
  ui: {
    theme: "light", // hoặc "dark"
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
    maxToastVisible: 3,
    dateFormat: "DD/MM/YYYY",
    timeFormat: "HH:mm:ss",

    moments: {
      initialVisible: 50,
      maxDisplayLimit: 5000,
      duplicateThreshold: 3,
    },
    chat: { initialVisible: 10 },

    categories: [
      { id: "update", label: "Cập nhật", icon: "Sparkles" },
      { id: "event", label: "Sự kiện", icon: "Gift" },
      { id: "announcement", label: "Thông báo", icon: "Megaphone" },
      { id: "tip", label: "Mẹo sử dụng", icon: "Lightbulb" },
    ],
  },
};
