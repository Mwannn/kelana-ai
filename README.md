# Kelana AI

Kelana AI adalah platform berbasis Artificial Intelligence (AI) yang dirancang untuk membantu pengguna mendapatkan informasi dan berinteraksi dengan teknologi AI secara lebih mudah dan efisien.

## Features

* 🤖 AI Assistant
* 💬 AI Chat
* 🔍 Intelligent Search
* ⚡ Fast & Responsive

## Installation & Setup

1. **Clone repository:**
   ```bash
   git clone <repository-url>
   cd kelana-ai
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Migrasi Database
   python migrate_db.py
   ```
   *Catatan: Pastikan untuk menyesuaikan file `.env` di dalam folder backend sesuai dengan pengaturan database Anda.*

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Catatan: Pastikan untuk menyesuaikan file `.env` jika diperlukan.*

## Run the Application

Anda perlu menjalankan backend dan frontend secara bersamaan di dua terminal yang berbeda.

**1. Jalankan Backend:**
Buka terminal dan masuk ke folder `backend`, lalu jalankan:
```bash
cd backend
uvicorn main:app --reload
```
Server backend akan berjalan di `http://localhost:8000`.

**2. Jalankan Frontend:**
Buka terminal baru dan masuk ke folder `frontend`, lalu jalankan:
```bash
cd frontend
npm run dev
```
Website Kelana AI akan bisa diakses di `http://localhost:3000`.

## Project Status

🚧 **Under Development**

Kelana AI masih dalam tahap pengembangan dan akan terus dikembangkan sesuai kebutuhan.

## License

Copyright © Kelana AI
