import { loginHeader } from "@/constants/constrain";
import { instanceLocket } from "@/lib/axios.locket";
import { getToken } from "@/utils";
import { generateUUIDv4Upper } from "@/utils/generate/uuid";

export const sendMessage = async (messageInfo) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        msg: messageInfo.message || " ", // Nội dung tin nhắn
        analytics: {
          amplitude: {
            device_id: generateUUIDv4Upper(),
            session_id: -1,
          },
          google_analytics: {
            app_instance_id: "e88d4daed0ded172248753851bf67772",
          },
          android_version: "1.196.0",
          android_build: "406",
          platform: "android",
        },
        client_token: generateUUIDv4Upper(),
        moment_uid: messageInfo?.moment_id || null,
        receiver_uid: messageInfo.receiver_uid,
      },
    };

    const response = await instanceLocket.post("sendChatMessageV2", body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    return response.data;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
};

export const markReadMessage = async (conversationId) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        conversation_uid: conversationId,
      },
    };

    const response = await instanceLocket.post("markAsRead", body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    return response.data;
  } catch (err) {
    console.error("markReadMessage error:", err);
    throw err;
  }
};

export const sendReactionOnMessage = async (reactionData) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        message_id: reactionData.messageId,
        emoji: reactionData.emoji,
        conversation_id: reactionData.conversationId,
      },
    };

    const response = await instanceLocket.post(
      "sendChatMessageReaction",
      body,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
          ...loginHeader,
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("markReadMessage error:", err);
    throw err;
  }
};

export const deleteMessage = async (deleteData) => {
  try {
    const { idToken } = getToken();

    const body = {
      data: {
        message_uid: deleteData.message_uid,
        conversation_uid: deleteData.conversation_uid,
      },
    };

    const response = await instanceLocket.post("deleteChatMessage", body, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        ...loginHeader,
      },
    });

    return response.data;
  } catch (err) {
    console.error("markReadMessage error:", err);
    throw err;
  }
};

const toSeconds = (v) => {
  if (!v) return 0;
  if (typeof v === "number") return v > 1e12 ? Math.floor(v / 1000) : v;
  if (typeof v === "string") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n > 1e12 ? Math.floor(n / 1000) : n;
    const ts = new Date(v).getTime();
    if (!Number.isNaN(ts)) return Math.floor(ts / 1000);
  }
  return 0;
};

const normalizeDirectMessage = (item, conversationId, idx) => {
  if (!item) return null;

  const body = item.body || item.msg || item.text || "";
  const created =
    toSeconds(item.create_time) ||
    toSeconds(item.created_at) ||
    toSeconds(item.createdAt) ||
    Math.floor(Date.now() / 1000);

  const id =
    item.id ||
    item.uid ||
    item.message_uid ||
    item.message_id ||
    `${conversationId || "conversation"}-direct-${created}-${idx}`;

  const rawReactions = Array.isArray(item.reactions)
    ? item.reactions
    : Array.isArray(item.emoji_reactions)
      ? item.emoji_reactions
      : [];

  const reactions = rawReactions
    .map((r) => ({
      emoji: r?.emoji || r?.reaction || "",
      sender: r?.sender || r?.uid || "",
    }))
    .filter((r) => r.emoji);

  return {
    id,
    uid: conversationId || item.conversation_uid || item.conversation_id || "",
    sender: item.sender || item.from || item.user || "",
    text: body,
    body,
    create_time: created,
    update_time: created,
    reply_moment: item.reply_moment || item.replyMoment || null,
    thumbnail_url: item.thumbnail_url || item.thumbnailUrl || null,
    reactions,
  };
};

const fetchMessagesWithUserDirectPage = async ({
  idToken,
  conversationId,
  withUser,
  timestamp,
  limit,
}) => {
  const payloads = [
    {
      data: {
        conversation_uid: conversationId || null,
        with_user: withUser || null,
        message_id: conversationId || withUser || null,
        timestamp,
        limit,
      },
    },
    {
      data: {
        with_user: withUser || conversationId || null,
        timestamp,
        limit,
      },
    },
  ];

  for (const body of payloads) {
    try {
      const response = await instanceLocket.post("getMessageWithUserV2", body, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          ...loginHeader,
        },
      });

      const raw =
        response?.data?.data ||
        response?.data?.result?.data ||
        response?.data?.result?.messages ||
        response?.data?.messages ||
        [];

      const list = Array.isArray(raw)
        ? raw
        : Array.isArray(raw?.messages)
          ? raw.messages
          : [];

      const normalized = list
        .map((item, idx) => normalizeDirectMessage(item, conversationId, idx))
        .filter(Boolean);

      if (normalized.length > 0) return normalized;
    } catch {
      // thử payload khác
    }
  }

  return [];
};

export const getMessagesWithUserDirect = async ({
  conversationId,
  withUser,
  timestamp = null,
  limit = 50,
  maxPages = 6,
}) => {
  try {
    const { idToken } = getToken();
    const merged = new Map();

    let cursor = timestamp;
    let lastSize = 0;

    for (let page = 0; page < maxPages; page += 1) {
      const pageItems = await fetchMessagesWithUserDirectPage({
        idToken,
        conversationId,
        withUser,
        timestamp: cursor,
        limit,
      });

      if (!pageItems.length) break;

      pageItems.forEach((m) => {
        if (m?.id) merged.set(m.id, m);
      });

      if (merged.size === lastSize) break;
      lastSize = merged.size;

      const oldest = pageItems.reduce((minTs, m) => {
        const ts = Number(m?.create_time || 0);
        if (!ts) return minTs;
        if (!minTs) return ts;
        return Math.min(minTs, ts);
      }, 0);

      if (!oldest) break;

      const nextCursor = oldest - 1;
      if (cursor && nextCursor >= cursor) break;
      cursor = nextCursor;
    }

    return [...merged.values()].sort(
      (a, b) => Number(b.update_time || 0) - Number(a.update_time || 0)
    );
  } catch (err) {
    console.error("getMessagesWithUserDirect error:", err);
    return [];
  }
};
