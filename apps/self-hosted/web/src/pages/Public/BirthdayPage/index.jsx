import React, { useEffect } from "react";
import { Cake } from "lucide-react";
import confetti from "canvas-confetti";

export default function BirthdayPage() {
  // Hàm bắn confetti
  const fireConfetti = () => {
    const end = Date.now() + 800;
    const colors = ["#ff6f61", "#ffb3ba", "#ffeb99", "#baffc9", "#bae1ff"];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  useEffect(() => {
    // Bắn ngay khi load
    fireConfetti();

    // Thiết lập interval 5 giây
    const interval = setInterval(() => {
      fireConfetti();
    }, 5000);

    return () => clearInterval(interval); // Dọn dẹp khi unmount
  }, []);

  return (
    <div className="h-[84vh] flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 px-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-pink-200">
        {/* Top Banner */}
        <div className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-400 py-6 text-white">
          <Cake size={36} className="mr-3" />
          <h1 className="text-2xl font-extrabold">Sinh Nhật QQ 🎂</h1>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <img
            src="https://cdn.locketqq.online/v1/images/qr/vcb_qr.jpg"
            alt="Birthday QR"
            className="w-48 h-48 mx-auto rounded-lg shadow mb-4 border border-pink-300"
          />
          <h2 className="text-2xl font-extrabold text-pink-600 mb-2">
            🎉 29/08/2025 🎉
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Sắp tới là ngày đặc biệt của mình! Nếu bạn thấy web này hữu ích hoặc
            chỉ đơn giản là muốn gửi một lời chúc, hãy quét mã QR để gửi món quà
            nhỏ nhé ❤️
          </p>
          <p className="text-sm text-gray-500 italic">
            Cảm ơn bạn đã đồng hành cùng mình trong thời gian qua!
          </p>
        </div>
      </div>
    </div>
  );
}
