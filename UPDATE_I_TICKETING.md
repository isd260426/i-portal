# Dokumentasi Pembaruan Layanan i-Ticketing (IT Service Request)

## 1. Ringkasan & Latar Belakang Masalah
Pada pembaruan ini, seluruh alur pelaporan, penyimpanan database MongoDB, dan pelacakan status tiket i-Ticketing telah diperbaiki dan ditingkatkan agar sesuai dengan referensi form [https://near.tl/sm/V7dg7PU9U](https://near.tl/sm/V7dg7PU9U).

### Masalah yang Ditemukan Sebelumnya:
1. **Error `Cannot GET /` pada log `journalctl -u i-ticketing -f`**:
   - Service Express belum memiliki route handler `GET /` dan `GET /health`, sehingga ketika diakses root URL atau dicek oleh healthcheck runner, server me-return `Cannot GET /`.
2. **Data Tiket Tidak Tersimpan ke Database MongoDB**:
   - `models/Ticket.js` memiliki validasi skema `jumlah: { type: Number, min: 1 }`. Ketika pengguna memilih nilai seperti `>10` atau `>20`, Mongoose melempar ValidationError tipe data dan menggagalkan eksekusi `save()`.
   - Field `nomerHp` sebelumnya berstatus `required: true` sehingga jika pengguna tidak mengisi nomor HP, operasi insert dibatalkan.
   - Hook pre-save Mongoose sebelumnya mencampurkan fungsi `async` dengan pemanggilan parameter `next()`.
3. **Hardcoded Host `localhost:5000`**:
   - Pemanggilan API frontend diakses melalui remote browser (`vmmicro` atau IP LAN), sehingga pemanggilan ke `localhost:5000` gagal menghubungi server backend.

---

## 2. Rincian Pembaruan

### A. Pembaruan Skema Database (`models/Ticket.js`)
File yang dimodifikasi:
- `d:\laragon\www\i-portal\i-ticketing-service\models\Ticket.js`
- `d:\laragon\www\i-ticketing\backend\models\Ticket.js`

**Perubahan Skema:**
```javascript
const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, unique: true },
  namaPelapor: { type: String, required: true, trim: true },
  unitPelapor: { type: String, required: true, trim: true },
  fap: { type: String, trim: true, default: '' },
  tanggalMelapor: { type: Date, required: true, default: Date.now },
  jenis: { type: String, required: true, trim: true },
  otherJenis: { type: String, trim: true, default: '' },
  jumlah: { type: String, required: true, default: '1' }, // Menerima "1", "2", ... ">10", ">20"
  noRegister: { type: String, trim: true, default: '' },
  kendala: { type: String, required: true, trim: true },
  priority: { type: Number, enum: [1, 2, 3], required: true, default: 1 },
  moreDetails: { type: String, trim: true, default: '' },
  nomerHp: { type: String, required: true, trim: true }, // Wajib diisi
  status: { type: String, enum: ['Pending', 'Ongoing', 'Selesai'], default: 'Pending' },
  handleBy: { type: String, default: '' },
  nomorBA: { type: String, default: '' },
  actionDetail: { type: String, default: '' },
  tglSelesai: { type: Date }
}, { timestamps: true });
```

---

### B. Pembaruan Backend API Server (`server.js`)
File yang dimodifikasi:
- `d:\laragon\www\i-portal\i-ticketing-service\server.js`
- `d:\laragon\www\i-ticketing\backend\server.js`

**Endpoint Baru & Perbaikan:**
1. `GET /`: Mengembalikan metadata layanan dan status API (`200 OK`).
2. `GET /health`: Mengembalikan status kesehatan koneksi database MongoDB.
3. `POST /api/tickets`: 
   - Validasi data input (`namaPelapor`, `unitPelapor`, `jenis`, `kendala`).
   - Validasi bersyarat: `noRegister` wajib diisi jika `jenis === 'SIRS'`.
   - Menyimpan seluruh field ke database MongoDB dan mengembalikan data tiket tersimpan beserta auto-generated `ticketId` (format `TIC-YYYYMMDD-XXXX`).
4. `GET /api/tickets`: Mengambil seluruh daftar tiket secara real-time dari MongoDB diurutkan berdasarkan tiket terbaru (`createdAt: -1`).
5. `GET /api/tickets/:id`: Mengambil detail tiket berdasarkan `ticketId` atau `_id`.
6. `PUT /api/tickets/:id`: Memperbarui status penanganan, petugas (`handleBy`), nomor BA, dan detail tindakan.

---

### C. Pembaruan Form Pelaporan Frontend (`Ticketing.vue`)
File yang dimodifikasi:
- `d:\laragon\www\i-portal\Ticketing.vue`
- `d:\laragon\www\i-ticketing\frontend\static\index.html`

**Penyesuaian Form sesuai Referensi:**
1. **Header Informasi**:
   - Judul: `IT SERVICE REQUEST`
   - Subjudul: `LOG SERAH TERIMA DAFTAR MASALAH`
   - Emergency Contact: `+62 823-8170-7015` (Link WhatsApp aktif ke `https://wa.me/6282381707015`).
2. **Field Input**:
   - `Nama Pelapor` (Teks, wajib diisi).
   - `Unit Pelapor` (Pilihan unit atau input manual, wajib diisi).
   - `Tanggal Melapor` (Tanggal, default hari ini, wajib diisi).
   - `Jenis` (Kartu pilihan: `SIRS`, `Printer (Order/Repair)`, `Komputer (Hardware Repair)`, `Jaringan (Network Issue)`, `Other`).
     - Jika memilih `Other`, muncul input teks untuk menentukan jenis kendala khusus.
   - `Jumlah` (Dropdown: `1` s/d `10`, `>10`, `>20`).
   - `No Register` (Wajib diisi jika Jenis Kendala adalah `SIRS`).
   - `Kendala` (Textarea, wajib diisi, label subtitle: *"Jelaskan Detail Hingga no register dan Rencana nya apa"*).
   - `Priority` (Linear Scale 1-3: `1 LOW`, `2`, `3 HIGH`).
   - `More details` (Textarea keterangan tambahan, opsional).
   - `WhatsApp / No HP` (Teks kontak konfirmasi, wajib diisi).
   - Tombol Submit: `Kirim`.

3. **Dynamic Host Resolution**:
   API endpoint diakses secara dinamis sesuai host browser pengguna:
   ```javascript
   const getApiBaseUrl = () => {
     if (typeof window === 'undefined') return 'http://localhost:5000';
     const hostname = window.location.hostname || 'localhost';
     if (hostname === 'localhost' || hostname === '127.0.0.1') {
       return 'http://localhost:5000';
     }
     return `http://${hostname}:5000`;
   };
   ```

4. **Live Track Status Integration**:
   - View `TRACK STATUS` mengambil data langsung dari `GET /api/tickets`.
   - Card tiket menampilkan border warna sesuai status (`.border-pending`, `.border-ongoing`, `.border-success`).
   - Tombol detail (`👁`) membuka modal dengan rincian lengkap (ID Tiket, Nama, Unit, Jenis, Jumlah, No Register, Priority, Kendala, More Details, Petugas, Nomor BA, dan Tindakan).

---

## 3. Instruksi Restart & Verifikasi pada Server (VM)

Jika menjalankan service di VM via systemd:
```bash
# 1. Restart service i-ticketing
sudo systemctl restart i-ticketing

# 2. Cek status dan log real-time
journalctl -u i-ticketing -f
```

Hasil log yang diharapkan:
```text
Connected to MongoDB database (i_ticketing)
i-Ticketing microservice running at: http://localhost:5000
```
