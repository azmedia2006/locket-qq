const fs = require("fs");
const os = require("os");
const path = require("path");

const createFolderIfNotExist = (folderPath) => {
    // Trên Vercel (serverless), dùng /tmp thay vì thư mục project
    const isVercel = process.env.VERCEL === "1";
    const resolvedPath = isVercel
        ? path.join(os.tmpdir(), folderPath)
        : folderPath;

    if (!fs.existsSync(resolvedPath)) {
        fs.mkdirSync(resolvedPath, { recursive: true });
    }
    return resolvedPath;
};

module.exports = {
    createFolderIfNotExist,
};
