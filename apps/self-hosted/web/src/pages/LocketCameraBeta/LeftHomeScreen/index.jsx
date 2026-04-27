import React, { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/context/AppContext";
import HeaderOne from "./Layout/HeaderOne";
import InfoUser from "./Layout/InfoUser";
import SegmentedToggle from "./Layout/SegmentedToggle";
import RollcallsPost from "./Views/RollcallsPage";
import StreakLocket from "./Views/CalenderStreak";
import { useAuthStore, useMomentsStoreV2, useUploadQueueStore } from "@/stores";
import { getRollcallPosts } from "@/services";
import { replaceFirebaseWithCDN } from "@/utils/replace/replaceFirebaseWithCDN";
import { getImageSrc } from "@/utils/replace/replaceUrl";
import { getISOWeek } from "@/utils";

const LeftHomeScreen = ({ setIsProfileOpen }) => {
  const { user } = useAuthStore();
  const { navigation } = useApp();
  const { isProfileOpen } = navigation;
  const [posts, setPosts] = useState([]);

  const [active, setActive] = useState("lockets"); // 'rollcall' | 'lockets'

  // useEffect(() => {
  //   document.body.classList.toggle("overflow-hidden", isProfileOpen);
  //   return () => document.body.classList.remove("overflow-hidden");
  // }, [isProfileOpen]);
  const postedMoments = useUploadQueueStore((s) => s.postedMoments);
  const bucketAll = useMomentsStoreV2((s) => s.momentsByUser["all"]);
  const fetchMoments = useMomentsStoreV2((s) => s.fetchMoments);
  const didHydrateMomentsRef = useRef("");

  const remoteMoments = bucketAll?.items || [];

  const normalizeMomentForCalendar = (m) => {
    if (!m) return null;

    const timestamp = m.createTime || m.createdAt || m.date || null;

    return {
      ...m,
      id: m.id || m.canonical_uid,
      createdAt: timestamp,
      image_url: m.image_url || m.imageUrl || m.main_url || null,
      thumbnail_url: m.thumbnail_url || m.thumbnailUrl || m.image_url || m.imageUrl || m.main_url || null,
      video_url: m.video_url || m.videoUrl || null,
    };
  };

  const allCalendarMoments = useMemo(() => {
    const merged = [...postedMoments, ...remoteMoments]
      .map(normalizeMomentForCalendar)
      .filter(Boolean);

    const unique = [];
    const seen = new Set();

    for (const item of merged) {
      const key = item.id || `${item.user || "u"}-${item.createdAt || "t"}-${item.image_url || item.thumbnail_url || "m"}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(item);
    }

    return unique;
  }, [postedMoments, remoteMoments]);

  const warmupImages = (urls = []) => {
    const unique = [...new Set(urls.filter(Boolean))];
    unique.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  };

  useEffect(() => {
    if (!user) return;

    const localMomentUrls = allCalendarMoments
      .flatMap((m) => [m.thumbnail_url, m.image_url, m.thumbnailUrl, m.imageUrl])
      .map((u) => getImageSrc(u));

    warmupImages(localMomentUrls);

    const preloadRollcalls = async () => {
      try {
        const { week, year } = getISOWeek();
        const rollcalls = await getRollcallPosts({ selectWeek: week, selectYear: year });
        const rollcallUrls = (rollcalls || []).flatMap((post) =>
          (post.items || []).flatMap((item) => {
            const raw = getImageSrc(item.main_url);
            const cdn = getImageSrc(replaceFirebaseWithCDN(item.main_url));
            return [raw, cdn];
          }),
        );
        warmupImages(rollcallUrls);
      } catch (error) {
        console.warn("Failed to preload rollcall images", error);
      }
    };

    preloadRollcalls();
  }, [user, allCalendarMoments]);

  useEffect(() => {
    const userKey = user?.localId || user?.uid;
    if (!userKey || !isProfileOpen) return;
    if (didHydrateMomentsRef.current === userKey) return;

    didHydrateMomentsRef.current = userKey;

    let canceled = false;

    const hydrateAllMoments = async () => {
      try {
        await fetchMoments(user, null);

        // Tải thêm từng trang đến khi hết dữ liệu hoặc đạt giới hạn an toàn.
        for (let i = 0; i < 30; i += 1) {
          if (canceled) break;

          const store = useMomentsStoreV2.getState();
          const bucket = store.momentsByUser["all"];

          if (!bucket?.hasMore || bucket?.isLoadingMore) break;

          const before = bucket.items?.length || 0;
          await store.loadMoreOlder(null);

          const after = useMomentsStoreV2.getState().momentsByUser["all"]?.items?.length || 0;
          if (after <= before) break;
        }
      } catch (error) {
        console.warn("Failed to auto-load all moments", error);
      }
    };

    hydrateAllMoments();

    return () => {
      canceled = true;
    };
  }, [user, isProfileOpen, fetchMoments]);

  // handle toggle bằng true/false
  const handleToggle = (tab) => {
    setActive(tab);
  };

  return (
    <div
      className={`fixed inset-0 w-full grid grid-rows-[auto_1fr] z-50 bg-base-100 text-base-content transition-transform duration-500 overflow-hidden ${isProfileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* ==== Header (sticky) ==== */}
      <div className="relative shadow-md">
        <HeaderOne setIsProfileOpen={setIsProfileOpen} />
        <InfoUser user={user} />
      </div>

      {/* ==== Nội dung chính ==== */}
      <div className="flex bg-base-200 overflow-y-auto">
        {active === "rollcall" && (
          <RollcallsPost
            active={active}
            posts={posts}
            setPosts={setPosts}
            isProfileOpen={isProfileOpen}
          />
        )}
        {active === "lockets" && <StreakLocket recentPosts={allCalendarMoments} />}
      </div>
      {/* ==== Bottom Segmented Toggle ==== */}
      <div className="fixed z-60 bottom-4 w-full select-none">
        <SegmentedToggle active={active} setActive={handleToggle} />
      </div>
    </div>
  );
};

export default LeftHomeScreen;
