const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Vercel sets env vars directly, .env files only exist locally
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
const envPath = path.resolve(__dirname, envFile);
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const cors = require("cors");
const { logInfo } = require("./src/utils/logEventUtils.js");

// Routers
const routes = require("./src/routes/index.js");
const errorHandler = require("./src/helpers/error-handler.js");

const app = express();
app.use(
  cors({
    origin: [
      /^http:\/\/localhost:\d+$/,
      /\.vercel\.app$/,
      /^https?:\/\/(?:[a-zA-Z0-9-]+\.)?locketqq\.online$/,
    ],
    methods: ["GET", "POST"],

    // Nhằm cho phép client gửi cookie lên server
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nạp các route vào ứng dụng
routes(app);

// Middleware xử lý lỗi
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  logInfo("SERVER", `Server backend is running at localhost:${PORT}`);
});

module.exports = app;
