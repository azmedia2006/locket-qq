export default function VietQRImage({ description, amount }) {
  if (!description || !amount) return null;

  const src = `/images/STK.png`;

  return (
    <div className="flex flex-col items-center space-y-2">
      <img
        className="max-w-[80%] object-fill cursor-pointer"
        src={src}
        alt="qrcode"
      />
      <p className="text-sm text-gray-500">Quét mã để thanh toán</p>
    </div>
  );
}
