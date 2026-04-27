import React, { useState, useEffect } from "react";
import { Cake, X } from "lucide-react";
import confetti from "canvas-confetti";

const MyBirthday = () => {
  const [showModal, setShowModal] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Bắn pháo giấy
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

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setAnimate(true), 10);
    fireConfetti();
  };

  const closeModal = () => {
    setAnimate(false);
    setTimeout(() => setShowModal(false), 300);
  };

  // Lock scroll khi mở modal
  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showModal]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={openModal}
        aria-label="Mở lời chúc sinh nhật"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-200 border border-pink-400 shadow-lg hover:bg-pink-300 transition"
      >
        <Cake className="text-pink-600" size={24} />
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-base-100/10 backdrop-blur-sm transition-opacity duration-300 ${
            animate ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeModal}
        >
          <div
            className={`bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ${
              animate ? "scale-100 translate-y-0" : "scale-90 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-pink-500 to-red-400 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Cake size={20} /> Sắp đến sinh nhật của mình! 🎉
              </h2>
              <button
                onClick={closeModal}
                className="hover:bg-white/20 rounded-full p-1"
              >
                <X />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 text-center">
              <img
                src="https://cdn.locket-qq.com/v1/images/qr/vcb_qr.jpg"
                alt="Birthday QR"
                className="w-48 h-48 mx-auto rounded-lg shadow mb-4 border border-pink-300"
              />
              <h3 className="text-2xl font-extrabold text-pink-600 mb-2">
                🎂 Chúc mừng sinh nhật QQ 🎂
              </h3>
              <p className="text-sm text-gray-500 mb-3">Sắp tới: 29/08/2025</p>

              <p className="text-gray-700 leading-relaxed mb-4">
                Sắp tới là ngày đặc biệt của mình! Nếu bạn thấy web này hữu ích
                hoặc chỉ đơn giản là muốn gửi một lời chúc, hãy quét mã QR để
                gửi món quà nhỏ nhé ❤️
              </p>
              <p className="text-sm text-gray-500 italic">
                Cảm ơn bạn đã đồng hành cùng mình trong thời gian qua!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBirthday;
