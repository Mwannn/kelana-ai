<div align="center">

  <img src="./frontend/public/logo-kelanaai.png" alt="Kelana AI Logo" width="220" />

  # 🧭 Kelana AI
  ### Intelligent Travel Planner & Multi-Turn Conversational Memory Assistant

  [![Next.js](https://img.shields.io/badge/Next.js-14.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Amazon Bedrock](https://img.shields.io/badge/AWS-Amazon%20Bedrock-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  <p align="center">
    <strong>Kelana AI</strong> adalah platform asisten perjalanan pintar berbasis Artificial Intelligence (AI) yang dirancang untuk merencanakan liburan impian, menghasilkan itinerary terstruktur, serta menyediakan percakapan cerdas dengan <em>multi-turn conversational memory</em>.
  </p>

  <p align="center">
    <a href="#-pratinjau-aplikasi">Pratinjau</a> •
    <a href="#-fitur-utama">Fitur Utama</a> •
    <a href="#-arsitektur--teknologi">Teknologi</a> •
    <a href="#-instalasi--menjalankan-aplikasi">Instalasi</a> •
    <a href="#-struktur-proyek">Struktur Proyek</a> •
    <a href="#-daftar-endpoint-api">API Endpoints</a> •
    <a href="#-pengembang--kontak">Pengembang</a>
  </p>

</div>

---

## 📸 Pratinjau Aplikasi

![Kelana AI Application Interface](./frontend/public/image.png)

---

## 🚀 Fitur Utama

### 1. 🧠 Multi-Turn Conversational Memory Chat (Session 10)
Large Language Model (LLM) secara bawaan bersifat *stateless*. Kelana AI mengimplementasikan **manajemen memori percakapan berbasis database** di backend yang menyusun riwayat percakapan secara terurut sebelum dikirim ke Amazon Bedrock:
* **Context Window Trimming**: Mengirimkan riwayat hingga 20 pesan terakhir untuk menjaga efisiensi token dan konteks dialog.
* **Conversation Title Header & Inline Rename**: Judul percakapan dinamis di header yang dapat diubah namanya secara instan.
* **Auto-Scroll to Latest Message**: Pengalaman obrolan mulus yang otomatis menggulir ke pesan terbaru saat dibuka maupun saat respons AI tiba.
* **Real-time Typing Indicator**: Animasi pantulan 3 titik dengan status interaktif saat AI sedang merangkai jawaban.
* **Message Timestamps & Copy Action**: Penanda waktu pembuatan pesan dan tombol salin jawaban satu-klik.
* **Glassmorphic Custom Delete Modal**: Konfirmasi penghapusan percakapan yang modern tanpa popup bawaan browser.

### 2. 🗺️ AI Travel & Itinerary Planner
* Pembuatan rencana perjalanan instan berdasarkan destinasi, jumlah hari liburan, anggaran biaya (*budget*), dan gaya perjalanan (*travel style*: Santai, Petualangan, Kuliner, Budaya).
* Detail aktivitas harian, rekomendasi kuliner, dan tips lokal dalam format terstruktur.

### 3. 📚 RAG Travel Assistant (Retrieval Augmented Generation)
* Integrasi basis pengetahuan (*knowledge base*) panduan wisata untuk menjawab pertanyaan spesifik seputar destinasi dan regulasi perjalanan.

### 4. 👤 Dashboard Profil Pengguna & Personalisasi
* Kartu profil terverifikasi (*Verified Explorer*) dengan metrik statistik (Total Trip, Total Hari, Total Budget, dan Sesi Chat Aktif).
* Pemilih avatar dinamis dari Dicebear Avatars (Micah style) atau URL kustom.
* Manajemen riwayat itinerary dengan aksi lihat detail dan hapus.
* Otentikasi aman berbasis JWT Bearer Token.

---

## 🛠️ Arsitektur & Teknologi

```mermaid
graph TD
    User([Pengguna / Browser]) <--> NextJS[Frontend: Next.js 14 + Tailwind CSS]
    NextJS <-->|REST API + JWT Bearer| FastAPI[Backend: FastAPI Python 3.10]
    FastAPI <-->|SQLAlchemy ORM| Postgres[(Database: PostgreSQL 14)]
    FastAPI <-->|Converse API| Bedrock[AWS Amazon Bedrock - Nova Lite]
```

### Stack Teknologi:
* **Frontend**:
  * Framework: [Next.js 14](https://nextjs.org/) (App Router)
  * Styling: [Tailwind CSS](https://tailwindcss.com/) + Custom Design Tokens (`#F4EFE6`, `#E85D2F`, `#0E4F4A`)
  * Typography: Google Fonts (*Fraunces*, *Plus Jakarta Sans*, *Space Mono*)
  * Icons & Media: [FontAwesome 6](https://fontawesome.com/) & [Dicebear Avatars](https://www.dicebear.com/)
  * Markdown Parser: `react-markdown`

* **Backend**:
  * Framework: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10)
  * ORM & Database: [SQLAlchemy](https://www.sqlalchemy.org/) & [PostgreSQL](https://www.postgresql.org/)
  * Validasi Skema: [Pydantic V2](https://docs.pydantic.dev/)
  * Keamanan: [Passlib](https://passlib.readthedocs.io/) (bcrypt) & [python-jose](https://python-jose.readthedocs.io/) (JWT)
  * AI Service: `boto3` (AWS SDK for Python) - Amazon Bedrock Converse API

---

## 📦 Struktur Proyek

```text
Kelana-ai/
├── backend/
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py              # Endpoint autentikasi & profil (/auth)
│   │       ├── trips.py             # Endpoint itinerary perjalanan (/trips)
│   │       ├── assistant.py         # Endpoint RAG Assistant (/assistant)
│   │       └── conversations.py     # Endpoint percakapan & pesan (/conversations)
│   ├── models/
│   │   ├── user.py                  # Model tabel users
│   │   ├── trip.py                  # Model tabel trips & days
│   │   └── conversation.py          # Model tabel conversations & messages
│   ├── schemas/
│   │   ├── user_schema.py           # Validasi Pydantic user
│   │   ├── trip_schema.py           # Validasi Pydantic trip
│   │   └── conversation_schema.py   # Validasi Pydantic chat & memory
│   ├── services/
│   │   ├── auth_service.py          # Logika bisnis hash password & JWT
│   │   ├── trip_service.py          # Logika bisnis prompt itinerary AI
│   │   ├── assistant_service.py     # Logika RAG knowledge base
│   │   └── chat_service.py          # Multi-turn prompt builder & Bedrock
│   ├── database.py                  # Konfigurasi koneksi database engine
│   ├── migrate_db.py                # Script migrasi tabel database
│   ├── requirements.txt             # Dependensi Python
│   └── main.py                      # Entry point FastAPI & CORS
│
├── frontend/
│   ├── app/
│   │   ├── assistant/page.tsx       # Halaman RAG Travel Assistant
│   │   ├── chat/page.tsx            # Halaman Stateful AI Memory Chat
│   │   ├── profile/page.tsx         # Halaman Detail Profil Pengguna
│   │   ├── trips/page.tsx           # Halaman My Trips Dashboard
│   │   ├── login/page.tsx           # Halaman Masuk Akun
│   │   ├── register/page.tsx        # Halaman Pendaftaran Akun
│   │   ├── globals.css              # Variabel tema & utilitas CSS
│   │   └── layout.tsx               # Root Layout & Font loader
│   ├── components/
│   │   └── Navbar.tsx               # Komponen navigasi terpadu & responsif
│   ├── services/
│   │   ├── chatService.ts           # Client API service untuk percakapan
│   │   └── tripService.ts           # Client API service untuk trip & auth
│   └── public/
│       ├── logo-kelanaai.png        # Aset visual & logo Kelana AI
│       └── image.png                # Tangkapan layar pratinjau antarmuka aplikasi
│
└── README.md                        # Dokumentasi repositori
```

---

## ⚙️ Instalasi & Menjalankan Aplikasi

### 1. Kloning Repositori
```bash
git clone https://github.com/Mwannn/kelana-ai.git
cd Kelana-ai
```

### 2. Konfigurasi & Jalankan Backend (FastAPI)

1. Masuk ke direktori `backend`:
   ```bash
   cd backend
   ```
2. Buat virtual environment (opsional) dan install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
3. Buat file `.env` di dalam folder `backend`:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kelana_ai
   SECRET_KEY=your_jwt_secret_key_here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   ```
4. Jalankan migrasi tabel database:
   ```bash
   python migrate_db.py
   ```
5. Jalankan server backend Uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *Swagger API Documentation dapat diakses di: `http://localhost:8000/docs`*

### 3. Konfigurasi & Jalankan Frontend (Next.js)

1. Buka terminal baru dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependensi Node.js:
   ```bash
   npm install
   ```
3. Buat file `.env.local` di dalam folder `frontend`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```
4. Jalankan server pengembang Next.js:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses **`http://localhost:3000`** atau **`http://localhost:3001`**.

---

## 📡 Daftar Endpoint API

| Metode | Endpoint | Deskripsi | Autentikasi |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Pendaftaran pengguna baru | Public |
| `POST` | `/api/v1/auth/login` | Masuk akun & generate JWT Token | Public |
| `GET` | `/api/v1/auth/me` | Mengambil data detail profil pengguna | Bearer Token |
| `PUT` | `/api/v1/auth/me` | Memperbarui nama, email, avatar, dan password | Bearer Token |
| `GET` | `/api/v1/conversations/` | Mengambil daftar percakapan pengguna | Bearer Token |
| `POST` | `/api/v1/conversations/` | Membuat sesi percakapan baru | Bearer Token |
| `GET` | `/api/v1/conversations/{id}` | Mengambil detail percakapan & seluruh pesan | Bearer Token |
| `POST` | `/api/v1/conversations/{id}/messages` | Mengirim pesan ke AI dengan memori multi-turn | Bearer Token |
| `PATCH`| `/api/v1/conversations/{id}` | Mengubah judul sesi percakapan | Bearer Token |
| `DELETE`| `/api/v1/conversations/{id}` | Menghapus sesi percakapan beserta pesannya | Bearer Token |
| `POST` | `/api/v1/trips/generate` | Generate itinerary perjalanan baru via AI | Bearer Token |
| `GET` | `/api/v1/trips/` | Mengambil daftar seluruh trip yang dibuat | Bearer Token |

---

## 👨‍💻 Pengembang & Kontak

Proyek ini dirancang dan dikembangkan dengan penuh semangat oleh:

<div align="center">

  ### **Marwan Wisnu**
  *Fullstack AI & Software Developer*

  🌐 **Website Portofolio**: [https://marwan-wisnu.my.id/](https://marwan-wisnu.my.id/)  
  🐙 **GitHub**: [@Mwannn](https://github.com/Mwannn)  
  📱 **Instagram / Socials**: [@mwannn_n](https://www.instagram.com/mwannn_n/)

</div>

---

<div align="center">
  <sub>Hak Cipta © 2026 <strong>Kelana AI</strong>. Dikembangkan oleh <a href="https://marwan-wisnu.my.id/">Marwan Wisnu (mwannn_n)</a>.</sub>
</div>
