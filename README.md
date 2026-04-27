# Locket QQ

<div align="center">
  <p>
    <img src="./assets/locket-qq-logo.png" alt="Locket QQ Logo" width="180" />
  </p>

Ứng dụng web chia sẻ ảnh/video cho cộng đồng Locket Widget, kèm bộ self-hosted đầy đủ API + Storage + Web.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Demo](https://img.shields.io/badge/demo-locket--qq.com-2ea44f)](https://locket-qq.com)
[![Repo](https://img.shields.io/badge/repo-lvquyen15506%2Flocket--qq-0969da)](https://github.com/lvquyen15506/locket-qq)
</div>

## Muc luc

- [Tong quan](#tong-quan)
- [Link quan trong](#link-quan-trong)
- [Cau truc du an](#cau-truc-du-an)
- [Chay local nhanh](#chay-local-nhanh)
- [Self-hosted bang Docker](#self-hosted-bang-docker)
- [Deploy](#deploy)
- [Tai lieu lien quan](#tai-lieu-lien-quan)
- [Dong gop](#dong-gop)

## Tong quan

Repo hien tai gom 2 nhom chinh:

- `apps/main`: web client chinh (Vite + React).
- `apps/self-hosted`: bo stack tu host gom `api`, `storage`, `web`.

## Link quan trong

### Public

- Website chinh: https://locket-qq.com
- Repository: https://github.com/lvquyen15506/locket-qq
- Telegram cong dong: https://t.me/ddevdio

### Endpoint mac dinh (tham khao tu `apps/main/.env.example`)

- Base API: `https://api.locket-qq.com`
- Auth API: `https://auth.locket-qq.com`
- Data API: `https://data.locket-qq.com`
- Payment API: `https://payment.locket-qq.com`
- Storage API: `https://storage.locket-qq.com`
- Media API: `https://media.locket-qq.com`
- CDN: `https://cdn.locket-qq.com`

### Self-hosted local ports (docker-compose)

- Web: `http://localhost:5173`
- API: `http://localhost:5001`
- Storage: `http://localhost:5003`

## Cau truc du an

```text
locket-qq/
├── README.md
├── CONTRIBUTING.md
├── vercel.json
├── apps/
│   ├── README.md
│   ├── main/
│   │   ├── src/
│   │   ├── public/
│   │   ├── .env.example
│   │   ├── firebase.json
│   │   └── package.json
│   └── self-hosted/
│       ├── README.md
│       ├── docker-compose.yml
│       ├── api/
│       ├── storage/
│       └── web/
└── assets/
```

## Chay local nhanh

### 1) Chay web chinh (`apps/main`)

```bash
cd apps/main
npm install
cp .env.example .env
npm run dev
```

Neu dung Windows PowerShell:

```powershell
cd apps/main
npm install
Copy-Item .env.example .env
npm run dev
```

## Self-hosted bang Docker

```bash
cd apps/self-hosted
cp api/.env.example api/.env.production
cp storage/.env.example storage/.env.production
cp web/.env.example web/.env.production
docker compose up -d --build
```

PowerShell:

```powershell
cd apps/self-hosted
Copy-Item api/.env.example api/.env.production
Copy-Item storage/.env.example storage/.env.production
Copy-Item web/.env.example web/.env.production
docker compose up -d --build
```

## Deploy

- Firebase hosting cho `apps/main`: xem `apps/main/firebase.json`.
- Vercel config o root dang tro den build self-hosted web:
  - Build command: `cd apps/self-hosted/web && npm install && npm run build`
  - Output: `apps/self-hosted/web/dist`

## Tai lieu lien quan

- Huong dan apps: [apps/README.md](./apps/README.md)
- Huong dan self-hosted: [apps/self-hosted/README.md](./apps/self-hosted/README.md)
- API docs self-hosted: [apps/self-hosted/api/API_DOCS.md](./apps/self-hosted/api/API_DOCS.md)
- Huong dan dong gop: [CONTRIBUTING.md](./CONTRIBUTING.md)

## Dong gop

PR va issue deu duoc chao don. Truoc khi gui PR, vui long:

- Tao issue/discussion neu thay doi lon.
- Chay build/lint o phan da sua.
- Dat commit theo Conventional Commits.

---

<div align="center">
  Made with care for Locket community.
</div>
