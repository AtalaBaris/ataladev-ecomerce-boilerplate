# Atala E-Commerce Boilerplate

> Freelance ve ajans projeleri için hazırlanmış, **kopyala → özelleştir → yayınla** mantığıyla çalışan modüler e-ticaret iskeleti.

Yeni bir müşteri geldiğinde sıfırdan mimari kurmak yerine bu repodan başlayın; marka renklerini, logoyu ve içerikleri değiştirerek hızlıca canlıya alın.

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Neden Bu Boilerplate?

| Sorun | Çözüm |
|-------|--------|
| Her projede sıfırdan klasör yapısı | Hazır DDD backend + FSD frontend iskeleti |
| Auth, admin panel, vitrin ayrı ayrı yazılıyor | Auth modülü + admin login + vitrin route group hazır |
| Müşteri projeleri birbirine karışıyor | İzole modüller; her müşteri için fork/clone |
| Tasarım değişimi zor | Tailwind tema değişkenleri + UI atomları merkezi |

**Kullanım senaryosu:** Müşteri A için clone → logo/renk/metin değiştir → catalog modülünü doldur → deploy. Müşteri B için aynı iskelet, farklı marka.

---

## Tech Stack

| Katman | Teknolojiler |
|--------|-------------|
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL |
| **Frontend** | Next.js (App Router), Tailwind CSS |
| **State & API** | Zustand, Axios, js-cookie |
| **Doğrulama** | Zod (Backend DTO katmanı) |
| **Altyapı** | Docker & Docker Compose |
| **Kimlik Doğrulama** | bcryptjs, jsonwebtoken |

---

## Hızlı Başlangıç

```bash
# 1. Repoyu klonla
git clone https://github.com/KULLANICI_ADIN/atala-ecommerce-boilerplate.git
cd atala-ecommerce-boilerplate

# 2. Veritabanı
docker compose up -d

# 3. Backend
cd backend
cp .env.example .env          # Değerleri düzenle
npm install
npx prisma migrate dev
npm run dev                   # → http://localhost:3000

# 4. Frontend (yeni terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev -- -p 3001        # → http://localhost:3001
```

Admin paneli: **http://localhost:3001/admin/login**

---

## Yeni Müşteri Projesi Checklist

Her yeni freelance işinde şu adımları izleyin:

- [ ] Repoyu fork'la veya `git clone` ile kopyala, repo adını müşteriye göre değiştir
- [ ] `backend/.env` ve `frontend/.env.local` oluştur (**asla Git'e ekleme**)
- [ ] `JWT_SECRET` ve veritabanı şifresini üretimde değiştir
- [ ] `frontend/tailwind.config.js` → marka renk paleti
- [ ] `frontend/src/app/globals.css` → CSS değişkenleri (`--primary` vb.)
- [ ] `frontend/public/` → logo, favicon, görseller
- [ ] `frontend/src/components/layout/Navbar.jsx` → marka adı ve menü
- [ ] `frontend/src/utils/constants.js` → API URL, kargo limiti vb.
- [ ] Backend modüllerini doldur: `catalog`, `orders`…
- [ ] Domain + SSL + production env ayarları

---

## Mimari

### Backend — Domain-Driven Design (DDD)

Her servis (`auth`, `catalog`, `orders`…) kendi kapalı ekosistemine sahiptir:

1. **DTO** — Zod ile istek doğrulama
2. **Entity** — Domain nesnesi
3. **Repository** — Sadece Prisma/DB erişimi
4. **Service** — İş kuralları
5. **Controller** — HTTP req/res

Modüller birbirinin veritabanına doğrudan erişemez; iletişim Service katmanı üzerinden yapılır.

### Frontend — Feature-Sliced Design (FSD)

- `(store)/` → müşteri vitrini (route group, URL'de görünmez)
- `admin/` → yönetim paneli
- `components/ui/` → tekrar kullanılabilir atomlar
- `services/` → tüm API çağrıları (bileşenlerde doğrudan `fetch` yok)

---

## Proje Yapısı

```text
atala-ecommerce-boilerplate/
 ┣ 📂 backend/              # Express API (Modüler Monolit)
 ┣ 📂 frontend/             # Next.js (Vitrin + Admin)
 ┣ 📜 docker-compose.yml   # PostgreSQL
 ┣ 📜 .gitignore            # Gizli dosyalar hariç tutulur
 ┣ 📜 LICENSE               # MIT
 ┗ 📜 README.md
```

---

## Backend Dizin Yapısı

```text
backend/
 ┣ 📂 prisma/
 ┃ ┣ 📂 migrations/         # Veritabanı migration dosyaları
 ┃ ┗ 📜 schema.prisma       # Prisma şeması (User modeli vb.)
 ┃
 ┣ 📂 src/
 ┃ ┣ 📂 config/
 ┃ ┃ ┣ 📜 env.js            # Ortam değişkenleri (PORT, JWT, NODE_ENV)
 ┃ ┃ ┗ 📜 database.js       # Prisma Client + PostgreSQL adapter
 ┃ ┃
 ┃ ┣ 📂 core/               # Global altyapı
 ┃ ┃ ┣ 📂 errors/
 ┃ ┃ ┃ ┣ 📜 AppError.js
 ┃ ┃ ┃ ┗ 📜 http-status.js
 ┃ ┃ ┗ 📂 middleware/
 ┃ ┃   ┣ 📜 error-handler.js
 ┃ ┃   ┗ 📜 validate.middleware.js
 ┃ ┃
 ┃ ┣ 📂 modules/            # İZOLE SERVİSLER
 ┃ ┃ ┣ 📂 auth/             # ✅ Kimlik doğrulama (hazır)
 ┃ ┃ ┃ ┣ 📂 controllers/    # auth.controller.js
 ┃ ┃ ┃ ┣ 📂 dtos/           # login.dto.js, register.dto.js
 ┃ ┃ ┃ ┣ 📂 entities/       # user.entity.js
 ┃ ┃ ┃ ┣ 📂 middleware/     # auth.middleware.js (JWT)
 ┃ ┃ ┃ ┣ 📂 repositories/   # user.repository.js (Prisma)
 ┃ ┃ ┃ ┣ 📂 services/       # auth.service.js
 ┃ ┃ ┃ ┗ 📜 auth.routes.js
 ┃ ┃ ┗ 📂 catalog/          # Ürün kataloğu (planlanan)
 ┃ ┃
 ┃ ┣ 📜 app.js
 ┃ ┗ 📜 server.js
 ┃
 ┣ 📜 .env.example           # Şablon — commit edilir
 ┗ 📜 package.json
```

### Auth API

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/health` | Sunucu durumu |
| `POST` | `/api/auth/register` | Kayıt |
| `POST` | `/api/auth/login` | Giriş + JWT |
| `GET` | `/api/auth/me` | Profil (Bearer token) |

---

## Frontend Dizin Yapısı

```text
frontend/
 ┣ 📂 public/                      # Statik dosyalar
 ┃ ┣ 📂 images/                    # Ürün ve banner görselleri
 ┃ ┣ 📂 icons/                     # İkon seti
 ┃ ┣ 📜 favicon.ico
 ┃ ┣ 📜 manifest.json
 ┃ ┗ 📜 robots.txt
 ┃
 ┣ 📂 src/
 ┃ ┣ 📂 app/
 ┃ ┃ ┣ 📂 (store)/                 # MÜŞTERİ VİTRİNİ
 ┃ ┃ ┃ ┣ 📂 about/                 # Hakkımızda
 ┃ ┃ ┃ ┣ 📂 contact/               # İletişim
 ┃ ┃ ┃ ┣ 📂 products/              # Ürün listesi
 ┃ ┃ ┃ ┃ ┗ 📂 [slug]/              # Ürün detay + components/
 ┃ ┃ ┃ ┣ 📂 cart/                  # Sepet + components/
 ┃ ┃ ┃ ┣ 📂 checkout/              # Ödeme + components/
 ┃ ┃ ┃ ┣ 📂 profile/               # Müşteri paneli + orders/
 ┃ ┃ ┃ ┣ 📜 layout.jsx             # Navbar, Footer
 ┃ ┃ ┃ ┗ 📜 page.jsx               # Ana sayfa
 ┃ ┃ ┃
 ┃ ┃ ┣ 📂 admin/                   # YÖNETİM PANELİ
 ┃ ┃ ┃ ┣ 📂 login/                 # LoginForm, useAdminAuth
 ┃ ┃ ┃ ┣ 📂 dashboard/             # İstatistikler
 ┃ ┃ ┃ ┣ 📂 products/              # Ürün yönetimi
 ┃ ┃ ┃ ┣ 📂 orders/                # Sipariş yönetimi
 ┃ ┃ ┃ ┣ 📂 settings/              # Site ayarları
 ┃ ┃ ┃ ┗ 📜 layout.jsx             # Sidebar, AuthGuard
 ┃ ┃ ┃
 ┃ ┃ ┣ 📜 globals.css
 ┃ ┃ ┣ 📜 layout.jsx
 ┃ ┃ ┗ 📜 not-found.jsx
 ┃ ┃
 ┃ ┣ 📂 components/
 ┃ ┃ ┣ 📂 ui/                      # Button, Input, Modal, Toast…
 ┃ ┃ ┣ 📂 layout/                  # Navbar, Footer, Sidebar, AdminHeader
 ┃ ┃ ┗ 📂 providers/               # ThemeProvider
 ┃ ┃
 ┃ ┣ 📂 hooks/                     # useClickOutside, useDebounce, useMediaQuery
 ┃ ┣ 📂 services/                  # api.js, auth.service.js, product.service.js…
 ┃ ┣ 📂 store/                     # useAuthStore, useCartStore, useUiStore
 ┃ ┣ 📂 utils/                     # constants, formatCurrency, generateSlug…
 ┃ ┗ 📜 middleware.js              # /admin route koruması
 ┃
 ┣ 📜 .env.example                  # Şablon — commit edilir
 ┣ 📜 tailwind.config.js            # Tema renkleri (müşteriye göre değiştir)
 ┗ 📜 package.json
```

---

## Docker & Veritabanı

| Ayar | Değer |
|------|-------|
| İmaj | `postgres:15-alpine` |
| Port | `5433` → `5432` *(yerel PG çakışması için)* |
| DB | `ecommerce_db` |
| User / Pass | `root` / `secretpassword` *(dev only)* |

```bash
docker compose up -d
```

---

## Ortam Değişkenleri

| Dosya | Commit? | Açıklama |
|-------|---------|----------|
| `backend/.env.example` | ✅ Evet | Şablon |
| `backend/.env` | ❌ Hayır | Gerçek secret'lar |
| `frontend/.env.example` | ✅ Evet | Şablon |
| `frontend/.env.local` | ❌ Hayır | API URL |

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

---

## GitHub'a Push

```bash
git init
git add .
git status                    # .env dosyalarının listede OLMADIĞINI doğrula
git commit -m "feat: initial e-commerce boilerplate"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/atala-ecommerce-boilerplate.git
git push -u origin main
```

> **Güvenlik:** Push öncesi `git status` çıktısında `.env`, `.env.local`, `node_modules/` görünmemeli. Kök `.gitignore` bunları otomatik hariç tutar.

---

## Modül Durumu

| Modül | Backend | Frontend | Durum |
|-------|---------|----------|-------|
| Auth | ✅ | ✅ Admin login | Hazır |
| Catalog | 🔲 | 🔲 Placeholder | Sırada |
| Orders | 🔲 | 🔲 Placeholder | Sırada |
| Cart | — | 🔲 Zustand store | Kısmi |
| Checkout | — | 🔲 Placeholder | Sırada |

---

## Geliştirme Kuralları

- **TypeScript yok** — Saf JavaScript + JSDoc + Zod
- **Spagetti kod yasak** — Controller'da iş mantığı, Service'te ham SQL yok
- **Modül izolasyonu** — DTO → Entity → Repository → Service → Controller
- **Frontend servis katmanı** — API çağrıları yalnızca `src/services/` üzerinden
- **Hata toleransı** — Mail, SMS, ödeme gibi dış servisler ana akışı kırmamalı

---

## Lisans

[MIT](LICENSE) — Freelance projelerinizde özgürce kullanabilir, fork'layabilir ve müşteriye özel türevler üretebilirsiniz.

---

<p align="center">
  <sub>Atala E-Commerce Boilerplate — Barış Atala</sub>
</p>
