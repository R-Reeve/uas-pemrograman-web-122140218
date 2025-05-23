# Aplikasi React Router - Forum Final Fantasy

## Deskripsi

Ini adalah aplikasi web fullstack berbasis **React** (dengan Vite) dan **Python Pyramid** yang dirancang sebagai **forum online untuk para penggemar Final Fantasy**. Pengguna dapat membuat akun, login, melihat daftar topik diskusi, menambahkan topik baru, serta melihat detail dari setiap topik yang dibahas.

Aplikasi ini menggunakan **React Router** untuk navigasi antar halaman, serta memiliki sistem autentikasi dan fitur manajemen topik. Di sisi backend, digunakan **SQLAlchemy** sebagai ORM dan **PostgreSQL** sebagai basis data utama.

## Struktur Aplikasi

### Frontend (React + Vite)

- **React** digunakan untuk membangun antarmuka pengguna (UI).
- **Vite** digunakan sebagai bundler ringan dan cepat.
- **React Router DOM** digunakan untuk routing halaman seperti login, registrasi, home, dan forum.

### Backend (Python Pyramid + SQLAlchemy)

- **Python Pyramid** digunakan sebagai framework backend untuk menangani permintaan API dan logika server.
- **SQLAlchemy** digunakan untuk mengelola interaksi basis data secara efisien.
- **PostgreSQL** digunakan sebagai sistem basis data relasional.

## Struktur Komponen

### Komponen Utama

- `App.jsx`  
  Komponen root yang mengatur routing utama dari aplikasi menggunakan `react-router-dom`.

### Halaman-halaman (Pages)

- `LoginPage`  
  Halaman login pengguna untuk mengakses forum.

- `RegisterPage`  
  Halaman untuk registrasi pengguna baru yang ingin bergabung.

- `HomePage`  
  Halaman utama forum setelah login, menampilkan ringkasan topik terbaru.

- `TopicListPage`  
  Menampilkan daftar topik diskusi seputar Final Fantasy.

- `TopicAddPage`  
  Halaman untuk membuat topik baru oleh pengguna.

- `TopicDetailPage`  
  Menampilkan detail topik dan diskusi di dalamnya.

## Teknologi yang Digunakan

### Frontend

- **React** – Library JavaScript untuk membangun antarmuka pengguna.
- **React Router DOM** – Untuk navigasi antar halaman.
- **JSX** – Sintaks JavaScript yang memungkinkan penggunaan HTML langsung dalam kode.
- **Vite** – Build tool modern untuk React yang sangat cepat.

### Backend

- **Python Pyramid** – Framework backend yang ringan dan fleksibel.
- **SQLAlchemy** – ORM untuk memetakan data Python ke tabel PostgreSQL.
- **PostgreSQL** – Sistem basis data relasional open-source yang tangguh.

---
