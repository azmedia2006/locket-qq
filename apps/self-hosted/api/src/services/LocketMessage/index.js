const { instanceFirestore, instanceLocketV2 } = require("../../libs");

const getAllMessages = async (idToken, userId, pageToken, limit = 20) => {
  const params = {
    pageSize: limit,
    orderBy: "last_updated desc", // hoặc "updateTime desc"
  };

  if (pageToken) params.pageToken = pageToken;

  try {
    const response = await instanceFirestore.get(
      `/(default)/documents/users/${userId}/conversations`,
      {
        params,
        meta: {
          idToken,
        },
      },
    );
    const documents = response.data.documents || [];
    // Chuẩn hoá dữ liệu Firestore -> plain object
    const conversations = documents.map((doc) => normalizeMessage(doc, userId));

    return {
      messages: conversations,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy mess:",
      error.response?.data || error.message,
    );
    return {
      messages: [],
      nextPageToken: null,
    };
  }
};

const getMessagesWithUser = async ({
  idToken,
  userId,
  conversationId,
  messageId,
  withUser,
  pageToken,
  limit = 50,
}) => {
  const uniqueIds = [...new Set([conversationId, messageId].filter(Boolean))];

  const tryFetch = async (targetConversationId) => {
    const primary = await fetchConversationMessages({
      idToken,
      userId,
      conversationId: targetConversationId,
      pageToken,
      limit,
      withOrderBy: true,
    });

    if (primary.messages.length > 0) return primary;

    const fallback = await fetchConversationMessages({
      idToken,
      userId,
      conversationId: targetConversationId,
      pageToken,
      limit,
      withOrderBy: false,
    });

    return {
      messages: fallback.messages.length ? fallback.messages : primary.messages,
      nextPageToken: fallback.nextPageToken || primary.nextPageToken || null,
      conversationId: targetConversationId,
    };
  };

  for (const candidateId of uniqueIds) {
    const data = await tryFetch(candidateId);
    if (data.messages.length > 0) return data;
  }

  if (withUser) {
    const resolvedConversationId = await resolveConversationIdByWithUser({
      idToken,
      userId,
      withUser,
    });

    if (resolvedConversationId && !uniqueIds.includes(resolvedConversationId)) {
      const data = await tryFetch(resolvedConversationId);
      if (data.messages.length > 0) return data;
    }
  }

  const locketApiMessages = await fetchMessagesViaLocketApi({
    idToken,
    conversationId,
    withUser,
    messageId,
    pageToken,
    limit,
  });

  if (locketApiMessages.length > 0) {
    return {
      messages: locketApiMessages,
      nextPageToken: null,
    };
  }

  return {
    messages: [],
    nextPageToken: null,
  };
};

const fetchMessagesViaLocketApi = async ({
  idToken,
  conversationId,
  withUser,
  messageId,
  pageToken,
  limit,
}) => {
  const candidates = [
    {
      data: {
        conversation_uid: conversationId || null,
        with_user: withUser || null,
        message_id: messageId || conversationId || withUser || null,
        timestamp: pageToken || null,
        limit: limit || 50,
      },
    },
    {
      data: {
        with_user: withUser || messageId || null,
        timestamp: pageToken || null,
      },
    },
  ];

  for (const payload of candidates) {
    try {
      const response = await instanceLocketV2.post("getMessageWithUserV2", payload, {
        meta: {
          idToken,
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
        .map((item, index) =>
          normalizeLocketApiMessage(
            item,
            conversationId || item?.conversation_uid || item?.conversation_id || withUser,
            index,
          ),
        )
        .filter(Boolean);

      if (normalized.length > 0) {
        return normalized;
      }
    } catch {
      // Ignore and try next payload shape.
    }
  }

  return [];
};

const fetchConversationMessages = async ({
  idToken,
  userId,
  conversationId,
  pageToken,
  limit,
  withOrderBy,
}) => {
  const params = {
    pageSize: limit,
  };

  if (withOrderBy) {
    params.orderBy = "created_at desc";
  }

  if (pageToken) {
    params.pageToken = pageToken;
  }

  try {
    const response = await instanceFirestore.get(
      `/(default)/documents/users/${userId}/conversations/${conversationId}/messages`,
      {
        params,
        meta: {
          idToken,
        },
      },
    );

    const documents = response.data.documents || [];
    const messages = documents
      .map((doc) => normalizeConversationMessage(doc, conversationId))
      .filter(Boolean);

    if (messages.length === 0) {
      const inline = await fetchInlineConversationMessages({
        idToken,
        userId,
        conversationId,
      });

      if (inline.length > 0) {
        return {
          messages: inline,
          nextPageToken: null,
        };
      }
    }

    return {
      messages,
      nextPageToken: response.data.nextPageToken || null,
    };
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy message với user:",
      error.response?.data || error.message,
    );
    return {
      messages: [],
      nextPageToken: null,
    };
  }
};

const fetchInlineConversationMessages = async ({
  idToken,
  userId,
  conversationId,
}) => {
  try {
    const response = await instanceFirestore.get(
      `/(default)/documents/users/${userId}/conversations/${conversationId}`,
      {
        meta: {
          idToken,
        },
      },
    );

    const doc = response.data;
    const fields = doc?.fields || {};

    const inlineMessagesRaw = fields.messages?.arrayValue?.values || [];
    const inlineMessages = inlineMessagesRaw
      .map((item, index) =>
        normalizeInlineMessage(
          item?.mapValue?.fields,
          conversationId,
          `${conversationId}-inline-${index}`,
        ),
      )
      .filter(Boolean);

    if (inlineMessages.length > 0) {
      return inlineMessages;
    }

    const latest = normalizeInlineMessage(
      fields.latest_message?.mapValue?.fields,
      conversationId,
      `${conversationId}-latest`,
    );

    return latest ? [latest] : [];
  } catch {
    return [];
  }
};

const resolveConversationIdByWithUser = async ({ idToken, userId, withUser }) => {
  try {
    const response = await instanceFirestore.get(
      `/(default)/documents/users/${userId}/conversations`,
      {
        params: {
          pageSize: 200,
          orderBy: "last_updated desc",
        },
        meta: {
          idToken,
        },
      },
    );

    const docs = response.data.documents || [];

    for (const doc of docs) {
      const fields = doc?.fields || {};
      const members = fields.members?.arrayValue?.values || [];
      const memberList = members
        .map((v) => v?.stringValue)
        .filter(Boolean);
      const docId = doc?.name?.split("/").pop();
      const uid = fields.uid?.stringValue || docId;

      if (uid === withUser || docId === withUser || memberList.includes(withUser)) {
        return uid || docId;
      }
    }

    return null;
  } catch (error) {
    console.error(
      "❌ Lỗi khi resolve conversation by with_user:",
      error.response?.data || error.message,
    );
    return null;
  }
};

function normalizeMessage(doc, user_id) {
  if (!doc || !doc.fields) return null;

  const f = doc.fields;

  const members = f.members?.arrayValue?.values || [];

  const memberList = members.map((v) => v.stringValue);

  const with_user = memberList.find((id) => id !== user_id);

  const latest = f.latest_message?.mapValue?.fields;

  const toSeconds = (ts) =>
    ts ? Math.floor(new Date(ts).getTime() / 1000) : 0;

  return {
    uid: f.uid?.stringValue || doc.name?.split("/").pop(),

    members: memberList,

    unreadCount: parseInt(f.unread_count?.integerValue || "0", 10),

    isRead: f.is_read?.booleanValue || false,

    lastReadAt: toSeconds(f.last_read_at?.timestampValue),

    otherLastReadAt: toSeconds(f.other_last_read_at?.timestampValue),

    lastUpdated: toSeconds(f.last_updated?.timestampValue),

    // 👇 thêm field bị thiếu
    update_time: toSeconds(latest?.created_at?.timestampValue),

    latestMessage: latest
      ? {
        body: latest.body?.stringValue || "",
        sender: latest.sender?.stringValue || "",
        createdAt: toSeconds(latest.created_at?.timestampValue),
        replyMoment: latest.reply_moment?.stringValue || null,
        thumbnailUrl: replaceFirebaseWithCDN(
          latest.thumbnail_url?.stringValue,
        ),
      }
      : null,

    otherLastDeliveredAt: toSeconds(f.other_last_delivered_at?.timestampValue),

    otherLastDeliveredMessageCreatedAt: toSeconds(
      f.other_last_delivered_message_created_at?.timestampValue,
    ),

    with_user,

    createTime: toSeconds(doc.createTime),

    updateTime: toSeconds(doc.updateTime),
  };
}

function normalizeConversationMessage(doc, conversationId) {
  if (!doc || !doc.fields) return null;

  const f = doc.fields;

  const toSeconds = (ts) =>
    ts ? Math.floor(new Date(ts).getTime() / 1000) : 0;

  const parseReactions = (rawReactions) => {
    const values = rawReactions?.arrayValue?.values || [];
    return values
      .map((item) => {
        const fields = item?.mapValue?.fields;
        if (!fields) return null;

        return {
          emoji: fields.emoji?.stringValue || "",
          sender: fields.sender?.stringValue || "",
        };
      })
      .filter(Boolean);
  };

  const body = f.body?.stringValue || "";
  const createdAt = toSeconds(f.created_at?.timestampValue || doc.createTime);
  const updatedAt = toSeconds(doc.updateTime || f.created_at?.timestampValue);

  return {
    id: f.id?.stringValue || f.uid?.stringValue || doc.name?.split("/").pop(),
    uid: conversationId,
    sender: f.sender?.stringValue || "",
    text: body,
    body,
    create_time: createdAt,
    update_time: updatedAt || createdAt,
    reply_moment: f.reply_moment?.stringValue || null,
    thumbnail_url: replaceFirebaseWithCDN(f.thumbnail_url?.stringValue),
    reactions: parseReactions(f.reactions),
  };
}

function normalizeInlineMessage(fields, conversationId, fallbackId) {
  if (!fields) return null;

  const toSeconds = (ts) =>
    ts ? Math.floor(new Date(ts).getTime() / 1000) : 0;

  const parseReactions = (rawReactions) => {
    const values = rawReactions?.arrayValue?.values || [];
    return values
      .map((item) => {
        const reactionFields = item?.mapValue?.fields;
        if (!reactionFields) return null;

        return {
          emoji: reactionFields.emoji?.stringValue || "",
          sender: reactionFields.sender?.stringValue || "",
        };
      })
      .filter(Boolean);
  };

  const body = fields.body?.stringValue || "";
  const createdAt = toSeconds(fields.created_at?.timestampValue);

  return {
    id:
      fields.id?.stringValue ||
      fields.uid?.stringValue ||
      fallbackId,
    uid: conversationId,
    sender: fields.sender?.stringValue || "",
    text: body,
    body,
    create_time: createdAt,
    update_time: createdAt,
    reply_moment: fields.reply_moment?.stringValue || null,
    thumbnail_url: replaceFirebaseWithCDN(fields.thumbnail_url?.stringValue),
    reactions: parseReactions(fields.reactions),
  };
}

function normalizeLocketApiMessage(item, conversationId, index) {
  if (!item) return null;

  const toSeconds = (v) => {
    if (!v) return 0;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n > 1e12 ? Math.floor(n / 1000) : n;
      const ts = new Date(v).getTime();
      if (!Number.isNaN(ts)) return Math.floor(ts / 1000);
    }
    return 0;
  };

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

  const body = item.body || item.msg || item.text || "";
  const createdAt =
    toSeconds(item.create_time) ||
    toSeconds(item.created_at) ||
    toSeconds(item.createdAt) ||
    Math.floor(Date.now() / 1000);

  const id =
    item.id ||
    item.uid ||
    item.message_uid ||
    item.message_id ||
    `${conversationId || "conversation"}-lk-${index}-${createdAt}`;

  return {
    id,
    uid: conversationId || item.conversation_uid || item.conversation_id || "",
    sender: item.sender || item.from || item.user || "",
    text: body,
    body,
    create_time: createdAt,
    update_time: createdAt,
    reply_moment: item.reply_moment || item.replyMoment || null,
    thumbnail_url: replaceFirebaseWithCDN(
      item.thumbnail_url || item.thumbnailUrl || null,
    ),
    reactions,
  };
}

function replaceFirebaseWithCDN(url) {
  if (!url) return null; // hoặc "" nếu bạn muốn
  return url.replace(
    "https://firebasestorage.googleapis.com",
    "https://cdn.locketcamera.com",
  );
}

module.exports = {
  getAllMessages,
  getMessagesWithUser,
};
