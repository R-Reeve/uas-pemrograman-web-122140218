# Aplikasi React Router

## Deskripsi

Ini adalah aplikasi web fullstack yang dibangun menggunakan **React** (dengan Vite) di sisi frontend dan **Python Pyramid** di sisi backend. Aplikasi ini menggunakan **React Router** untuk navigasi antar halaman serta dilengkapi dengan sistem autentikasi dan fitur manajemen topik. Untuk manajemen basis data, digunakan **SQLAlchemy** sebagai ORM dan **PostgreSQL** sebagai sistem basis data relasional.

## Struktur Aplikasi

### Frontend (React + Vite)

- **React** digunakan untuk membangun antarmuka pengguna (UI).
- **Vite** digunakan sebagai bundler yang ringan dan cepat untuk pengembangan aplikasi React.
- **React Router DOM** digunakan untuk menangani routing antar halaman.

### Backend (Python Pyramid + SQLAlchemy)

- **Python Pyramid** digunakan sebagai framework web backend yang ringan namun powerful.
- **SQLAlchemy** digunakan sebagai Object-Relational Mapper (ORM) untuk mempermudah interaksi dengan database.
- **PostgreSQL** digunakan sebagai sistem basis data relasional.

## Struktur Komponen

### Komponen Utama

- `App.jsx`  
  Komponen root yang mengatur routing utama dari aplikasi menggunakan `react-router-dom`.

### Halaman-halaman (Pages)

- `LoginPage`  
  Halaman untuk login pengguna.

- `RegisterPage`  
  Halaman untuk registrasi pengguna baru.

- `HomePage`  
  Halaman utama yang ditampilkan setelah pengguna berhasil login.

- `TopicListPage`  
  Halaman yang menampilkan daftar topik yang tersedia.

- `TopicAddPage`  
  Halaman untuk menambahkan topik baru.

- `TopicDetailPage`  
  Halaman yang menampilkan detail dari topik tertentu.

## Teknologi yang Digunakan

### Frontend

- **React** – Library JavaScript untuk membangun antarmuka pengguna.
- **React Router DOM** – Untuk navigasi halaman dalam aplikasi React.
- **JSX** – Sintaks khusus React yang memungkinkan penulisan HTML di dalam JavaScript.
- **Vite** – Build tool modern dan super cepat untuk proyek React.

### Backend

- **Python Pyramid** – Framework web Python yang fleksibel dan scalable.
- **SQLAlchemy** – ORM Python untuk memetakan objek Python ke tabel database.
- **PostgreSQL** – Sistem manajemen basis data relasional open-source yang kuat.
