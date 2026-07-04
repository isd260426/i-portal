<template>
  <div class="ticketing-container">
    
    <!-- ========================================== -->
    <!-- PUBLIC HEADER NAVBAR                       -->
    <!-- ========================================== -->
    <nav v-if="currentView !== 'admin'" id="publicNavbar" class="public-navbar">
      <div class="navbar-logo" @click="handleLogoClick">
        <div class="logo-icon">
          <i class="ph-fill ph-cpu"></i>
        </div>
        <span class="logo-text">ISD-SYSTEM</span>
      </div>
      <div id="previewBadge" class="preview-badge">
        MODE
      </div>
    </nav>

    <!-- ========================================== -->
    <!-- MAIN SCROLL VIEW WRAPPER                   -->
    <!-- ========================================== -->
    <main class="ticketing-main">
      
      <!-- VIEW 1: LANDING VIEW (Home) -->
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
              BUAT LAPORAN <i class="ph-bold ph-caret-right"></i>
            </button>
            <button @click="navigateTo('track')" class="btn-outline">
              CEK STATUS
            </button>
          </div>
        </div>
      </div>

      <!-- VIEW 2: FORM VIEW (Ticketing Submission Form - Restored Fields) -->
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

      <!-- VIEW 3: SUCCESS VIEW -->
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

      <!-- VIEW 4: TRACKING VIEW -->
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

      <!-- VIEW 5: LOGIN VIEW -->
      <div v-else-if="currentView === 'login'" class="view-login animate-fade">
        <div class="login-card">
          <div class="login-header">
            <div class="lock-icon">
              <i class="ph-fill ph-lock-key"></i>
            </div>
            <h2 class="login-title">SYSTEM <span class="accent-green">LOGIN</span></h2>
            <p class="login-subtitle">Khusus Tim Internal ISD</p>
            <div class="login-hint">
              <strong>Kredensial Login:</strong><br>
              Senior: admin / Demo2026!<br>
              Staff: staff / Demo2026!
            </div>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <div class="login-group">
              <label>USERNAME</label>
              <input type="text" v-model="loginForm.username" required />
            </div>
            <div class="login-group">
              <label>PASSWORD</label>
              <input type="password" v-model="loginForm.password" required />
            </div>
            <button type="submit" :disabled="loggingIn" class="btn-login">
              <span v-if="loggingIn">Mencocokkan...</span>
              <span v-else>MASUK SISTEM</span>
            </button>
            <button type="button" @click="navigateTo('landing')" class="btn-cancel">Batal</button>
          </form>
        </div>
      </div>

      <!-- VIEW 6: SYSTEM LAYOUT (ADMIN VIEWPORT) -->
      <div v-else-if="currentView === 'admin'" class="system-layout animate-fade">
        <!-- Top Navbar -->
        <nav class="system-navbar">
          <div class="system-brand">
            <div class="logo-icon-small">
              <i class="ph-fill ph-cpu"></i>
            </div>
            <span class="logo-text-small">ISDSYSTEM</span>
          </div>
          
          <div class="system-user">
            <div class="user-badge">
              <div class="user-info">
                <p class="user-role">{{ currentUser.role }}</p>
                <p class="user-name">{{ currentUser.nama }}</p>
              </div>
              <i class="ph ph-user-circle text-2xl"></i>
            </div>
            <button @click="handleLogout" class="btn-logout" title="Logout">
              <i class="ph-bold ph-sign-out text-xl"></i>
            </button>
          </div>
        </nav>

        <div class="system-body">
          <div class="system-header-row">
            <h2 class="system-title" v-html="adminSubView === 'dashboard' ? 'DASHBOARD <span class=accent-green>MONITORING</span>' : 'DATA <span class=accent-green>MANAGEMENT</span>'"></h2>
            <button @click="toggleAdminSubView" class="btn-toggle-view">
              {{ adminSubView === 'dashboard' ? 'DATA MANAGEMENT' : 'KEMBALI KE DASHBOARD' }}
            </button>
          </div>

          <!-- ADMIN SUBVIEW 1: DASHBOARD MONITORING -->
          <div v-if="adminSubView === 'dashboard'" class="subview-dashboard space-y-6">
            <!-- 4 Stats Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="stat-card">
                <i class="ph ph-stack stat-background-icon"></i>
                <h3 class="stat-value">{{ dashboardStats.today }}</h3>
                <p class="stat-label">Ticket Hari Ini</p>
              </div>
              <div class="stat-card">
                <i class="ph ph-clock stat-background-icon text-yellow"></i>
                <h3 class="stat-value text-yellow">{{ dashboardStats.ongoing }}</h3>
                <p class="stat-label">Ongoing</p>
              </div>
              <div class="stat-card">
                <i class="ph ph-check-circle stat-background-icon text-green"></i>
                <h3 class="stat-value text-green">{{ dashboardStats.done }}</h3>
                <p class="stat-label">Selesai</p>
              </div>
              <div class="stat-card">
                <i class="ph ph-warning-circle stat-background-icon text-red"></i>
                <h3 class="stat-value text-red">{{ dashboardStats.pending }}</h3>
                <p class="stat-label">Belum Selesai</p>
              </div>
            </div>

            <!-- Dashboard Split Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Categories Chart Card -->
              <div class="admin-data-card">
                <h4 class="card-title-header"><i class="ph ph-pie-chart"></i> Kategori Ticket</h4>
                <div class="chart-container">
                  <canvas id="chartKategori"></canvas>
                </div>
              </div>

              <!-- Top Units Ranking Card -->
              <div class="admin-data-card">
                <h4 class="card-title-header"><i class="ph ph-trophy"></i> Top Unit (Ranking)</h4>
                <div class="ranking-list">
                  <div 
                    v-for="(unit, idx) in dashboardStats.topUnits" 
                    :key="unit.name"
                    class="ranking-item"
                  >
                    <div class="ranking-meta">
                      <span class="ranking-label">
                        <div class="ranking-badge-number">{{ idx + 1 }}</div>
                        {{ unit.name }}
                      </span>
                      <span class="ranking-value">{{ unit.count }}</span>
                    </div>
                    <div class="ranking-progress-track">
                      <div class="ranking-progress-bar" :style="{ width: getProgressWidth(unit.count) + '%' }"></div>
                    </div>
                  </div>
                  <p v-if="dashboardStats.topUnits.length === 0" class="empty-list-text">Data kosong</p>
                </div>
              </div>

              <!-- Terakhir Masuk Card -->
              <div class="admin-data-card">
                <h4 class="card-title-header"><i class="ph ph-fire"></i> Terakhir Masuk</h4>
                <div class="recent-issues-list">
                  <div 
                    v-for="t in dashboardStats.recentIssues" 
                    :key="t.ticketId"
                    class="recent-issue-item"
                  >
                    <p class="issue-text">"{{ t.kendala }}"</p>
                    <span class="issue-unit-badge">{{ t.unitPelapor }}</span>
                  </div>
                  <p v-if="dashboardStats.recentIssues.length === 0" class="empty-list-text">Belum ada isyu terbaru</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ADMIN SUBVIEW 2: DATA MANAGEMENT -->
          <div v-else-if="adminSubView === 'manage'" class="subview-manage flex flex-col gap-4">
            <!-- Filter Bar -->
            <div class="filter-panel-card">
              <div class="filters-left">
                <div class="search-field-relative">
                  <i class="ph ph-magnifying-glass search-field-icon"></i>
                  <input 
                    type="text" 
                    v-model="adminSearchQuery" 
                    placeholder="Cari ID, Pelapor, NoReg, BA..." 
                    class="admin-search-input"
                  />
                </div>
                <select v-model="adminStatusFilter" class="admin-select-filter">
                  <option value="ALL">Semua Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <button @click="exportData" class="btn-export-csv">
                <i class="ph ph-download-simple"></i> EXPORT DATA
              </button>
            </div>

            <!-- Tickets Table -->
            <div class="table-container-card">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>TICKET ID</th>
                    <th>PELAPOR</th>
                    <th>KENDALA</th>
                    <th>TINDAKAN / HANDLED BY</th>
                    <th class="text-center">STATUS</th>
                    <th class="text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="filteredAdminTickets.length === 0">
                    <td colspan="6" class="text-center text-slate-500 py-6">Tidak ada data ditemukan</td>
                  </tr>
                  <tr 
                    v-for="t in filteredAdminTickets" 
                    :key="t.ticketId"
                    class="table-row-hover"
                  >
                    <td><p class="ticket-id-badge">{{ t.ticketId }}</p></td>
                    <td>
                      <p class="row-pelapor-name">{{ t.namaPelapor }}</p>
                      <p class="row-pelapor-unit">{{ t.unitPelapor }}</p>
                    </td>
                    <td class="row-jenis-cell">{{ t.jenis }}</td>
                    <td>
                      <p class="row-ba-number">{{ t.nomorBA || '-' }}</p>
                      <p class="row-staff-handled">{{ t.handleBy || '-' }}</p>
                    </td>
                    <td class="text-center">
                      <span :class="['status-badge', t.status.toLowerCase()]">{{ t.status }}</span>
                    </td>
                    <td class="text-center">
                      <div class="row-actions-group">
                        <button @click="openTicketDetails(t)" class="row-action-btn view-btn" title="View"><i class="ph-bold ph-eye"></i></button>
                        <button @click="openEditModal(t)" class="row-action-btn edit-btn" title="Edit" :disabled="t.status === 'Selesai'"><i class="ph-bold ph-pencil-simple"></i></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- PUBLIC FOOTER -->
    <footer v-if="currentView !== 'admin'" class="public-footer">
      <p>&copy; 2026 Wedabay Medical Center - Information System Division. All Rights Reserved.</p>
    </footer>

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
          </div>
          <div class="border-quote-row">
            <p class="info-label">Kronologi Kejadian</p>
            <p class="info-quote">"{{ selectedTicket.kendala }}"</p>
          </div>
          <div class="modal-divider"></div>
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

    <!-- ========================================== -->
    <!-- MODAL: EDIT/UPDATE DIALOG (ADMIN MODE)    -->
    <!-- ========================================== -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
      <div class="modal-card update-modal animate-scale">
        <div class="modal-header">
          <h3 class="modal-title">UPDATE <span class="accent-green">TICKET STATUS</span></h3>
          <button @click="closeEditModal" class="btn-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="handleUpdateSubmit" class="p-6 space-y-4">
          <div class="form-row col-2">
            <div class="form-group">
              <label>DI TANGANI OLEH</label>
              <input type="text" v-model="editForm.handleBy" required />
            </div>
            <div class="form-group">
              <label>STATUS SEKARANG</label>
              <select v-model="editForm.status" required>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div class="form-row col-2">
            <div class="form-group">
              <label>PERIHAL PERBAIKAN</label>
              <select v-model="editForm.perihalFix" class="appearance-none-custom">
                <option value="" disabled selected>Pilih Solusi</option>
                <option value="Open Pasien FAP">Open Pasien FAP</option>
                <option value="Open Pasien OPD">Open Pasien OPD</option>
                <option value="Open Pasien MCU">Open Pasien MCU</option>
                <option value="Open Pasien UGD">Open Pasien UGD</option>
                <option value="Open Pasien Admin">Open Pasien Admin</option>
                <option value="Open Pasien IPD">Open Pasien IPD</option>
                <option value="Open Pasien BILLING">Open Pasien BILLING</option>
                <option value="ERROR SYSTEM SIRS">ERROR SYSTEM SIRS</option>
                <option value="Error Inputan Obat">Error Inputan Obat</option>
                <option value="Penambahan Pemeriksaan">Penambahan Pemeriksaan</option>
                <option value="Human Error">Human Error</option>
                <option value="Pengecekan data">Pengecekan data</option>
                <option value="Perubahan Roles">Perubahan Roles</option>
                <option value="Pendaftaran akun">Pendaftaran akun </option>
                <option value="Verifikasi Fit Unfit">Verifikasi Fit Unfit </option>
                <option value="Development Digitalisasi">Development Digitalisasi</option>
                <option value="Batal Pasien">Batal Pasien</option>
                <option value="Retur Obat">Retur Obat</option>
                <option value="Induction Staff">Induction Staff</option>
                <option value="Close Open Site"> Close Open Site</option>
                <option value="Error Inputan LAB"> Error Inputan LAB</option>
                <option value="Troubleshoot Hardware"> Troubleshoot Hardware</option> 
                <option value="Serah Terima"> Serah Terima</option>
                <option value="Order Tinta"> Order Tinta</option>
                <option value="Peminjaman Barang"> Peminjaman Barang</option>
                <option value="Permintaan Barang"> Permintaan Barang</option>
                <option value="Deep Cleaning"> Deep Cleaning</option>
              </select>
            </div>
            <div class="form-group">
              <label>NOMOR BA (Opsional)</label>
              <input type="text" v-model="editForm.nomorBA" />
            </div>
          </div>

          <div class="form-group full-width">
            <label>ACTION MORE DETAILS ISD</label>
            <textarea v-model="editForm.actionDetail" rows="3"></textarea>
          </div>

          <button type="submit" class="btn-update-submit">
            UPDATE & SIMPAN
          </button>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';

// ----------------------------------------------------
// Navigation & Secret Easter Egg Views
// ----------------------------------------------------
const currentView = ref('landing'); // 'landing' | 'form' | 'success' | 'track' | 'login' | 'admin'
const adminSubView = ref('dashboard'); // 'dashboard' | 'manage'

const navigateTo = (view) => {
  if (view === 'track') {
    loadPublicTickets();
  }
  if (view === 'admin') {
    loadAdminTickets();
  }
  currentView.value = view;
};

// Logo Secret Login Easter Egg Trigger
const logoClicks = ref(0);
let clickTimer = null;
const handleLogoClick = () => {
  if (currentUser.value) {
    navigateTo('admin');
    return;
  }
  logoClicks.value++;
  clearTimeout(clickTimer);
  if (logoClicks.value >= 5) {
    logoClicks.value = 0;
    navigateTo('login');
  } else {
    clickTimer = setTimeout(() => { logoClicks.value = 0; }, 1000);
  }
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
// Core Form Reactive State (Public Fields)
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
  priority: 1, 
  nomerHp: ''
});

const units = ref([]);
const categories = ref([]);
const submitting = ref(false);
const generatedTicketId = ref('');

// Computed check to see if Category "SIRS" is active
const isRegisterRequired = computed(() => {
  const activeCategory = categories.value.find(cat => cat.code === form.value.jenis);
  return activeCategory ? activeCategory.requiresRegister : false;
});

const handleJenisChange = () => {
  if (!isRegisterRequired.value) {
    form.value.noRegister = '';
  }
};

// ----------------------------------------------------
// Public Tracking & Modal States
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
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  } catch (err) {
    return dateVal;
  }
};

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
// Authentication Form & Local Session Management
// ----------------------------------------------------
const loginForm = ref({ username: '', password: '' });
const loggingIn = ref(false);
const currentUser = ref(null);

const checkLoginState = () => {
  let userStr = null;
  try {
    userStr = localStorage.getItem('isd_user');
  } catch (e) {}
  if (userStr) {
    currentUser.value = JSON.parse(userStr);
    navigateTo('admin');
  } else {
    currentUser.value = null;
  }
};

const handleLogin = () => {
  loggingIn.value = true;
  // Local mock authentication matching isd.html specs
  setTimeout(() => {
    loggingIn.value = false;
    const users = [
      { id: 'U1', username: 'admin', password: 'Demo2026!', nama: 'Admin ISD', role: 'Senior' },
      { id: 'U2', username: 'staff', password: 'Demo2026!', nama: 'Staff 1', role: 'Staff' }
    ];
    const user = users.find(u => u.username === loginForm.value.username && u.password === loginForm.value.password);
    if (user) {
      localStorage.setItem('isd_user', JSON.stringify(user));
      currentUser.value = user;
      loginForm.value = { username: '', password: '' };
      navigateTo('admin');
      
      Swal.fire({
        title: 'Login Berhasil',
        text: `Selamat datang, ${user.nama}!`,
        icon: 'success',
        confirmButtonColor: '#10b981'
      });
    } else {
      Swal.fire('Error', 'Username atau Password salah!', 'error');
    }
  }, 600);
};

const handleLogout = () => {
  Swal.fire({
    title: 'Logout?',
    text: "Anda akan keluar dari panel monitoring.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Ya, Logout'
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('isd_user');
      currentUser.value = null;
      navigateTo('landing');
    }
  });
};

// ----------------------------------------------------
// Admin View States & Search Filters
// ----------------------------------------------------
const adminTickets = ref([]);
const adminSearchQuery = ref('');
const adminStatusFilter = ref('ALL');
const showEditModal = ref(false);
const editForm = ref({
  ticketId: '',
  handleBy: '',
  status: 'Pending',
  perihalFix: '',
  nomorBA: '',
  actionDetail: ''
});

const toggleAdminSubView = () => {
  adminSubView.value = adminSubView.value === 'dashboard' ? 'manage' : 'dashboard';
  if (adminSubView.value === 'dashboard') {
    nextTick(() => {
      initKategoriChart();
    });
  }
};

const openEditModal = (ticket) => {
  editForm.value = {
    ticketId: ticket.ticketId,
    handleBy: ticket.handleBy !== '-' && ticket.handleBy ? ticket.handleBy : currentUser.value.nama,
    status: ticket.status,
    perihalFix: ticket.perihalFix !== '-' && ticket.perihalFix ? ticket.perihalFix : '',
    nomorBA: ticket.nomorBA !== '-' && ticket.nomorBA ? ticket.nomorBA : '',
    actionDetail: ticket.actionDetail !== '-' && ticket.actionDetail ? ticket.actionDetail : ''
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

// Computed Filtered Tickets in Admin List
const filteredAdminTickets = computed(() => {
  const search = adminSearchQuery.value.toLowerCase().trim();
  const status = adminStatusFilter.value;
  return adminTickets.value.filter(t => {
    const matchSearch = !search || 
      (t.ticketId && t.ticketId.toLowerCase().includes(search)) || 
      (t.namaPelapor && t.namaPelapor.toLowerCase().includes(search)) || 
      (t.noRegister && t.noRegister.toLowerCase().includes(search)) || 
      (t.nomorBA && t.nomorBA.toLowerCase().includes(search)) || 
      (t.handleBy && t.handleBy.toLowerCase().includes(search));
    const matchStatus = status === 'ALL' || t.status === status;
    return matchSearch && matchStatus;
  });
});

// Calculate Dashboard stats dynamically from loaded adminTickets list
const dashboardStats = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  let todayCount = 0;
  let ongoing = 0;
  let done = 0;
  let pending = 0;

  const unitMap = {};
  
  adminTickets.value.forEach(t => {
    // Check if created today
    const tgl = t.createdAt || t.tanggalMelapor;
    if (tgl && tgl.startsWith(today)) {
      todayCount++;
    }
    
    if (t.status === 'Ongoing') ongoing++;
    else if (t.status === 'Selesai') done++;
    else if (t.status === 'Pending') pending++;

    // Unit frequency mapping
    const unit = (t.unitPelapor || 'LAINNYA').toUpperCase();
    unitMap[unit] = (unitMap[unit] || 0) + 1;
  });

  const topUnits = Object.keys(unitMap)
    .map(name => ({ name, count: unitMap[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentIssues = adminTickets.value.slice(0, 10);

  return {
    today: todayCount,
    ongoing,
    done,
    pending,
    topUnits,
    recentIssues
  };
});

const getProgressWidth = (count) => {
  const max = dashboardStats.value.topUnits.length > 0 ? dashboardStats.value.topUnits[0].count : 1;
  return (count / max) * 100;
};

// ----------------------------------------------------
// Chart.js Category Initializer
// ----------------------------------------------------
let categoryChart = null;
const initKategoriChart = () => {
  const canvas = document.getElementById('chartKategori');
  if (!canvas) return;

  // Destroy previous chart
  if (categoryChart) {
    categoryChart.destroy();
  }

  // Calculate categorisations
  let sirs = 0, jaringan = 0, hardware = 0, lainnya = 0;
  adminTickets.value.forEach(t => {
    if (t.jenis === 'SIRS') sirs++;
    else if (t.jenis === 'JARINGAN') jaringan++;
    else if (t.jenis === 'HARDWARE') hardware++;
    else lainnya++;
  });

  categoryChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: ['SIRS', 'JARINGAN', 'HARDWARE', 'LAINNYA'],
      datasets: [{
        data: [sirs, jaringan, hardware, lainnya],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#64748b'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: { 
          position: 'bottom', 
          labels: { 
            color: '#cbd5e1', 
            font: { size: 10 } 
          } 
        }
      }
    }
  });
};

// ----------------------------------------------------
// API REST Integration Handlers (Vite Node Proxy)
// ----------------------------------------------------

const fetchMasterData = async () => {
  // Try fetching Master Units list from API
  try {
    const unitsRes = await fetch('http://localhost:5000/api/master/units');
    if (unitsRes.ok) {
      units.value = await unitsRes.json();
    } else {
      throw new Error();
    }
  } catch (err) {
    units.value = [
      { name: 'FAP', code: 'FAP' }, { name: 'MCU', code: 'MCU' }, { name: 'UGD', code: 'UGD' },
      { name: 'OPD', code: 'OPD' }, { name: 'IPD', code: 'IPD' }, { name: 'ADMIN', code: 'ADMIN' },
      { name: 'RADIOLOGI', code: 'RADIOLOGI' }, { name: 'LABORATORIUM', code: 'LABORATORIUM' },
      { name: 'DOKTER', code: 'DOKTER' }, { name: 'REKAM MEDIS', code: 'REKAM_MEDIS' },
      { name: 'ASSISTANT CENTER', code: 'ASSISTANT_CENTER' }, { name: 'BILLING', code: 'BILLING' },
      { name: 'UPSP', code: 'UPSP' }, { name: 'FARMASI', code: 'FARMASI' },
      { name: 'NUTRISIONIST', code: 'NUTRISIONIST' }, { name: 'KIE (Komunikasi, Informasi & Edukasi)', code: 'KIE' },
      { name: 'LAINNYA', code: 'LAINNYA' }
    ];
  }

  // Try fetching Master Categories list from API
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

const loadAdminTickets = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/tickets');
    if (res.ok) {
      adminTickets.value = await res.json();
    } else {
      throw new Error();
    }
  } catch (err) {
    adminTickets.value = [
      { ticketId: 'TIC-20260704-0001', namaPelapor: 'Budi', unitPelapor: 'UGD', jenis: 'SIRS', status: 'Pending', noRegister: 'IGD.260301.001', kendala: 'Layar login SIRS blank putih, tidak bisa input rekam medis baru.', priority: 2, nomerHp: '08123456789', handleBy: 'Haris', nomorBA: 'BA-98292-1', actionDetail: 'Sedang diperiksa modul konektor database.', tglSelesai: null, createdAt: new Date().toISOString() },
      { ticketId: 'TIC-20260704-0002', namaPelapor: 'Siti', unitPelapor: 'FARMASI', jenis: 'JARINGAN', status: 'Ongoing', kendala: 'Koneksi printer apotek putus, tidak bisa cetak label obat.', priority: 1, nomerHp: '08123456789', handleBy: 'Andi', nomorBA: '', actionDetail: 'Sedang dilakukan crimping ulang kabel RJ45.', tglSelesai: null, createdAt: new Date().toISOString() },
      { ticketId: 'TIC-20260704-0003', namaPelapor: 'Andi', unitPelapor: 'MCU', jenis: 'HARDWARE', status: 'Selesai', kendala: 'Monitor bergaris merah tebal di tengah layar.', priority: 3, nomerHp: '08123456789', handleBy: 'Herman', nomorBA: 'BA-98301-2', actionDetail: 'Dilakukan pergantian unit monitor cadangan baru.', tglSelesai: new Date().toISOString(), createdAt: new Date().toISOString() }
    ];
  } finally {
    nextTick(() => {
      initKategoriChart();
    });
  }
};

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
    const mockId = 'TIC-' + new Date().toISOString().substring(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 1000) + 1).padStart(4, '0');
    generatedTicketId.value = mockId;
    resetFormFields();
    navigateTo('success');
  } finally {
    submitting.value = false;
  }
};

const handleUpdateSubmit = async () => {
  if (editForm.value.status === 'Selesai') {
    Swal.fire({
      title: 'Tutup Ticket?',
      text: "Ticket yang Selesai tidak bisa diubah lagi.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#475569',
      confirmButtonText: 'Ya, Selesaikan!'
    }).then((result) => {
      if (result.isConfirmed) executeUpdateCall();
    });
  } else {
    executeUpdateCall();
  }
};

const executeUpdateCall = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/tickets/${editForm.value.ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        handleBy: editForm.value.handleBy,
        status: editForm.value.status,
        nomorBA: editForm.value.nomorBA,
        actionDetail: editForm.value.actionDetail
      })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showEditModal.value = false;
      Swal.fire('Berhasil', data.message, 'success');
      loadAdminTickets();
    } else {
      Swal.fire('Gagal', data.error || 'Gagal mengupdate ticket', 'error');
    }
  } catch (err) {
    // Fallback updates in mock array
    const idx = adminTickets.value.findIndex(t => t.ticketId === editForm.value.ticketId);
    if (idx > -1) {
      adminTickets.value[idx].handleBy = editForm.value.handleBy;
      adminTickets.value[idx].status = editForm.value.status;
      adminTickets.value[idx].nomorBA = editForm.value.nomorBA;
      adminTickets.value[idx].actionDetail = editForm.value.actionDetail;
      if (editForm.value.status === 'Selesai') {
        adminTickets.value[idx].tglSelesai = new Date().toISOString();
      }
    }
    showEditModal.value = false;
    Swal.fire('Berhasil', 'Ticket diupdate (Mode Simulasi)', 'success');
    nextTick(() => {
      initKategoriChart();
    });
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

const exportData = () => {
  if (adminTickets.value.length === 0) {
    Swal.fire('Kosong', 'Tidak ada data untuk diexport', 'info');
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  const headers = "TicketID,TanggalMelapor,NamaPelapor,UnitPelapor,Jenis,NoRegister,Kendala,Status,HandleBy,NomorBA,ActionDetail,TglSelesai\n";
  csvContent += headers;
  
  adminTickets.value.forEach(t => {
    const row = [
      t.ticketId,
      t.tanggalMelapor || '',
      t.namaPelapor,
      t.unitPelapor,
      t.jenis,
      t.noRegister || '-',
      t.kendala.replace(/"/g, '""'),
      t.status,
      t.handleBy || '-',
      t.nomorBA || '-',
      t.actionDetail ? t.actionDetail.replace(/"/g, '""') : '-',
      t.tglSelesai || '-'
    ].map(v => `"${v}"`).join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Data_ISD_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Lifecycle Hooks
onMounted(() => {
  fetchMasterData();
  checkLoginState();
  slideInterval = setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % slides.length;
  }, 5000);
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
  if (categoryChart) categoryChart.destroy();
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
  display: flex;
  flex-direction: column;
}

/* ========================================== */
/* PUBLIC NAVBAR STYLES                       */
/* ========================================== */
.public-navbar {
  width: 100%;
  background: #08080c;
  border-bottom: 1px solid #1e293b;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 50;
  flex-shrink: 0;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.logo-icon {
  background: #10b981;
  color: #08080c;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-icon i {
  font-size: 20px;
}

.logo-text {
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.5px;
  font-style: italic;
}

.preview-badge {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

/* Main Content Area */
.ticketing-main {
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  position: relative;
}

/* ========================================== */
/* VIEW 1: LANDING VIEW STYLE                 */
/* ========================================== */
.view-landing {
  width: 100%;
  min-height: calc(100vh - 275px);
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
  opacity: 0.18;
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
  border: 1px solid #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #94a3b8;
}

/* ========================================== */
/* VIEW 2: FORM VIEW STYLE                    */
/* ========================================== */
.view-form,
.view-track,
.view-login {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 40px 24px;
}

.form-card,
.track-card {
  width: 100%;
  max-width: 960px;
  background: rgba(25, 25, 35, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.btn-back {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  transition: color 0.2s ease;
}

.btn-back:hover {
  color: #fff;
}

.form-title,
.track-title {
  font-size: 32px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: -0.5px;
  margin-bottom: 28px;
  text-align: center;
}

.accent-green {
  color: #10b981;
}

.form-header-info {
  background: rgba(16, 185, 129, 0.04);
  border-left: 3px solid #10b981;
  padding: 16px;
  border-radius: 0 12px 12px 0;
  margin-bottom: 32px;
}

.desc-text {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 8px;
}

.emergency-text {
  font-size: 13px;
  font-weight: 700;
  color: #f59e0b;
}

.phone-link {
  color: #10b981;
  text-decoration: none;
  border-bottom: 1px dotted #10b981;
}

.ticket-form-fields {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
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
input[type="password"],
select,
textarea {
  background: rgba(10, 10, 15, 0.6);
  border: 1px solid #334155;
  color: #fff;
  border-radius: 12px;
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
  margin-bottom: 20px;
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
  border: 1px solid #334155;
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

.priority-labels {
  display: flex;
  justify-content: space-between;
  max-width: 260px;
  font-size: 9px;
  font-weight: 700;
  color: #475569;
  padding: 0 4px;
}

.btn-submit {
  width: 100%;
  background: #10b981;
  color: #0c0a09;
  font-size: 14px;
  font-weight: 800;
  padding: 13px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #059669;
}

.btn-submit:disabled {
  background: #1e293b;
  color: #64748b;
  cursor: not-allowed;
}

/* ========================================== */
/* VIEW 3: SUCCESS VIEW STYLE                 */
/* ========================================== */
.view-success {
  width: 100%;
  min-height: calc(100vh - 275px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.success-card {
  width: 100%;
  max-width: 580px;
  background: rgba(25, 25, 35, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 40px;
  text-align: center;
}

.success-badge {
  width: 64px;
  height: 64px;
  background: #10b981;
  color: #08080c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 24px;
}

.success-title {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.5px;
  color: #cbd5e1;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.ticket-id {
  font-size: 36px;
  font-weight: 900;
  color: #10b981;
  letter-spacing: 2px;
  margin-bottom: 32px;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.success-tips-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  text-align: left;
}

.tip-box {
  background: rgba(10, 10, 15, 0.4);
  border: 1px solid #1e293b;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-icon.text-yellow { color: #f59e0b; }
.tip-icon.text-blue { color: #3b82f6; }

.tip-box p {
  font-size: 12px;
  line-height: 1.4;
  color: #94a3b8;
}

.text-highlight {
  color: #f1f5f9;
  font-weight: 600;
}

.btn-close-msg {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.btn-close-msg:hover {
  color: #fff;
}

/* ========================================== */
/* VIEW 4: TRACKING VIEW STYLE                */
/* ========================================== */
.track-search-wrapper {
  margin-bottom: 24px;
}

.search-input-group {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #fff;
  border-radius: 12px;
  padding: 12px 16px 12px 44px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #10b981;
}

.track-loading {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.05);
  border-top-color: #10b981;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
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
  padding: 32px;
  font-size: 14px;
}

.public-ticket-item {
  background: rgba(10, 10, 15, 0.4);
  border: 1px solid #1e293b;
  border-left-width: 4px;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.public-ticket-item:hover {
  background: rgba(30, 41, 59, 0.2);
}

.public-ticket-item.border-pending { border-left-color: #ef4444; }
.public-ticket-item.border-ongoing { border-left-color: #f59e0b; }
.public-ticket-item.border-success { border-left-color: #10b981; }

.ticket-summary {
  display: flex;
  flex-direction: column;
}

.ticket-code {
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 4px;
}

.ticket-label {
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.separator {
  color: #475569;
  margin: 0 4px;
}

.ticket-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-badge.ongoing {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.status-badge.selesai {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.btn-detail-view {
  background: #334155;
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.btn-detail-view:hover {
  background: #475569;
}

/* ========================================== */
/* VIEW 5: LOGIN VIEW STYLE                   */
/* ========================================== */
.view-login {
  align-items: center;
  min-height: calc(100vh - 275px);
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(25, 25, 35, 0.55);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.lock-icon {
  background: #0f172a;
  border: 1px solid #1e293b;
  color: #10b981;
  display: inline-block;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 12px;
}

.lock-icon i {
  font-size: 28px;
}

.login-title {
  font-size: 20px;
  font-weight: 900;
  font-style: italic;
}

.login-subtitle {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.login-hint {
  font-size: 10px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 10px;
  border-radius: 8px;
  text-align: left;
  margin-top: 12px;
  line-height: 1.4;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-login {
  background: #10b981;
  color: #0c0a09;
  font-weight: 800;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background: #059669;
}

.btn-cancel {
  background: transparent;
  color: #64748b;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-cancel:hover {
  color: #fff;
}

/* ========================================== */
/* VIEW 6: SYSTEM LAYOUT (ADMIN VIEWPORT)     */
/* ========================================== */
.system-layout {
  width: 100%;
  min-height: 100vh;
  background: #08080c;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  padding-bottom: 40px;
}

.system-navbar {
  width: 100%;
  background: rgba(25, 25, 35, 0.55);
  border-bottom: 1px solid #1e293b;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 110;
  backdrop-filter: blur(10px);
}

.system-brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.logo-icon-small {
  background: #10b981;
  color: #08080c;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-icon-small i {
  font-size: 16px;
}

.logo-text-small {
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
  font-style: italic;
}

.system-user {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0f172a;
  border: 1px solid #1e293b;
  padding: 6px 16px;
  border-radius: 20px;
}

.user-info {
  text-align: right;
}

.user-role {
  font-size: 9px;
  font-weight: 700;
  color: #10b981;
  text-transform: uppercase;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.btn-logout {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-logout:hover {
  background: rgba(239, 68, 68, 0.2);
}

.system-body {
  flex-grow: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.system-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-b: 1px solid #1e293b;
  padding-bottom: 16px;
  margin-bottom: 24px;
}

.system-title {
  font-size: 24px;
  font-weight: 900;
  font-style: italic;
}

.btn-toggle-view {
  background: #10b981;
  color: #08080c;
  font-weight: 800;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s;
}

.btn-toggle-view:hover {
  background: #059669;
}

/* Admin Dashboard Subview Cards */
.stat-card {
  background: rgba(25, 25, 35, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.stat-background-icon {
  font-size: 56px;
  color: #475569;
  position: absolute;
  right: -8px;
  bottom: -8px;
  opacity: 0.15;
}

.stat-background-icon.text-yellow { color: #f59e0b; }
.stat-background-icon.text-green { color: #10b981; }
.stat-background-icon.text-red { color: #ef4444; }

.stat-value {
  font-size: 32px;
  font-weight: 900;
  color: #fff;
}

.stat-value.text-yellow { color: #f59e0b; }
.stat-value.text-green { color: #10b981; }
.stat-value.text-red { color: #ef4444; }

.stat-label {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  margin-top: 4px;
  letter-spacing: 0.5px;
}

/* Split Cards Grid */
.admin-data-card {
  background: rgba(25, 25, 35, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-title-header {
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart-container {
  position: relative;
  height: 180px;
  width: 100%;
}

.ranking-list,
.recent-issues-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.ranking-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ranking-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  color: #cbd5e1;
}

.ranking-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ranking-badge-number {
  background: #10b981;
  color: #08080c;
  font-size: 9px;
  width: 16px;
  height: 16px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ranking-value {
  color: #fff;
}

.ranking-progress-track {
  width: 100%;
  background: #1e293b;
  height: 6px;
  border-radius: 10px;
  overflow: hidden;
}

.ranking-progress-bar {
  background: #10b981;
  height: 100%;
  border-radius: 10px;
}

.empty-list-text {
  font-size: 12px;
  color: #475569;
  text-align: center;
  padding: 24px 0;
}

.recent-issue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 41, 59, 0.3);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
}

.issue-text {
  font-size: 11px;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
}

.issue-unit-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Admin Management Panel */
.filter-panel-card {
  background: rgba(25, 25, 35, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filters-left {
  display: flex;
  gap: 12px;
  flex-grow: 1;
  flex-wrap: wrap;
}

.search-field-relative {
  position: relative;
  flex-grow: 1;
  max-width: 280px;
}

.search-field-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.admin-search-input {
  width: 100%;
  background: #0f172a;
  border: 1px solid #334155;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px 8px 36px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}

.admin-search-input:focus {
  border-color: #10b981;
}

.admin-select-filter {
  background: #0f172a;
  border: 1px solid #334155;
  color: #fff;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  cursor: pointer;
}

.btn-export-csv {
  background: transparent;
  border: 1px solid #334155;
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-export-csv:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: #94a3b8;
  color: #fff;
}

/* Admin Table Design */
.table-container-card {
  background: rgba(25, 25, 35, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.admin-table th {
  background: rgba(15, 23, 42, 0.4);
  border-bottom: 1px solid #1e293b;
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 16px;
}

.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(30, 41, 59, 0.4);
  font-size: 13px;
}

.table-row-hover:hover {
  background: rgba(30, 41, 59, 0.15);
}

.ticket-id-badge {
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
}

.row-pelapor-name {
  font-weight: 700;
  color: #fff;
}

.row-pelapor-unit {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  margin-top: 2px;
}

.row-jenis-cell {
  font-weight: 600;
  color: #cbd5e1;
}

.row-ba-number {
  font-weight: 700;
  color: #fff;
}

.row-staff-handled {
  font-size: 10px;
  color: #64748b;
  text-transform: uppercase;
  margin-top: 2px;
}

.row-actions-group {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.row-action-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
  padding: 4px;
}

.row-action-btn:hover:not(:disabled) {
  color: #fff;
}

.row-action-btn.edit-btn:hover:not(:disabled) {
  color: #3b82f6;
}

.row-action-btn:disabled {
  color: #1e293b;
  cursor: not-allowed;
}

/* ========================================== */
/* PUBLIC FOOTER STYLES                       */
/* ========================================== */
.public-footer {
  width: 100%;
  background: #08080c;
  border-top: 1px solid #1e293b;
  padding: 24px;
  text-align: center;
  color: #475569;
  font-size: 11px;
  flex-shrink: 0;
  margin-top: auto;
}

/* ========================================== */
/* MODAL OVERLAY & CARD STYLES                */
/* ========================================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal-card {
  width: 100%;
  max-width: 640px;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  position: relative;
}

.modal-card.update-modal {
  max-width: 540px;
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.4);
}

.modal-title {
  font-size: 16px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 0.5px;
}

.btn-modal-close {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-modal-close:hover {
  color: #fff;
}

.modal-body {
  padding: 24px;
  max-height: 75vh;
  overflow-y: auto;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row.col-span-2 {
  grid-column: span 2;
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
  font-weight: 600;
  color: #cbd5e1;
}

.info-value.text-green { color: #10b981; }
.info-value.text-highlight { color: #f59e0b; }

.border-quote-row {
  margin-top: 16px;
  border-top: 1px solid rgba(30, 41, 59, 0.4);
  padding-top: 12px;
}

.info-quote {
  font-size: 13px;
  font-style: italic;
  color: #cbd5e1;
  background: #08080c;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #1e293b;
  margin-top: 4px;
  line-height: 1.5;
}

.modal-divider {
  height: 1px;
  background: rgba(30, 41, 59, 0.4);
  margin: 16px 0;
}

.btn-update-submit {
  width: 100%;
  background: #10b981;
  color: #0c0a09;
  font-weight: 800;
  padding: 12px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 12px;
}

.btn-update-submit:hover {
  background: #059669;
}

/* Animations */
.animate-fade {
  animation: fadeIn 0.4s ease-out;
}

.animate-scale {
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .view-form, .view-track, .view-login {
    padding: 20px 16px;
  }
  
  .form-card, .track-card, .login-card {
    padding: 24px;
  }
  
  .form-row.col-3,
  .form-row.col-2 {
    grid-template-columns: 1fr;
    gap: 16px;
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
  
  .info-row.col-span-2 {
    grid-column: span 1;
  }
}
</style>
