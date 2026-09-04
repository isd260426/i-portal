# 🚀 Panduan Deployment Server & Tailscale Funnel (isd-platform.tail9c26ef.ts.net)

Dokumen ini menjelaskan alur pembaruan kode aplikasi ke server `vmmicro` serta konfigurasi tunnel publik **Tailscale Funnel** dan tunnel database privat MongoDB.

---

## 🌐 Alamat & Endpoint Utama

| Layanan | Domain / URL / Connection String | Aksesibilitas | Keterangan |
| :--- | :--- | :--- | :--- |
| **Aplikasi Web (i-Portal & Ticketing)** | **`https://isd-platform.tail9c26ef.ts.net`** | **Publik (Semua HP/Browser)** | Port 443 HTTPS terenkripsi otomatis SSL Let's Encrypt |
| **API Healthcheck** | **`https://isd-platform.tail9c26ef.ts.net/health`** | **Publik** | Memeriksa status koneksi MongoDB & backend |
| **API REST Endpoints** | **`https://isd-platform.tail9c26ef.ts.net/api/*`** | **Publik** | Proxy aman ke backend Express `:5000` |
| **Database MongoDB** | **`mongodb://isd-platform.tail9c26ef.ts.net:27017/i_ticketing`** | **Privat (Admin Tailnet)** | Akses via MongoDB Compass tanpa bocor ke publik |

---

## ⚡ Cara Menjalankan Deployment di Server (Otomatis)

Di server `vmmicro`, masuk ke folder project dan jalankan script otomatis:

```bash
cd /path/ke/i-portal
sudo bash deploy-tailscale-tunnel.sh
```

Skrip ini akan secara otomatis:
1. Menarik commit terbaru dari GitHub (`git pull origin main`).
2. Memperbarui dependensi `i-ticketing-service` via `npm install`.
3. Merestart service backend `i-ticketing` via systemd.
4. Menyetel hostname Tailscale menjadi `isd-platform` (menghasilkan DNS `isd-platform.tail9c26ef.ts.net`).
5. Mengonfigurasi unified reverse proxy pada port 443 HTTPS.
6. Mengaktifkan **Tailscale Funnel** agar dapat diakses dari browser HP apapun di internet.
7. Membuka **Private TCP Tunnel** untuk MongoDB port 27017 agar tim Admin dapat terhubung dari jauh via MongoDB Compass.

---

## 🛠️ Langkah Manual (Jika Ingin Dijalankan Bertahap)

### 1. Update Project dari GitHub
```bash
cd /path/ke/i-portal
git pull origin main
cd i-ticketing-service && npm install
sudo systemctl restart i-ticketing
sudo systemctl status i-ticketing
```

### 2. Ubah Hostname Node Tailscale
```bash
sudo tailscale set --hostname=isd-platform
```
*(Atau `sudo tailscale up --hostname=isd-platform --accept-routes --ssh`)*

### 3. Konfigurasi Reverse Proxy (Tailscale Serve)
```bash
# Reset serve lama
sudo tailscale serve reset

# Forwarding Root (/) ke Frontend (Port 5173 atau Port 80 Nginx)
sudo tailscale serve --bg --https=443 http://127.0.0.1:5173

# Forwarding API (/api) ke Backend Express (Port 5000)
sudo tailscale serve --bg --https=443 /api http://127.0.0.1:5000/api

# Forwarding Health (/health) ke Backend Express (Port 5000)
sudo tailscale serve --bg --https=443 /health http://127.0.0.1:5000/health
```

### 4. Aktifkan Funnel Publik & Tunnel Database
```bash
# Aktifkan Funnel publik untuk web (Port 443)
sudo tailscale funnel 443 on

# Aktifkan Private TCP Tunnel untuk database MongoDB (Port 27017)
sudo tailscale serve --bg --tcp=27017 tcp://127.0.0.1:27017
```

### 5. Cek Status Tunnel
```bash
tailscale funnel status
tailscale serve status
```

---

## 🔍 Pengujian & Validasi

1. **Buka dari Browser HP**:
   Kunjungi `https://isd-platform.tail9c26ef.ts.net`. Halaman akan langsung memuat modul tiket fullscreen dengan tombol kembali ke dashboard.
2. **Uji Buat Tiket**:
   Isi nama, unit, WhatsApp, kendala, dan kirim tiket. Pastikan ID tiket keluar dan dapat dicari di menu *Track Status*.
3. **Koneksi MongoDB Compass**:
   Dari laptop admin yang terhubung Tailscale, masukkan connection string:
   `mongodb://isd-platform.tail9c26ef.ts.net:27017/i_ticketing`.
