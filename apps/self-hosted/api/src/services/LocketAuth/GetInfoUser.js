const axios = require("axios");
const { instanceFirestore } = require("../../libs");
const { firebase } = require("../../config/app.config");
const { logInfo, logError } = require("../../utils/logEventUtils");

// Lấy thông tin người dùng
const getUserInfoV2 = async (idToken, localId) => {
  try {
    logInfo("getUserInfoV2", "Start");

    // Bước 1: Lấy thông tin auth từ Firebase Identity Toolkit v1
    // (thay vì dùng v3 getAccountInfo bị 403)
    const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebase.apiKey}`;
    const authResponse = await axios.post(authUrl, {
      idToken,
    }, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FirebaseAuth.iOS/10.23.1 com.locket.Locket/1.82.0 iPhone/18.0 hw/iPhone12_1",
        "X-Ios-Bundle-Identifier": "com.locket.Locket",
      },
      timeout: 30000,
    });

    const userData = authResponse.data?.users?.[0];
    if (!userData) throw new Error("Không tìm thấy user trong Firebase Auth.");

    logInfo("getUserInfoV2", `Auth OK: ${userData.email}`);

    // Bước 2: Lấy thông tin bổ sung từ Firestore
    let userDataV2 = null;
    try {
      const firestoreResponse = await instanceFirestore.get(
        `(default)/documents/users/${localId}`,
        {
          meta: {
            idToken,
          },
        },
      );
      userDataV2 = firestoreResponse?.data;
    } catch (firestoreErr) {
      logError("getUserInfoV2", `Firestore error: ${firestoreErr.response?.status || firestoreErr.message}`);
      // Không throw — vẫn trả về data từ Auth nếu Firestore lỗi
    }

    logInfo("getUserInfoV2", "End - Success");

    return {
      uid: userDataV2?.fields?.uid?.stringValue || userData.localId,
      localId: userData.localId || localId,
      customAuth: userData.customAuth || null,
      phoneNumber: userData.phoneNumber || null,
      displayName: userData.displayName || null,
      email: userData.email || null,
      lastLoginAt: userData.lastLoginAt || null,
      lastRefreshAt: userData.lastRefreshAt || null,
      emailVerified: userData.emailVerified || null,

      username: userDataV2?.fields?.username?.stringValue || null,
      firstName: userDataV2?.fields?.first_name?.stringValue || null,
      lastName: userDataV2?.fields?.last_name?.stringValue || null,
      profilePicture:
        userDataV2?.fields?.profile_picture_url?.stringValue || null,
      inviteToken: userDataV2?.fields?.invite_token?.stringValue || null,
      migratedAt: userDataV2?.fields?.migrated_at?.timestampValue || null,
      createdAt: userDataV2?.fields?.created_at?.timestampValue || null,
      lastFriendsChange:
        userDataV2?.fields?.last_friends_change?.timestampValue || null,
      birthday:
        userDataV2?.fields?.birthday?.mapValue?.fields?.encoded_mdd
          ?.integerValue || null,
    };
  } catch (error) {
    logError("getUserInfoV2", `${error.response?.status || ""} ${JSON.stringify(error.response?.data) || error.message}`);
    return null;
  }
};

module.exports = { getUserInfoV2 };
