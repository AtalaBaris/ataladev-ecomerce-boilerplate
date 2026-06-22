# Atala E-Commerce Boilerplate (Microservice Architecture)

> Freelance ve ajans projeleri için hazırlanmış, **kopyala → özelleştir → yayınla** mantığıyla çalışan modüler e-ticaret iskeleti.

Bu proje, yüksek performanslı, ölçeklenebilir ve tam izole edilmiş **mikro-servis benzeri bir monolit (Modüler Monolit)** e-ticaret altyapısıdır. Domain-Driven Design (DDD) ve Clean Architecture prensipleriyle saf JavaScript (ES6+) kullanılarak inşa edilmiştir.

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

## 🛠 Tech Stack

| Katman | Teknolojiler |
|--------|-------------|
| **Backend** | Node.js, Express.js, Prisma ORM, PostgreSQL |
| **Frontend** | Next.js (App Router), Tailwind CSS |
| **State & API** | Zustand, Axios, js-cookie |
| **Doğrulama** | Zod (Backend DTO katmanı) |
| **Altyapı** | Docker & Docker Compose |
| **Kimlik Doğrulama** | bcryptjs, jsonwebtoken, nodemailer (şifre sıfırlama) |

---

## 🏛 Mimari Felsefe (Domain-Driven Design)

Backend yapısı tamamen izole modüllerden oluşur. Her servis (`auth`, `catalog`, `orders` vb.) kendi kapalı ekosistemine sahiptir ve şu katmanlardan oluşur:

1. **DTO (Data Transfer Object):** İsteklerin Zod ile doğrulandığı güvenlik katmanı.
2. **Entity:** Veritabanı tablolarının nesne (Object) karşılığı.
3. **Repository:** Sadece veritabanı ile konuşan (Prisma/SQL), iş mantığından arındırılmış katman.
4. **Service:** Tüm iş kurallarının (Business Logic) çalıştığı merkez.
5. **Controller:** HTTP İstek/Cevap (Req/Res) döngüsünü yöneten yönlendirici.

Hiçbir modül, başka bir modülün veritabanı sorgusunu doğrudan çalıştıramaz. İletişim sadece Service katmanları üzerinden, `try/catch` bloklarıyla izole edilerek yapılır (**Graceful Degradation**).

Frontend tarafında **Feature-Sliced Design (FSD)** prensiplerine uygun, sayfa bazlı bileşen izolasyonu ve merkezi servis katmanı kullanılır:

- `(store)/` → müşteri vitrini (route group, URL'de görünmez)
- `admin/` → yönetim paneli
- `components/ui/` → tekrar kullanılabilir atomik bileşenler
- `services/` → tüm API çağrıları (bileşenlerde doğrudan `fetch` yok)

---

## 📂 Proje Kök Dizini

```text
atala-ecommerce-boilerplate/
 ┣ 📂 backend/              # Express API (Modüler Monolit)
 ┣ 📂 frontend/             # Next.js App Router (Vitrin + Admin Panel)
 ┣ 📜 docker-compose.yml    # PostgreSQL container tanımı
 ┣ 📜 .gitignore            # Gizli dosyalar hariç tutulur (.env, node_modules…)
 ┣ 📜 LICENSE               # MIT lisansı
 ┗ 📜 README.md
```

---

## 📂 Backend Dizin Yapısı

```text
backend/
 ┣ 📂 prisma/
 ┃ ┣ 📂 migrations/         # Veritabanı migration dosyaları
 ┃ ┗ 📜 schema.prisma       # Prisma şeması (User modeli vb.)
 ┃
 ┣ 📂 src/
 ┃ ┣ 📂 config/
 ┃ ┃ ┣ 📜 env.js            # Ortam değişkenleri (PORT, JWT, SMTP, admin seed)
 ┃ ┃ ┗ 📜 database.js        # Prisma Client + PostgreSQL adapter (pg Pool)
 ┃ ┃
 ┃ ┣ 📂 core/               # Global altyapı (modüllerden bağımsız)
 ┃ ┃ ┣ 📂 errors/
 ┃ ┃ ┃ ┣ 📜 AppError.js      # Operasyonel hata sınıfı
 ┃ ┃ ┃ ┗ 📜 http-status.js   # HTTP durum kodları sabitleri
 ┃ ┃ ┣ 📂 services/
 ┃ ┃ ┃ ┗ 📜 email.service.js # SMTP / dev konsol mail gönderimi
 ┃ ┃ ┗ 📂 middleware/
 ┃ ┃   ┣ 📜 error-handler.js # Global Express hata yakalayıcı
 ┃ ┃   ┣ 📜 validate.middleware.js  # Zod tabanlı istek doğrulama
 ┃ ┃   ┗ 📜 require-admin.js # Admin rol kontrolü (re-export)
 ┃ ┃
 ┃ ┣ 📂 modules/             # İZOLE SERVİSLER
 ┃ ┃ ┣ 📂 auth/              # Kimlik doğrulama modülü ✅
 ┃ ┃ ┃ ┣ 📂 controllers/
 ┃ ┃ ┃ ┃ ┗ 📜 auth.controller.js   # HTTP req/res yönetimi (iş mantığı yok)
 ┃ ┃ ┃ ┣ 📂 constants/
 ┃ ┃ ┃ ┃ ┗ 📜 roles.js             # USER / ADMIN rol sabitleri
 ┃ ┃ ┃ ┣ 📂 dtos/
 ┃ ┃ ┃ ┃ ┣ 📜 login.dto.js         # Giriş isteği Zod şeması
 ┃ ┃ ┃ ┃ ┣ 📜 register.dto.js      # Kayıt isteği Zod şeması
 ┃ ┃ ┃ ┃ ┗ 📜 password-reset.dto.js # Şifre sıfırlama / refresh Zod şemaları
 ┃ ┃ ┃ ┣ 📂 entities/
 ┃ ┃ ┃ ┃ ┗ 📜 user.entity.js       # User domain nesnesi + toPublic()
 ┃ ┃ ┃ ┣ 📂 middleware/
 ┃ ┃ ┃ ┃ ┣ 📜 auth.middleware.js   # JWT Bearer token doğrulama
 ┃ ┃ ┃ ┃ ┣ 📜 require-admin.middleware.js  # ADMIN rol zorunluluğu
 ┃ ┃ ┃ ┃ ┗ 📜 register-guard.middleware.js # Production'da public kayıt kapalı
 ┃ ┃ ┃ ┣ 📂 repositories/
 ┃ ┃ ┃ ┃ ┣ 📜 user.repository.js
 ┃ ┃ ┃ ┃ ┣ 📜 refresh-token.repository.js
 ┃ ┃ ┃ ┃ ┣ 📜 password-reset.repository.js
 ┃ ┃ ┃ ┃ ┗ 📜 login-log.repository.js
 ┃ ┃ ┃ ┣ 📂 services/
 ┃ ┃ ┃ ┃ ┗ 📜 auth.service.js      # Hash, JWT, refresh, reset, login log
 ┃ ┃ ┃ ┗ 📜 auth.routes.js         # /api/auth endpoint tanımları
 ┃ ┃ ┗ 📂 catalog/               # Ürün kataloğu modülü (planlanan — aynı yapı)
 ┃ ┃
 ┃ ┣ 📜 app.js                 # Express uygulaması (CORS, rotalar, 404)
 ┃ ┗ 📜 server.js              # Port dinleyici + DB bağlantı yönetimi
 ┃
 ┣ 📜 .env.example             # Örnek ortam değişkenleri (commit edilir)
 ┣ 📜 prisma.config.ts         # Prisma 7 yapılandırması
 ┗ 📜 package.json
```

### Backend API Endpoint'leri (Auth)

| Method | Endpoint | Auth | Açıklama |
|--------|----------|------|----------|
| `GET` | `/health` | — | Sunucu durumu |
| `POST` | `/api/auth/register` | — | Müşteri kaydı *(production'da kapalı)* |
| `POST` | `/api/auth/login` | — | Müşteri girişi *(vitrin — ileride)* |
| `GET` | `/api/auth/me` | Bearer | Müşteri profili |
| `POST` | `/api/auth/admin/login` | — | Admin girişi *(yalnızca ADMIN rolü)* |
| `POST` | `/api/auth/admin/refresh` | — | Access token yenileme |
| `POST` | `/api/auth/admin/logout` | — | Refresh token iptali |
| `POST` | `/api/auth/admin/forgot-password` | — | Şifre sıfırlama e-postası |
| `POST` | `/api/auth/admin/reset-password` | — | Yeni şifre belirleme |
| `GET` | `/api/auth/admin/me` | Admin | Admin profili |
| `GET` | `/api/auth/admin/login-logs` | Admin | Son giriş denemeleri |

### Auth Güvenlik Özellikleri

| Özellik | Detay |
|---------|--------|
| **Rol ayrımı** | Admin paneli yalnızca `ADMIN` rolü; müşteri `USER` |
| **Access + refresh token** | Access 24h, refresh 7d; refresh hash'lenerek DB'de saklanır |
| **Login logları** | E-posta, IP, user-agent, başarı/başarısızlık; 30 gün sonra otomatik silinir |
| **Şifre sıfırlama** | Tek kullanımlık token; reset sonrası tüm refresh token'lar iptal |
| **Register guard** | Production'da `/register` kapalı (`ENABLE_PUBLIC_REGISTER=true` ile açılır) |
| **Şifre hash** | bcrypt, 12 salt round |
| **Dev mail** | SMTP boşsa sıfırlama linki yalnızca backend terminaline yazılır |

---

## 📂 Frontend Dizin Yapısı

```text
frontend/
 ┣ 📂 public/                      # Statik dosyalar (logolar, ikonlar, manifest, robots.txt)
 ┃ ┣ 📂 images/                    # Ürün ve banner görselleri
 ┃ ┣ 📂 icons/                     # SVG / PNG ikon seti
 ┃ ┣ 📜 favicon.ico
 ┃ ┣ 📜 manifest.json              # PWA manifest
 ┃ ┗ 📜 robots.txt
 ┃
 ┣ 📂 src/
 ┃ ┣ 📂 app/                       # NEXT.JS APP ROUTER (Sayfalar ve Rotalar)
 ┃ ┃ ┣ 📂 (store)/                 # --- MÜŞTERİ VİTRİNİ (Route Group) ---
 ┃ ┃ ┃ ┣ 📂 about/                 # Hakkımızda
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 contact/               # İletişim ve Harita
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 products/              # Ürün Listeleme / Kategori Sayfası
 ┃ ┃ ┃ ┃ ┣ 📂 [slug]/              # Tekil Ürün Detay Sayfası
 ┃ ┃ ┃ ┃ ┃ ┣ 📂 components/        # ImageGallery.jsx, VariationSelect.jsx
 ┃ ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 cart/                  # Alışveriş Sepeti
 ┃ ┃ ┃ ┃ ┣ 📂 components/          # CartItem.jsx, CartSummary.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 checkout/              # Ödeme Adımı
 ┃ ┃ ┃ ┃ ┣ 📂 components/          # AddressForm.jsx, PaymentIframe.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 profile/               # Müşteri Paneli
 ┃ ┃ ┃ ┃ ┣ 📂 orders/              # Müşteri Sipariş Geçmişi
 ┃ ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📜 layout.jsx             # Vitrin Layout'u (Navbar, Footer)
 ┃ ┃ ┃ ┗ 📜 page.jsx               # Vitrin Ana Sayfası (Hero Banner, Featured Products)
 ┃ ┃ ┃
 ┃ ┃ ┣ 📂 admin/                   # --- YÖNETİM PANELİ ---
 ┃ ┃ ┃ ┣ 📂 login/                 # Admin Giriş
 ┃ ┃ ┃ ┃ ┣ 📂 components/          # LoginForm.jsx
 ┃ ┃ ┃ ┃ ┣ 📂 hooks/               # useAdminAuth.js
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 forgot-password/       # Şifremi unuttum
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 reset-password/        # Yeni şifre belirleme (?token=…)
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 dashboard/             # Admin İstatistikleri
 ┃ ┃ ┃ ┃ ┣ 📂 components/          # RevenueChart.jsx, StatCard.jsx, RecentOrders.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 products/              # Ürün Yönetimi
 ┃ ┃ ┃ ┃ ┣ 📂 [id]/                # Ürün Düzenleme Sayfası
 ┃ ┃ ┃ ┃ ┣ 📂 components/          # ProductTable.jsx, AddProductModal.jsx, ImageUploader.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 orders/                # Sipariş Yönetimi
 ┃ ┃ ┃ ┃ ┣ 📂 components/          # OrderListTable.jsx, OrderStatusDropdown.jsx
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┣ 📂 settings/              # Site Ayarları (Logo, İletişim bilgileri güncelleme)
 ┃ ┃ ┃ ┃ ┗ 📜 page.jsx
 ┃ ┃ ┃ ┗ 📜 layout.jsx             # Admin Layout'u (Sidebar, Header, AuthGuard)
 ┃ ┃ ┃
 ┃ ┃ ┣ 📜 globals.css              # Tailwind direktifleri ve global CSS değişkenleri (Dark mode)
 ┃ ┃ ┣ 📜 layout.jsx               # Root Layout (Tüm projenin fontları, meta verileri)
 ┃ ┃ ┗ 📜 not-found.jsx            # Özel 404 Sayfası
 ┃ ┃
 ┃ ┣ 📂 components/                # GLOBAL UI BİLEŞENLERİ (Her Yerde Kullanılabilenler)
 ┃ ┃ ┣ 📂 ui/                      # Atomik Elementler (Shadcn UI tarzı)
 ┃ ┃ ┃ ┣ 📜 Button.jsx
 ┃ ┃ ┃ ┣ 📜 Input.jsx
 ┃ ┃ ┃ ┣ 📜 Textarea.jsx
 ┃ ┃ ┃ ┣ 📜 Badge.jsx              # Örn: Stokta, Tükendi, Kargolandı etiketleri
 ┃ ┃ ┃ ┣ 📜 Modal.jsx
 ┃ ┃ ┃ ┣ 📜 Spinner.jsx
 ┃ ┃ ┃ ┗ 📜 Toast.jsx              # Bildirim mesajları (Başarılı, Hata vb.)
 ┃ ┃ ┣ 📂 layout/                  # Yapısal Bileşenler
 ┃ ┃ ┃ ┣ 📜 Navbar.jsx             # Vitrin üst menüsü
 ┃ ┃ ┃ ┣ 📜 Footer.jsx             # Vitrin alt bilgi alanı
 ┃ ┃ ┃ ┣ 📜 Sidebar.jsx            # Admin paneli sol menüsü
 ┃ ┃ ┃ ┗ 📜 AdminHeader.jsx        # Admin üst bar (çıkış, kullanıcı bilgisi)
 ┃ ┃ ┗ 📂 providers/
 ┃ ┃   ┣ 📜 ThemeProvider.jsx      # Dark/Light mod yönetimi
 ┃ ┃   ┗ 📜 AdminSessionProvider.jsx  # Admin oturum hydrate (yalnızca /admin)
 ┃ ┃
 ┃ ┣ 📂 hooks/                     # GLOBAL CUSTOM HOOKS
 ┃ ┃ ┣ 📜 useClickOutside.js       # Modalları kapatmak için
 ┃ ┃ ┣ 📜 useDebounce.js           # Arama inputlarında gecikmeli istek atmak için
 ┃ ┃ ┗ 📜 useMediaQuery.js          # Mobil/Desktop ekran boyutunu JS tarafında yakalamak için
 ┃ ┃
 ┃ ┣ 📂 services/                  # AXIOS API KATMANI (Backend ile Haberleşme)
 ┃ ┃ ┣ 📜 api.js                   # Merkezi Axios instance (Interceptor'lar, Token ekleme)
 ┃ ┃ ┣ 📜 auth.service.js          # login, logout, verifyToken
 ┃ ┃ ┣ 📜 product.service.js       # getProducts, getProductBySlug, createProduct
 ┃ ┃ ┣ 📜 cart.service.js          # Sepet senkronizasyonu (Veritabanı bazlı ise)
 ┃ ┃ ┗ 📜 order.service.js         # createOrder, getOrders
 ┃ ┃
 ┃ ┣ 📂 store/                     # GLOBAL STATE YÖNETİMİ (Zustand)
 ┃ ┃ ┣ 📜 useAuthStore.js          # Kullanıcı oturum bilgileri (isAdmin, userProfile)
 ┃ ┃ ┣ 📜 useCartStore.js          # Sepet verileri (LocalStorage entegreli, ürün ekle/çıkar/hesapla)
 ┃ ┃ ┗ 📜 useUiStore.js            # Global UI durumları (Sidebar açık mı, Sepet çekmecesi açık mı)
 ┃ ┃
 ┃ ┣ 📂 utils/                     # YARDIMCI FONKSİYONLAR
 ┃ ┃ ┣ 📜 constants.js             # Sabitler (Kargo ücreti limiti, API endpoint URL'leri)
 ┃ ┃ ┣ 📜 formatCurrency.js        # Fiyatları TL formatına çevirme (Örn: 1.500,00 ₺)
 ┃ ┃ ┣ 📜 formatDate.js            # Tarih formatlama (Örn: 24 Haziran 2026)
 ┃ ┃ ┣ 📜 generateSlug.js          # 'Çiçek Balı' → 'cicek-bali' çevirimi
 ┃ ┃ ┗ 📜 cn.js                    # Tailwind class birleştirme yardımcısı
 ┃ ┃
 ┃ ┗ 📜 middleware.js              # NEXT.JS ROUTE KORUMASI (Token yoksa /admin'e girmeyi engeller)
 ┃
 ┣ 📜 .dockerignore                # Docker'a dahil edilmeyecek dosyalar
 ┣ 📜 Dockerfile                   # Frontend'in container edilmesi
 ┣ 📜 .env.example                  # Şablon — commit edilir
 ┣ 📜 jsconfig.json                # Base path ayarları (@/ alias'ları için)
 ┣ 📜 package.json
 ┣ 📜 postcss.config.js
 ┗ 📜 tailwind.config.js           # Dark mode class ayarları ve tema renk paleti
```

---

## 🐳 Docker & Veritabanı

`docker-compose.yml` kök dizinde PostgreSQL servisini tanımlar:

| Ayar | Değer |
|------|-------|
| İmaj | `postgres:15-alpine` |
| Container | `atala-postgres` |
| Port | `5433` → `5432` *(yerel PostgreSQL çakışmasını önlemek için)* |
| DB | `ecommerce_db` |
| User | `root` |
| Password | `secretpassword` *(yalnızca geliştirme ortamı)* |

> **Not:** Makinenizde 5432 portunda yerel PostgreSQL çalışıyorsa Docker portu `5433` olarak map edilmiştir. `backend/.env` içindeki `DATABASE_URL` buna göre ayarlanmalıdır.

```bash
docker compose up -d
```

---

## 🚀 Kurulum ve Çalıştırma

### 1. Repoyu klonla
```bash
git clone https://github.com/KULLANICI_ADIN/atala-ecommerce-boilerplate.git
cd atala-ecommerce-boilerplate
```

### 2. Veritabanını başlat
```bash
docker compose up -d
```

### 3. Backend
```bash
cd backend
cp .env.example .env        # İlk kurulumda — değerleri düzenle
npm install
npx prisma migrate dev      # Tabloları oluştur
npm run prisma:seed         # Admin kullanıcısı (.env ADMIN_* değerleri)
npm run dev                 # http://localhost:3000
```

### 4. Frontend
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev -- -p 3001      # http://localhost:3001
```

> Backend ve frontend aynı anda çalışırken port çakışması olmaması için Next.js'i `3001` portunda başlatın.

### 5. Admin kullanıcısı
```bash
cd backend
npm run prisma:seed
```

Varsayılan giriş (`backend/.env` içindeki `ADMIN_EMAIL` / `ADMIN_PASSWORD`):
- E-posta: `admin@atala.com`
- Şifre: `.env` dosyasındaki `ADMIN_PASSWORD`

Admin paneli: **http://localhost:3001/admin/login**

---

## Login Logları (Terminal)

### Yöntem 1 — npm script (önerilen)
```bash
cd backend
npm run logs:login        # Son 20 kayıt
npm run logs:login 50     # Son 50 kayıt
```

### Yöntem 2 — API (admin token gerekli)
```bash
# 1) Admin girişi — accessToken al
curl -s -X POST http://localhost:3000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@atala.com","password":"SIFRENIZ"}'

# 2) Logları listele
curl -s http://localhost:3000/api/auth/admin/login-logs?limit=20 \
  -H "Authorization: Bearer ACCESS_TOKEN_BURAYA" | python3 -m json.tool
```

### Yöntem 3 — Prisma Studio (görsel)
```bash
cd backend
npm run prisma:studio
```
`login_logs` tablosunu açın.

### Şifre sıfırlama (geliştirme)
SMTP yapılandırılmadıysa sıfırlama linki **yalnızca backend terminalinde** görünür (`npm run dev` penceresi). Frontend genel bir onay mesajı gösterir; link API yanıtında dönmez.

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

## Ortam Değişkenleri

| Dosya | Commit? | Açıklama |
|-------|---------|----------|
| `backend/.env.example` | ✅ Evet | Şablon |
| `backend/.env` | ❌ Hayır | Gerçek secret'lar |
| `frontend/.env.example` | ✅ Evet | Şablon |
| `frontend/.env.local` | ❌ Hayır | API URL |

**Backend önemli değişkenler:** `JWT_SECRET`, `APP_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ENABLE_PUBLIC_REGISTER`, `LOGIN_LOG_RETENTION_DAYS`, `PASSWORD_RESET_EXPIRES_MINUTES`, `SMTP_*`

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
| Auth | ✅ Tam (admin güvenlik) | ✅ Login, forgot/reset, middleware | Hazır |
| Catalog | 🔲 | 🔲 Placeholder | Sırada |
| Orders | 🔲 | 🔲 Placeholder | Sırada |
| Cart | — | 🔲 Zustand store | Kısmi |
| Checkout | — | 🔲 Placeholder | Sırada |

---

## 📜 Geliştirme Kuralları (AI Yönergeleri)

- **TypeScript Yok:** Proje saf JavaScript ile yazılacaktır. Gelişmiş tip denetimleri JSDoc ve Zod ile sağlanacaktır.
- **Spagetti Kod Yasak:** Controller içinde iş mantığı (business logic) yazılamaz; Service içinde doğrudan veritabanı sorgusu atılamaz.
- **Hata Toleransı:** Dış servislere (Mail, SMS, Ödeme) yapılan istekler ana akışı bozmamalıdır.
- **Modül İzolasyonu:** Her backend modülü kendi DTO → Entity → Repository → Service → Controller zincirine sahiptir.
- **Frontend Servis Katmanı:** Bileşenler doğrudan `fetch` atmaz; tüm API çağrıları `src/services/` üzerinden yapılır.

---

## Lisans

[MIT](LICENSE) — Freelance projelerinizde özgürce kullanabilir, fork'layabilir ve müşteriye özel türevler üretebilirsiniz.

---

<p align="center">
  <sub>Atala E-Commerce Boilerplate — Barış Atala</sub>
</p>
