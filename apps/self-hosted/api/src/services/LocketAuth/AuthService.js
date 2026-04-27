const axios = require("axios");
const { logInfo, logError, logWarning } = require("../../utils/logEventUtils.js");
const { createGoogleInstance } = require("../../libs/instanceGoogleBase.js");
const { firebase } = require("../../config/app.config.js");

/**
 * Login sử dụng Firebase Identity Toolkit API v1 (mới)
 * Endpoint: https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword
 * Endpoint v3 cũ (relyingparty/verifyPassword) đã bị hạn chế bởi AppCheck
 */
const login = async (email, password) => {
  logInfo("login Locket", "Start");

  const body = {
    email: email,
    password: password,
    returnSecureToken: true,
    clientType: "CLIENT_TYPE_IOS",
  };

  try {
    // Thử endpoint v1 mới trước
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebase.apiKey}`;
    
    const response = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "FirebaseAuth.iOS/10.23.1 com.locket.Locket/1.82.0 iPhone/18.0 hw/iPhone12_1",
        "X-Ios-Bundle-Identifier": "com.locket.Locket",
      },
      timeout: 30000,
    });

    if (!response.data) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = response.data;
    logInfo("login Locket", "End - Success");
    return data;
  } catch (error) {
    // Log chi tiết lỗi để debug
    if (error.response) {
      logError("login Locket", `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    } else {
      logError("login Locket", error.message);
    }
    throw error;
  }
};

const logout = async () => {
  logInfo("logout Locket", "Start");

  try {
    logInfo("logout Locket", "End");
    return null;
  } catch (error) {
    logError("logout Locket", error.message);
    throw error;
  }
};

const refreshIdToken = async (refreshToken) => {
  const body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  };

  try {
    // Dùng endpoint v1 mới cho refresh token
    const url = `https://securetoken.googleapis.com/v1/token?key=${firebase.apiKey}`;
    
    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 30000,
    });

    // Firebase trả về object gồm: id_token, refresh_token, expires_in, user_id,...
    return res.data;
  } catch (err) {
    console.error("Refresh token failed:", err.response?.data || err.message);
    throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
  }
};

module.exports = {
  login,
  logout,
  refreshIdToken
};
