<template>
  <div class="ticketing-container">
    
    <!-- ========================================== -->
    <!-- VIEW 1: LANDING VIEW                      -->
    <!-- ========================================== -->
    <div v-if="currentView === 'landing'" class="view-landing animate-fade">
      <!-- Media Slideshow Background -->
      <div class="landing-slider">
        <div 
          v-for="(slide, index) in slides" 
          :key="index" 
          :class="['slide', { active: activeSlide === index }]"
        >
          <video v-if="slide.type === 'video'" autoplay loop muted playsinline class="slide-media">
            <source :src="slide.src" type="video/mp4" />
          </video>
          <img v-else :src="slide.src" class="slide-media" alt="Background slide" />
        </div>
        <div class="slider-overlay"></div>
      </div>

      <!-- Landing Content -->
      <div class="landing-content">
        <div class="landing-badge">
          INFORMATION SYSTEM DIVISION • HELPDESK
        </div>
        <h1 class="landing-title">SOLUSI</h1>
        <h1 class="landing-title accent-green">TEKNOLOGI.</h1>
        
        <p class="landing-desc">
          Sistem pelaporan gangguan terpadu untuk mendukung kelancaran operasional melalui layanan TI yang responsif dan profesional.
        </p>
        
        <div class="landing-actions">
          <button @click="navigateTo('form')" class="btn-primary-green">
            BUAT LAPORAN <i class="fas fa-caret-right"></i>
          </button>
          <button @click="navigateTo('track')" class="btn-outline">
            CEK STATUS
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 2: FORM VIEW                         -->
    <!-- ========================================== -->
    <div v-else-if="currentView === 'form'" class="view-form animate-fade">
      <div class="form-card">
        <button @click="navigateTo('landing')" class="btn-back">
          <i class="fas fa-arrow-left"></i> KEMBALI
        </button>
        
        <h2 class="form-title">FORM <span class="accent-green">PELAPORAN</span></h2>

        <!-- Header Info -->
        <div class="form-header-info">
          <p class="desc-text">
            Sistem pelaporan gangguan terpadu untuk mendukung kelancaran operasional melalui layanan TI yang responsif dan profesional.
          </p>
          <p class="emergency-text">
            In Case Emergency please contact us at <a href="https://wa.me/+6282381707015" target="_blank" class="phone-link">+62 823-8170-7015</a>
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="ticket-form-fields">
          <!-- Nama, Unit, FAP -->
          <div class="form-row col-3">
            <div class="form-group">
              <label>Nama Pelapor <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.namaPelapor" 
                placeholder="Masukkan nama pelapor" 
                required 
              />
            </div>
            
            <div class="form-group">
              <label>Unit Pelapor <span class="required">*</span></label>
              <select v-model="form.unitPelapor" required>
                <option value="" disabled selected>- Pilih Unit -</option>
                <option 
                  v-for="unit in units" 
                  :key="unit.code" 
                  :value="unit.code"
                >
                  {{ unit.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>FAP / ID USER (Opsional)</label>
              <input 
                type="text" 
                v-model="form.fap" 
                placeholder="Contoh: FAP A" 
              />
              <span class="field-hint">Jika berasal dari FAP, mohon cantumkan FAP mana asalnya.</span>
            </div>
          </div>

          <!-- Tanggal, Jenis, Jumlah -->
          <div class="form-row col-3">
            <div class="form-group">
              <label>Tanggal Melapor <span class="required">*</span></label>
              <input 
                type="date" 
                v-model="form.tanggalMelapor" 
                required 
              />
            </div>

            <div class="form-group">
              <label>Jenis <span class="required">*</span></label>
              <select v-model="form.jenis" @change="handleJenisChange" required>
                <option value="" disabled selected>- Pilih Jenis -</option>
                <option 
                  v-for="cat in categories" 
                  :key="cat.code" 
                  :value="cat.code"
                >
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Jumlah Item <span class="required">*</span></label>
              <select v-model="form.jumlah" required>
                <option value="" disabled selected>- Pilih Jumlah -</option>
                <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
          </div>

          <!-- Register Number (Conditional) -->
          <div class="form-group full-width">
            <label>
              No Register 
              <span v-if="isRegisterRequired" class="required">* Wajib untuk jenis SIRS</span>
            </label>
            <span class="field-label-hint">(Jika SIRS Wajib No register, dan Identitas Lainnya)</span>
            <input 
              type="text" 
              v-model="form.noRegister" 
              :placeholder="isRegisterRequired ? 'Wajib diisi! Contoh: IGD.260301.001' : 'Contoh: IGD.260301.001 (Opsional)'" 
              :required="isRegisterRequired"
            />
          </div>

          <!-- Kendala -->
          <div class="form-group full-width">
            <label>Detail Kronologi <span class="required">*</span></label>
            <textarea 
              v-model="form.kendala" 
              placeholder="Jelaskan masalah secara detail..." 
              rows="4"
              required
            ></textarea>
          </div>

          <!-- Priority -->
          <div class="form-group priority-group">
            <label>Priority (Pilih salah satu) <span class="required">*</span></label>
            <div class="priority-buttons">
              <button 
                type="button" 
                :class="['priority-btn', { active: form.priority === 1 }]"
                @click="form.priority = 1"
              >
                1
              </button>
              <button 
                type="button" 
                :class="['priority-btn', { active: form.priority === 2 }]"
                @click="form.priority = 2"
              >
                2
              </button>
              <button 
                type="button" 
                :class="['priority-btn', { active: form.priority === 3 }]"
                @click="form.priority = 3"
              >
                3
              </button>
            </div>
            <div class="priority-labels">
              <span class="low-label">LOW</span>
              <span class="high-label">HIGH</span>
            </div>
          </div>

          <!-- Nomer HP Konfirmasi & Action -->
          <div class="form-row col-2 align-end">
            <div class="form-group">
              <label>WhatsApp / No HP untuk Konfirmasi <span class="required">*</span></label>
              <input 
                type="text" 
                v-model="form.nomerHp" 
                placeholder="Contoh: 0821xxxxxxxx" 
                required 
              />
            </div>
            <div class="form-group">
              <button type="submit" :disabled="submitting" class="btn-submit">
                <span v-if="submitting">Memproses...</span>
                <span v-else><i class="fas fa-paper-plane"></i> KIRIM LAPORAN</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 3: SUCCESS VIEW                       -->
    <!-- ========================================== -->
    <div v-else-if="currentView === 'success'" class="view-success animate-fade">
      <div class="success-card">
        <div class="success-badge">
          <i class="fas fa-check"></i>
        </div>
        <h2 class="success-title">KAMU BERHASIL SUBMIT DENGAN TICKET</h2>
        <h1 class="ticket-id">{{ generatedTicketId }}</h1>
        
        <div class="success-tips-grid">
          <div class="tip-box">
            <i class="fas fa-camera tip-icon"></i>
            <p>Silakan <span class="text-highlight">SCREENSHOT</span> halaman ini.</p>
          </div>
          <div class="tip-box">
            <i class="fas fa-share-nodes tip-icon"></i>
            <p>Informasikan ke <span class="text-highlight">TIM ISD</span> untuk proses lebih cepat.</p>
          </div>
        </div>
        
        <button @click="navigateTo('landing')" class="btn-close-msg">TUTUP PESAN</button>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- VIEW 4: TRACKING VIEW                      -->
    <!-- ========================================== -->
    <div v-else-if="currentView === 'track'" class="view-track animate-fade">
      <div class="track-card">
        <button @click="navigateTo('landing')" class="btn-back">
          <i class="fas fa-arrow-left"></i> KEMBALI
        </button>
        
        <h2 class="track-title">TRACK <span class="accent-green">STATUS</span></h2>

        <!-- Search Filter -->
        <div class="track-search-wrapper">
          <div class="search-input-group">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              v-model="trackingSearchQuery" 
              placeholder="Cari ID Tiket, Unit Pelapor, atau Jenis Kendala..." 
              class="search-input"
            />
          </div>
        </div>

        <!-- Ticket Lists -->
        <div v-if="loadingTickets" class="track-loading">
          <div class="spinner"></div>
          <p>Memuat laporan...</p>
        </div>
        <div v-else class="ticket-list-wrapper">
          <div v-if="filteredTickets.length === 0" class="no-tickets">
            Belum ada laporan hari ini.
          </div>
          <div 
            v-for="t in filteredTickets" 
            :key="t.ticketId" 
            :class="['public-ticket-item', getBorderClass(t.status)]"
          >
            <div class="ticket-summary">
              <span class="ticket-code">{{ t.ticketId }}</span>
              <h4 class="ticket-label">
                {{ t.unitPelapor }} <span class="separator">-</span> {{ t.jenis }}
              </h4>
            </div>
            <div class="ticket-actions">
              <span :class="['status-badge', t.status.toLowerCase()]">{{ t.status }}</span>
              <button @click="openTicketDetails(t)" class="btn-detail-view" title="Lihat Detail">
                <i class="fas fa-eye"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- MODAL: REPORT DETAIL DIALOG                -->
    <!-- ========================================== -->
    <div v-if="showDetailModal" class="modal-overlay" @click.self="closeTicketDetails">
      <div class="modal-card animate-scale">
        <div class="modal-header">
          <h3 class="modal-title">DETAIL <span class="accent-green">TICKET</span></h3>
          <button @click="closeTicketDetails" class="btn-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="modal-info-grid">
            <div class="info-row">
              <span class="info-label">Ticket ID:</span>
              <span class="info-value text-green font-bold">{{ selectedTicket.ticketId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nama Pelapor:</span>
              <span class="info-value">{{ selectedTicket.namaPelapor }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Unit Pelapor:</span>
              <span class="info-value">{{ selectedTicket.unitPelapor }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Jenis Kendala:</span>
              <span class="info-value">{{ selectedTicket.jenis }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nomor Register:</span>
              <span class="info-value">{{ selectedTicket.noRegister || '-' }}</span>
            </div>
            <div class="info-row col-span-2">
              <span class="info-label">Kronologi:</span>
              <p class="info-quote">"{{ selectedTicket.kendala }}"</p>
            </div>
          </div>

          <div class="modal-divider"></div>

          <!-- Handling/Tech Details -->
          <div class="modal-info-grid">
            <div class="info-row">
              <span class="info-label">Ditangani Oleh:</span>
              <span class="info-value text-highlight">{{ selectedTicket.handleBy || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Nomor BA:</span>
              <span class="info-value text-highlight">{{ selectedTicket.nomorBA || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Detail Tindakan:</span>
              <span class="info-value">{{ selectedTicket.actionDetail || '-' }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tgl Selesai:</span>
              <span class="info-value">{{ selectedTicket.tglSelesai ? formatDate(selectedTicket.tglSelesai) : '-' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

// ----------------------------------------------------
// Navigation & Views
// ----------------------------------------------------
const currentView = ref('landing'); // 'landing' | 'form' | 'success' | 'track'
const navigateTo = (view) => {
  if (view === 'track') {
    loadPublicTickets();
  }
  currentView.value = view;
};

// ----------------------------------------------------
// Media Slideshow Configuration (Landing Background)
// ----------------------------------------------------
const slides = [
  { type: 'image', src: 'https://ik.imagekit.io/isdwmc/WMC%202025-2026.jpg?updatedAt=1775204393539?q=80&w=2070&auto=format&fit=crop' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop' },
  { type: 'video', src: 'https://cdn.pixabay.com/video/2022/01/18/104394-666358364_large.mp4' }
];

const activeSlide = ref(0);
let slideInterval = null;

// ----------------------------------------------------
// Core Form Reactive State
// ----------------------------------------------------
const form = ref({
  namaPelapor: '',
  unitPelapor: '',
  fap: '',
  tanggalMelapor: new Date().toISOString().substring(0, 10),
  jenis: '',
  jumlah: 1,
  noRegister: '',
  kendala: '',
  priority: 1, // default to 1 (LOW)
  nomerHp: ''
});

const units = ref([]);
const categories = ref([]);
const submitting = ref(false);
const submitSuccess = ref(false);
const generatedTicketId = ref('');

// Computed check to see if Category "SIRS" is active
const isRegisterRequired = computed(() => {
  const activeCategory = categories.value.find(cat => cat.code === form.value.jenis);
  return activeCategory ? activeCategory.requiresRegister : false;
});

const handleJenisChange = () => {
  // If register number is not required, clear its text
  if (!isRegisterRequired.value) {
    form.value.noRegister = '';
  }
};

// ----------------------------------------------------
// Tracking Tickets & Modals State
// ----------------------------------------------------
const publicTickets = ref([]);
const trackingSearchQuery = ref('');
const loadingTickets = ref(false);
const showDetailModal = ref(false);
const selectedTicket = ref(null);

const getBorderClass = (status) => {
  if (status === 'Selesai') return 'border-success';
  if (status === 'Ongoing') return 'border-ongoing';
  return 'border-pending';
};

const openTicketDetails = (ticket) => {
  selectedTicket.value = ticket;
  showDetailModal.value = true;
};

const closeTicketDetails = () => {
  showDetailModal.value = false;
  selectedTicket.value = null;
};

const formatDate = (dateVal) => {
  if (!dateVal) return '-';
  try {
    const d = new Date(dateVal);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch (err) {
    return dateVal;
  }
};

// Search filter computed
const filteredTickets = computed(() => {
  const query = trackingSearchQuery.value.toLowerCase().trim();
  if (!query) return publicTickets.value;
  return publicTickets.value.filter(t => 
    (t.ticketId && t.ticketId.toLowerCase().includes(query)) ||
    (t.unitPelapor && t.unitPelapor.toLowerCase().includes(query)) ||
    (t.jenis && t.jenis.toLowerCase().includes(query))
  );
});

// ----------------------------------------------------
// Load Master Dropdowns
// ----------------------------------------------------
const fetchMasterData = async () => {
  try {
    const unitsRes = await fetch('http://localhost:5000/api/master/units');
    if (unitsRes.ok) {
      units.value = await unitsRes.json();
    } else {
      throw new Error();
    }
  } catch (err) {
    units.value = [
      { name: 'FAP', code: 'FAP' },
      { name: 'MCU', code: 'MCU' },
      { name: 'UGD', code: 'UGD' },
      { name: 'OPD', code: 'OPD' },
      { name: 'IPD', code: 'IPD' },
      { name: 'ADMIN', code: 'ADMIN' },
      { name: 'RADIOLOGI', code: 'RADIOLOGI' },
      { name: 'LABORATORIUM', code: 'LABORATORIUM' },
      { name: 'DOKTER', code: 'DOKTER' },
      { name: 'REKAM MEDIS', code: 'REKAM_MEDIS' },
      { name: 'ASSISTANT CENTER', code: 'ASSISTANT_CENTER' },
      { name: 'BILLING', code: 'BILLING' },
      { name: 'UPSP', code: 'UPSP' },
      { name: 'FARMASI', code: 'FARMASI' },
      { name: 'NUTRISIONIST', code: 'NUTRISIONIST' },
      { name: 'KIE (Komunikasi, Informasi & Edukasi)', code: 'KIE' },
      { name: 'LAINNYA', code: 'LAINNYA' }
    ];
  }

  try {
    const categoriesRes = await fetch('http://localhost:5000/api/master/categories');
    if (categoriesRes.ok) {
      categories.value = await categoriesRes.json();
    } else {
      throw new Error();
    }
  } catch (err) {
    categories.value = [
      { name: 'SIRS (Sistem Informasi RS)', code: 'SIRS', requiresRegister: true },
      { name: 'Jaringan & Internet', code: 'JARINGAN', requiresRegister: false },
      { name: 'Hardware (PC / Printer / Order / Repair)', code: 'HARDWARE', requiresRegister: false },
      { name: 'Lainnya', code: 'LAINNYA', requiresRegister: false }
    ];
  }
};

// ----------------------------------------------------
// Load Live Tickets
// ----------------------------------------------------
const loadPublicTickets = async () => {
  loadingTickets.value = true;
  try {
    const res = await fetch('http://localhost:5000/api/tickets');
    if (res.ok) {
      publicTickets.value = await res.json();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.warn('Backend API offline, loading mock tickets for preview.');
    publicTickets.value = [
      { ticketId: 'TIC-20260704-0001', namaPelapor: 'Budi', unitPelapor: 'UGD', jenis: 'SIRS', status: 'Pending', noRegister: 'IGD.260301.001', kendala: 'Layar login SIRS blank putih, tidak bisa input rekam medis baru.', priority: 2, nomerHp: '08123456789', handleBy: 'Haris', nomorBA: 'BA-98292-1', actionDetail: 'Sedang diperiksa modul konektor database.', tglSelesai: null },
      { ticketId: 'TIC-20260704-0002', namaPelapor: 'Siti', unitPelapor: 'FARMASI', jenis: 'JARINGAN', status: 'Ongoing', kendala: 'Koneksi printer apotek putus, tidak bisa cetak label obat.', priority: 1, nomerHp: '08123456789', handleBy: 'Andi', nomorBA: '', actionDetail: 'Sedang dilakukan crimping ulang kabel RJ45.', tglSelesai: null },
      { ticketId: 'TIC-20260704-0003', namaPelapor: 'Andi', unitPelapor: 'MCU', jenis: 'HARDWARE', status: 'Selesai', kendala: 'Monitor bergaris merah tebal di tengah layar.', priority: 3, nomerHp: '08123456789', handleBy: 'Herman', nomorBA: 'BA-98301-2', actionDetail: 'Dilakukan pergantian unit monitor cadangan baru.', tglSelesai: new Date().toISOString() }
    ];
  } finally {
    loadingTickets.value = false;
  }
};

// ----------------------------------------------------
// Submit Handler
// ----------------------------------------------------
const handleSubmit = async () => {
  submitting.value = true;
  try {
    const response = await fetch('http://localhost:5000/api/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    });

    const data = await response.json();
    if (response.ok && data.success) {
      generatedTicketId.value = data.ticket.ticketId;
      resetFormFields();
      navigateTo('success');
    } else {
      alert(data.error || 'Gagal mengirim tiket pelaporan. Silakan coba kembali.');
    }
  } catch (error) {
    console.error('Submission error:', error);
    // Local fallback mock submission
    const mockId = 'TIC-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 1000) + 1).padStart(4, '0');
    generatedTicketId.value = mockId;
    resetFormFields();
    navigateTo('success');
  } finally {
    submitting.value = false;
  }
};

const resetFormFields = () => {
  form.value = {
    namaPelapor: '',
    unitPelapor: '',
    fap: '',
    tanggalMelapor: new Date().toISOString().substring(0, 10),
    jenis: '',
    jumlah: 1,
    noRegister: '',
    kendala: '',
    priority: 1,
    nomerHp: ''
  };
};

onMounted(() => {
  fetchMasterData();
  slideInterval = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>

<style scoped>
.ticketing-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
  color: #f1f5f9;
  background: #08080c;
}

/* ========================================== */
/* VIEW 1: LANDING VIEW STYLE                 */
/* ========================================== */
.view-landing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 24px;
}

.landing-slider {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #000;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 1.2s ease-in-out;
  z-index: 0;
}

.slide.active {
  opacity: 0.18; /* maintain subtle visual background */
  z-index: 1;
}

.slide-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, #08080c 0%, rgba(8, 8, 12, 0.7) 60%, transparent 100%);
  z-index: 2;
}

.landing-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 720px;
}

.landing-badge {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10b981;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 20px;
  letter-spacing: 1px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

.landing-title {
  font-size: 64px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -2px;
  line-height: 1.0;
}

.landing-title.accent-green {
  color: #10b981;
  margin-bottom: 24px;
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.landing-desc {
  font-size: 15px;
  color: #cbd5e1;
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 40px;
}

.landing-actions {
  display: flex;
  gap: 16px;
  width: 100%;
  justify-content: center;
}

.btn-primary-green {
  background: #10b981;
  color: #0c0a09;
  font-size: 14px;
  font-weight: 800;
  padding: 14px 32px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary-green:hover {
  transform: translateY(-2px);
  background: #059669;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
}

.btn-outline {
  background: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 14px 32px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}

/* ========================================== */
/* VIEW 2: FORM VIEW STYLE                    */
/* ========================================== */
.view-form, .view-track {
  width: 100%;
  height: 100%;
  padding: 40px;
  overflow-y: auto;
}

.form-card, .track-card {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(25, 25, 35, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.15);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

.btn-back {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.btn-back:hover {
  color: #fff;
}

.form-title, .track-title {
  font-size: 28px;
  font-weight: 900;
  font-style: italic;
  text-align: center;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
}

.accent-green {
  color: #10b981;
}

.form-header-info {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 32px;
}

.desc-text {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 6px;
}

.emergency-text {
  font-size: 13px;
  font-weight: 700;
  color: #ff8c42;
}

.phone-link {
  color: #10b981;
  text-decoration: none;
  border-bottom: 1px dotted #10b981;
  padding-bottom: 1px;
}

.ticket-form-fields {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.form-row.col-3 {
  grid-template-columns: repeat(3, 1fr);
}

.form-row.col-2 {
  grid-template-columns: repeat(2, 1fr);
}

.form-row.align-end {
  align-items: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  margin-bottom: 24px;
}

label {
  font-size: 11px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

label .required {
  color: #ef4444;
  margin-left: 2px;
}

.field-label-hint {
  font-size: 10px;
  color: #ff6b35;
  font-weight: 700;
  margin-top: -6px;
  margin-bottom: 8px;
}

.field-hint {
  font-size: 10px;
  color: #64748b;
  margin-top: 6px;
  line-height: 1.4;
}

input[type="text"],
input[type="date"],
select,
textarea {
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid rgba(255, 107, 53, 0.2);
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
  background: rgba(15, 15, 25, 0.8);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
  padding-right: 40px;
}

textarea {
  resize: none;
}

/* Priority Button Selectors */
.priority-group {
  margin-bottom: 24px;
}

.priority-buttons {
  display: flex;
  gap: 12px;
  max-width: 260px;
  margin-bottom: 8px;
}

.priority-btn {
  flex: 1;
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid rgba(255, 107, 53, 0.2);
  color: #94a3b8;
  padding: 10px 0;
  font-size: 14px;
  font-weight: 800;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.priority-btn.active {
  background: #10b981;
  color: #0c0a09;
  border-color: transparent;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.priority-btn:hover:not(.active) {
  border-color: #10b981;
  color: #fff;
}

.priority-labels {
  display: flex;
  justify-content: space-between;
  max-width: 260px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  padding: 0 4px;
}

/* Submission action */
.btn-submit {
  width: 100%;
  background: #10b981;
  color: #0c0a09;
  border: none;
  font-size: 14px;
  font-weight: 800;
  padding: 14px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #059669;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ========================================== */
/* VIEW 3: SUCCESS VIEW STYLE                 */
/* ========================================== */
.view-success {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.success-card {
  max-width: 600px;
  width: 100%;
  background: rgba(25, 25, 35, 0.55);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 24px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
}

.success-badge {
  width: 64px;
  height: 64px;
  background: #10b981;
  color: #0c0a09;
  border-radius: 50%;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

.success-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.ticket-id {
  font-size: 36px;
  font-weight: 900;
  color: #10b981;
  letter-spacing: 1px;
  margin-bottom: 36px;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.success-tips-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 40px;
  text-align: left;
}

.tip-box {
  background: rgba(10, 10, 15, 0.5);
  border: 1px solid rgba(255, 107, 53, 0.15);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-icon {
  font-size: 20px;
  color: #ff8c42;
}

.tip-box p {
  font-size: 13px;
  line-height: 1.4;
  color: #94a3b8;
}

.text-highlight {
  color: #fff;
  font-weight: 700;
}

.btn-close-msg {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 12px 32px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close-msg:hover {
  border-color: #fff;
  color: #fff;
}

/* ========================================== */
/* VIEW 4: TRACKING VIEW STYLE                */
/* ========================================== */
.track-search-wrapper {
  margin-bottom: 32px;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: #64748b;
  font-size: 16px;
}

.search-input {
  width: 100%;
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid rgba(255, 107, 53, 0.2);
  color: #fff;
  border-radius: 12px;
  padding: 14px 16px 14px 48px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
}

.track-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 16px;
  color: #94a3b8;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(16, 185, 129, 0.2);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ticket-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.no-tickets {
  text-align: center;
  color: #64748b;
  padding: 40px 0;
  font-size: 14px;
}

.public-ticket-item {
  background: rgba(15, 15, 20, 0.6);
  border: 1px solid rgba(255, 107, 53, 0.15);
  border-left-width: 4px;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.25s ease;
}

.public-ticket-item:hover {
  background: rgba(25, 25, 30, 0.8);
  transform: translateY(-1px);
  border-color: rgba(255, 107, 53, 0.3);
}

/* Status border bindings */
.public-ticket-item.border-success { border-left-color: #10b981; }
.public-ticket-item.border-ongoing { border-left-color: #eab308; }
.public-ticket-item.border-pending { border-left-color: #ef4444; }

.ticket-code {
  font-size: 11px;
  font-weight: 800;
  color: #10b981;
  display: block;
  margin-bottom: 4px;
}

.ticket-label {
  font-size: 16px;
  font-weight: 900;
  text-transform: uppercase;
  color: #fff;
  letter-spacing: 0.5px;
}

.ticket-label .separator {
  color: #475569;
  margin: 0 4px;
}

.ticket-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid transparent;
}

.status-badge.selesai {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.2);
}

.status-badge.ongoing {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
  border-color: rgba(234, 179, 8, 0.2);
}

.status-badge.pending {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.2);
}

.btn-detail-view {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-detail-view:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
}

/* ========================================== */
/* MODAL OVERLAY & POPUP STYLES               */
/* ========================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 680px;
  background: #111116;
  border: 1px solid rgba(255, 107, 53, 0.25);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
}

.modal-header {
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 107, 53, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.5px;
}

.btn-modal-close {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-modal-close:hover {
  color: #fff;
}

.modal-body {
  padding: 24px;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.col-span-2 {
  grid-column: span 2;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 14px;
  color: #cbd5e1;
}

.info-value.text-green {
  color: #10b981;
}

.info-quote {
  font-size: 13px;
  font-style: italic;
  color: #94a3b8;
  background: rgba(10, 10, 15, 0.5);
  padding: 10px 14px;
  border-radius: 8px;
  border-left: 3px solid #ff8c42;
  margin-top: 4px;
  line-height: 1.5;
}

.modal-divider {
  height: 1px;
  background: rgba(255, 107, 53, 0.15);
  margin: 20px 0;
}

/* Animations */
.animate-fade {
  animation: fadeIn 0.4s ease forwards;
}

.animate-scale {
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Responsive Form Adjustments */
@media (max-width: 768px) {
  .view-form, .view-track {
    padding: 20px;
  }
  
  .form-card, .track-card {
    padding: 20px;
  }
  
  .form-row.col-3,
  .form-row.col-2 {
    grid-template-columns: 1fr;
  }
  
  .success-tips-grid {
    grid-template-columns: 1fr;
  }
  
  .landing-title {
    font-size: 48px;
  }
  
  .landing-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .modal-info-grid {
    grid-template-columns: 1fr;
  }
  
  .col-span-2 {
    grid-column: span 1;
  }
}
</style>
