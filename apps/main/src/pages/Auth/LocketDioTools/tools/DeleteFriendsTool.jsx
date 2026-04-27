import React, { useState } from "react";
import {
  getAllRequestFriend,
  rejectMultipleFriendRequests,
} from "@/services";
import { useFeatureVisible } from "@/hooks/useFeature";
import { formatDateTime } from "@/utils/Formats";
import LoadingRing from "@/components/ui/Loading/ring";
import { SonnerError, SonnerInfo, SonnerSuccess } from "@/components/ui/SonnerToast";

export default function DeleteFriendsTool() {
  const isFeatureVisible = useFeatureVisible("invite_cleanup_tool");

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteCount, setDeleteCount] = useState(200); // 👈 cho phép nhập
  const [fetchProgress, setFetchProgress] = useState({
    current: 0,
    total: 0,
    isEstimating: true,
  });

  // 📥 Lấy toàn bộ danh sách lời mời
  const handleFetchAllInvites = async () => {
    setLoading(true);
    setInvites([]);
    setFetchProgress({ current: 0, total: 0, isEstimating: true });

    try {
      const res = await getAllRequestFriend(null, 1000); // 1000 tuỳ chỉnh theo API
      const friends = res.friends || [];

      setInvites(friends);
      setFetchProgress({
        current: friends.length,
        total: friends.length,
        isEstimating: false,
      });

      if (friends.length === 0) {
        SonnerSuccess("Thông báo từ Locket QQ","Không có lời mời nào.");
      } else {
        SonnerSuccess("Thông báo từ Locket QQ",`Tải xong ${friends.length} lời mời.`);
      }
    } catch (error) {
      SonnerError("❌ Lỗi khi tải lời mời: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Xoá theo số lượng nhập
  const handleDeleteBatch = async () => {
    const batch = invites.slice(0, deleteCount);
    if (batch.length === 0) return SonnerInfo("📭 Không còn lời mời để xoá.");

    setDeleting(true);
    try {
      const uidList = batch.map((invite) => invite.uid);
      const { successCount, successUidList, total } =
        await rejectMultipleFriendRequests(uidList);

      SonnerSuccess(`🧹 Đã xoá ${successCount}/${total} lời mời.`);

      if (successCount > 0) {
        setInvites((prev) =>
          prev.filter((invite) => !successUidList.includes(invite.uid))
        );
      }
    } catch (error) {
      SonnerError("❌ Xoá lời mời thất bại: " + error.message);
    }
    setDeleting(false);
  };

  // 🔒 Nếu tính năng bị khoá
  if (!isFeatureVisible) {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-6xl">🔒</div>
        <h3 className="text-xl font-semibold">Tính năng bị khóa</h3>
        <p className="text-sm opacity-70 max-w-md">
          Bạn không có quyền truy cập vào <b>Clean Requests Tool</b>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        🧹 Xoá lời mời không mong muốn{" "}
        <span className="badge badge-sm badge-secondary">Hot</span>
      </h2>
      <p className="text-sm text-gray-500">
        Công cụ này giúp bạn xoá lời mời spam hàng loạt. Hành động này không thể
        hoàn tác.
      </p>

      {/* 📥 Nút tải lời mời */}
      <button
        onClick={handleFetchAllInvites}
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading && <LoadingRing size={20} stroke={2} color="white" />}
        {loading ? "Đang tải..." : "📥 Lấy tất cả lời mời"}
      </button>

      {/* ⏳ Tiến trình tải */}
      {loading && fetchProgress.current > 0 && (
        <div className="bg-base-100 border rounded-lg p-4">
          <div className="text-sm mb-2">
            Đang tải: <strong>{fetchProgress.current}</strong> lời mời
          </div>
          <div className="w-full bg-base-300 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: "100%",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* 💌 Danh sách lời mời */}
      {invites.length > 0 ? (
        <>
          <div className="text-sm">
            Đã tìm thấy <strong>{invites.length}</strong> lời mời.
          </div>
          <ul className="bg-base-100 border rounded-lg p-4 max-h-48 overflow-auto text-sm space-y-2">
            {invites.map((invite, idx) => (
              <li key={idx}>
                👤 <code>{invite.uid}</code>{" "}
                <span className="text-xs opacity-60">
                  {formatDateTime(invite.createdAt)}
                </span>
              </li>
            ))}
          </ul>

          {/* 🔢 Nhập số lượng cần xoá */}
          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm">Số lượng muốn xoá:</label>
            <input
              type="number"
              className="input input-bordered w-28"
              value={deleteCount}
              min={1}
              max={invites.length}
              onChange={(e) => setDeleteCount(Number(e.target.value))}
            />
          </div>

          {/* 🗑️ Nút xoá */}
          <button
            onClick={handleDeleteBatch}
            className="btn btn-error w-full mt-3"
            disabled={deleting}
          >
            {deleting ? "Đang xoá..." : `🗑️ Xoá ${deleteCount} lời mời`}
          </button>
        </>
      ) : (
        !loading && (
          <div className="text-sm opacity-70 italic">
            Không tìm thấy lời mời nào.
          </div>
        )
      )}
    </div>
  );
}
