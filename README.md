# Portal ISD - Shell Dashboard Component (Vue 3 SFC)

Repositori ini berisi komponen dashboard utama (`Dashboard.vue`) yang telah dimigrasikan dari format murni (HTML/CSS/JS) menjadi **Vue 3 Single-File Component (SFC)** dengan arsitektur **Micro-Frontend (Module Federation)** menggunakan **Vite**.

Komponen ini berfungsi sebagai *Shell Container* (kerangka utama) yang membungkus navigasi, widget jam flip-clock, widget kalender, efek latar belakang interaktif (Three.js), dan area utama (`<router-view>`) sebagai viewport untuk me-mount sub-aplikasi internal (`/i-mimo`, `/i-ticketing`, `/i-warehouse`, dsb.).

---

## ⚡ Fitur Utama & Perubahan Migrasi
1. **Pemisahan Vue SFC & Scoped Style**: Kerangka kode diisolasi menggunakan format standar `<template>`, `<script setup>` (Composition API), dan `<style scoped>`.
2. **Body Style Isolation**: Penataan untuk elemen global `body` diterapkan secara dinamis menggunakan hook `onMounted` dan dibersihkan pada `onUnmounted` agar tidak merusak gaya (style leak) dari mikro-aplikasi lainnya.
3. **Viewport Mikro-Aplikasi**: Menghilangkan tag `iframe` luar dan menggantinya dengan `<router-view>` lokal dengan efek transisi fade-in.
4. **Navigasi Internal**: Mengubah seluruh tag jangkar navigasi internal (`<a>`) menjadi `<router-link to="...">`.
5. **Reaktivitas Interaktif**: Tombol kontrol refresh, fullscreen, dan tombol navigasi kontrol segmen dimigrasikan dari Vanilla JS (inline onclick/event listeners) menjadi state reaktif Vue (`ref`, `computed`, `@click`).
6. **Background Efek 3D (Three.js)**: Logika rendering Three.js dibungkus ke dalam siklus hidup Vue, dipasangkan ke ref canvas container, dan ditambahkan rutin *garbage collection* (`renderer.dispose()`, pelepasan geometri & material) pada `onUnmounted` untuk mencegah **memory leak**.
7. **Viewport Full Kanan-Kiri & Responsif**: Mengubah kontainer `.iframe-container` menjadi selebar 100% tanpa sudut membulat (*border-radius*) agar sub-aplikasi yang dipasangkan dapat tampil secara responsif di semua perangkat.

---

## 🛠️ Panduan Instalasi & Penggunaan

### 1. Prasyarat
Pastikan environment Anda sudah terpasang:
- **Node.js** (versi 16 atau lebih tinggi direkomendasikan)
- Package manager seperti **npm**, **yarn**, atau **pnpm**

---

### 2. Pemasangan Dependensi
Komponen ini memerlukan **Three.js** untuk render 3D latar belakang dan **Vue Router** untuk mengelola viewport sub-app.

Jalankan perintah berikut di direktori proyek Anda:

```bash
# Menggunakan npm
npm install three vue-router

# Menggunakan yarn
yarn add three vue-router

# Menggunakan pnpm
pnpm add three vue-router
```

> [!NOTE]  
> Jika Anda menggunakan FontAwesome secara global, pastikan library FontAwesome 6 telah dipasang pada index proyek utama. Jika belum, komponen ini akan memuat file stylesheet FontAwesome secara otomatis melalui CDN dalam `onMounted`.

---

### 3. Konfigurasi Vue Router (`router/index.js` atau `router/index.ts`)
Agar viewport `<router-view>` di dalam `Dashboard.vue` dapat me-mount sub-aplikasi dengan benar, konfigurasikan router Anda seperti contoh berikut:

```javascript
import { createRouter, createWebHistory } from 'vue-router'
import DashboardShell from '../components/Dashboard.vue'

// Import halaman atau Micro-Frontend sub-app
const ITicketing = () => import('ticketApp/Module') // Contoh remote module
const IWarehouse = () => import('warehouseApp/Module')
const IMimo = () => import('mimoApp/Module')
const PortalISD = () => import('../views/PortalISD.vue')

const routes = [
  {
    path: '/',
    component: DashboardShell,
    children: [
      {
        path: '',
        redirect: 'i-ticketing'
      },
      {
        path: 'portal-isd',
        name: 'PortalISD',
        component: PortalISD
      },
      {
        path: 'i-ticketing',
        name: 'ITicketing',
        component: ITicketing
      },
      {
        path: 'i-warehouse',
        name: 'IWarehouse',
        component: IWarehouse
      },
      {
        path: 'i-mimo',
        name: 'IMimo',
        component: IMimo
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

---

### 4. Konfigurasi Module Federation (Vite)
Jika menggunakan `@originjs/vite-plugin-federation` pada bundler Vite Anda, Anda dapat mengekspos komponen ini sebagai komponen bersama atau mengonsumsi remote sub-app lainnya.

Contoh konfigurasi `vite.config.js` pada Host Application:

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'host-app',
      remotes: {
        ticketApp: 'http://localhost:5001/assets/remoteEntry.js',
        warehouseApp: 'http://localhost:5002/assets/remoteEntry.js',
        mimoApp: 'http://localhost:5003/assets/remoteEntry.js',
      },
      shared: ['vue', 'vue-router', 'three']
    })
  ],
  build: {
    target: 'esnext'
  }
})
```

---

## 💾 Integrasi Layanan i-Ticketing (Microservice + MongoDB)

Proyek ini menyertakan microservice backend di direktori `i-ticketing-service/` untuk mengelola data laporan tiket dan master data dropdown (Unit & Kategori) menggunakan database MongoDB.

### 1. Prasyarat Database
Pastikan Anda memiliki database server **MongoDB** yang sedang berjalan secara lokal pada port default (`27017`). Database yang digunakan akan bernama `i_ticketing`.

### 2. Cara Menjalankan Backend & Seeding Data
Buka terminal baru di folder `i-ticketing-service/` dan jalankan perintah berikut:

```bash
# 1. Masuk ke direktori microservice
cd i-ticketing-service

# 2. Pasang dependensi backend
npm install

# 3. Jalankan seeding untuk membuat master data dropdown (Unit & Kategori) di MongoDB
npm run seed

# 4. Jalankan server dalam mode development
npm run dev
```

Server backend akan berjalan di **`http://localhost:5000`** dan siap menerima submisi formulir serta menyajikan master data ke frontend Vue.

---

### 5. Penggunaan Komponen
Setelah konfigurasi router selesai, cukup pasang komponen ini pada root `App.vue` Anda atau letakkan di router utama Anda:

```vue
<!-- App.vue -->
<template>
  <router-view />
</template>

<script setup>
// Host layout diatur secara otomatis oleh router
</script>
```

---

## 🧹 Pemeliharaan & Garbage Collection
Komponen ini telah dirancang menggunakan standar performa industri:
- Seluruh animasi Three.js dibatalkan via `cancelAnimationFrame` saat komponen dilepas.
- Semua event listener global (`mousemove`, `resize`, `click`, `keypress`, `scroll`) otomatis dibersihkan pada event `onUnmounted` untuk menjaga stabilitas memori aplikasi mikro lainnya.
