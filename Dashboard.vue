<template>
  <!-- Background Effects -->
  <div class="bg-gradient"></div>
  <div id="canvas-container" ref="canvasContainer"></div>
  <div class="grid-overlay"></div>
  
  <!-- Floating Elements -->
  <div class="floating-elements">
    <div class="floating-tag">Secure</div>
    <div class="floating-tag">Web3.0</div>
    <div class="floating-tag">Encrypted</div>
    <div class="floating-tag">Local HUB</div>
  </div>

  <!-- Navigation -->
  <nav class="nav-bar">
    <div class="nav-content">
      <div class="logo-section">
        <div class="moon-icon">
          <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" fill="url(#glow)" opacity="0.3" r="45"/>
            <circle cx="50" cy="50" fill="url(#moonGradient)" r="40"/>
            <ellipse cx="35" cy="50" fill="#0a0a0a" opacity="0.9" rx="30" ry="35"/>
            <circle cx="50" cy="50" fill="url(#moonGradient)" opacity="0.3" r="40"/>
            <defs>
              <radialGradient cx="50%" cy="50%" id="glow" r="50%">
                <stop offset="0%" stop-color="#ff6b35"/>
                <stop offset="100%" stop-color="transparent"/>
              </radialGradient>
              <linearGradient id="moonGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stop-color="#ff6b35"/>
                <stop offset="50%" stop-color="#ff8c42"/>
                <stop offset="100%" stop-color="#ffb347"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="logo-text">InformationSystemWMC<span class="beta-badge">2026</span></div>
      </div>

      <div class="segmented-control">
        <button 
          :class="['segment-btn', { active: activeTab === 1 }]" 
          id="btn1" 
          @click="switchDashboard(1)"
        >
          Report Ticketing
        </button>
        <button 
          :class="['segment-btn', { active: activeTab === 2 }]" 
          id="btn2" 
          @click="switchDashboard(2)"
        >
          Portal ISD System
        </button>
      </div>
    </div>
  </nav>

  <!-- Main Content -->
  <main class="main-content">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="calendar-widget">
        <div class="calendar-header">
          <svg class="calendar-icon" fill="none" stroke="#ff8c42" stroke-width="2" viewBox="0 0 24 24">
            <rect height="18" rx="2" ry="2" width="18" x="3" y="4"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
          <span>Today</span>
        </div>
        <div class="calendar-date" id="calendar-date">{{ calendar.date }}</div>
        <div class="calendar-month-year" id="calendar-month-year">{{ calendar.monthYear }}</div>
        <div class="calendar-day" id="calendar-day">{{ calendar.day }}</div>
      </div>

      <div class="center-content">
        <div class="hero-badge">Get early access &#8226; WMC System</div>
        <div class="hero-title-container">
          <h1 class="hero-title">Meet! InformationSystem</h1>
          <h1 class="hero-title line2">Built for a secure future.</h1>
        </div>
        <p class="hero-subtitle">Empowering your workflow with top-tier validation, reporting, and integrated solutions&#8212;built for enterprise scale.</p>
        <div class="action-buttons">
          <button class="btn-primary" @click="refreshDashboard">Refresh System</button>
          <button class="btn-secondary" @click="toggleFullscreen">Fullscreen</button>
        </div>
      </div>

      <div class="flip-clock-widget">
        <div class="flip-clock">
          <div class="flip-unit">
            <div class="flip-digit" id="hours-tens">{{ time.hoursTens }}</div>
            <div class="flip-label">Hours</div>
          </div>
          <div class="flip-unit"><div class="flip-digit" id="hours-ones">{{ time.hoursOnes }}</div></div>
          <div class="flip-separator">:</div>
          <div class="flip-unit">
            <div class="flip-digit" id="minutes-tens">{{ time.minutesTens }}</div>
            <div class="flip-label">Minutes</div>
          </div>
          <div class="flip-unit"><div class="flip-digit" id="minutes-ones">{{ time.minutesOnes }}</div></div>
          <div class="flip-separator">:</div>
          <div class="flip-unit">
            <div class="flip-digit" id="seconds-tens">{{ time.secondsTens }}</div>
            <div class="flip-label">Seconds</div>
          </div>
          <div class="flip-unit"><div class="flip-digit" id="seconds-ones">{{ time.secondsOnes }}</div></div>
        </div>
        <div class="clock-badge">WIT/Maluku Utara</div>
      </div>
    </div>

    <!-- Viewport Container (formerly Iframe Container) -->
    <div class="iframe-container" ref="viewportContainer">
      <div class="iframe-header">
        <div class="iframe-dot red"></div>
        <div class="iframe-dot yellow"></div>
        <div class="iframe-dot green"></div>
      </div>
      <div class="iframe-wrapper" id="iframeWrapper">
        <div :class="['loading-overlay', { show: isLoading }]" id="loading">
          <div class="spinner"></div>
          <div class="loading-text">Loading sub-app...</div>
        </div>
        
        <!-- Vue Router Viewport for Sub-apps -->
        <router-view :key="routerKey" v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
    
    <!-- NEWS SLIDESHOW SECTION -->
    <section class="news-section">
      <div class="news-header">
        <h2 class="news-title">Latest Updates &amp; Innovations</h2>
        <p class="news-subtitle">Discover the latest trends in healthcare technology and medical center developments</p>
      </div>
      
      <!-- Row 1: Moving Left -->
      <div class="marquee-container">
        <div class="marquee-track">
          <!-- Card 1 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Facility</span>
              <img alt="Hospital Design" class="news-image" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Update</span><span class="news-meta-dot"></span><span>WMC Facility</span></div>
              <h3 class="news-headline">Modern Hospital Architecture: Building the Future of Healthcare</h3>
              <router-link class="news-link" to="#">Read more <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>

          <!-- Card 2 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Expansion</span>
              <img alt="Expansion" class="news-image" src="https://images.unsplash.com/photo-1504439468489-c8920d786a2b?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Project</span><span class="news-meta-dot"></span><span>IWIP Development</span></div>
              <h3 class="news-headline">Texas Medical Center Expansion: Contemporary Design Meets Functionality</h3>
              <router-link class="news-link" to="#">Discover <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>

          <!-- Card 3 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Equipment</span>
              <img alt="Equipment" class="news-image" src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Technology</span><span class="news-meta-dot"></span><span>Medical Devices</span></div>
              <h3 class="news-headline">Advanced Medical Equipment: From Anesthesia to Imaging Systems</h3>
              <router-link class="news-link" to="#">Learn more <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>

          <!-- Card 4 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Digital</span>
              <img alt="Digital" class="news-image" src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Innovation</span><span class="news-meta-dot"></span><span>Healthcare IT</span></div>
              <h3 class="news-headline">Digital Transformation in Healthcare: Key Steps for Modern Medical Centers</h3>
              <router-link class="news-link" to="#">Explore <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>

          <!-- DUPLICATE (REQUIRED FOR CONTINUOUS SLIDESHOW) -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Facility</span>
              <img alt="Hospital Design" class="news-image" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Update</span><span class="news-meta-dot"></span><span>WMC Facility</span></div>
              <h3 class="news-headline">Modern Hospital Architecture: Building the Future of Healthcare</h3>
              <router-link class="news-link" to="#">Read more <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Expansion</span>
              <img alt="Expansion" class="news-image" src="https://images.unsplash.com/photo-1504439468489-c8920d786a2b?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Project</span><span class="news-meta-dot"></span><span>IWIP Development</span></div>
              <h3 class="news-headline">Texas Medical Center Expansion: Contemporary Design Meets Functionality</h3>
              <router-link class="news-link" to="#">Discover <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Equipment</span>
              <img alt="Equipment" class="news-image" src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Technology</span><span class="news-meta-dot"></span><span>Medical Devices</span></div>
              <h3 class="news-headline">Advanced Medical Equipment: From Anesthesia to Imaging Systems</h3>
              <router-link class="news-link" to="#">Learn more <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Digital</span>
              <img alt="Digital" class="news-image" src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Innovation</span><span class="news-meta-dot"></span><span>Healthcare IT</span></div>
              <h3 class="news-headline">Digital Transformation in Healthcare: Key Steps for Modern Medical Centers</h3>
              <router-link class="news-link" to="#">Explore <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
        </div>
      </div>

      <!-- Row 2: Moving Right -->
      <div class="marquee-container reverse">
        <div class="marquee-track">
          <!-- Card 5 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Innovation</span>
              <img alt="HealthTech" class="news-image" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Trends</span><span class="news-meta-dot"></span><span>2026 Outlook</span></div>
              <h3 class="news-headline">HealthTech Innovations: AI and Robotics Transforming Patient Care</h3>
              <router-link class="news-link" to="#">Watch now <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <!-- Card 6 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Team</span>
              <img alt="Team" class="news-image" src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>People</span><span class="news-meta-dot"></span><span>WMC Staff</span></div>
              <h3 class="news-headline">Meet Our Expert Medical Team and IT: Dedicated Healthcare Professionals</h3>
              <router-link class="news-link" to="#">Meet team <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <!-- Card 7 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Center</span>
              <img alt="Center" class="news-image" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Facility</span><span class="news-meta-dot"></span><span>Adaptive Reuse</span></div>
              <h3 class="news-headline">United Health Centers: Modern Adaptive Reuse Medical Building Design</h3>
              <router-link class="news-link" to="#">View project <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <!-- Card 8 -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">System</span>
              <img alt="SIRS" class="news-image" src="https://images.unsplash.com/photo-1576091160550-2173ff9e5952?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Technology</span><span class="news-meta-dot"></span><span>SIRS Update</span></div>
              <h3 class="news-headline">SIRS Implementation: Streamlining Hospital Information Systems</h3>
              <router-link class="news-link" to="#">Read more <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          
          <!-- DUPLICATE (REQUIRED FOR CONTINUOUS SLIDESHOW) -->
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Innovation</span>
              <img alt="HealthTech" class="news-image" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Trends</span><span class="news-meta-dot"></span><span>2026 Outlook</span></div>
              <h3 class="news-headline">HealthTech Innovations: AI and Robotics Transforming Patient Care</h3>
              <router-link class="news-link" to="#">Watch now <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Team</span>
              <img alt="Team" class="news-image" src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>People</span><span class="news-meta-dot"></span><span>WMC Staff</span></div>
              <h3 class="news-headline">Meet Our Expert Medical Team: Dedicated Healthcare Professionals</h3>
              <router-link class="news-link" to="#">Meet team <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">Center</span>
              <img alt="Center" class="news-image" src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Facility</span><span class="news-meta-dot"></span><span>Adaptive Reuse</span></div>
              <h3 class="news-headline">United Health Centers: Modern Adaptive Reuse Medical Building Design</h3>
              <router-link class="news-link" to="#">View project <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
          <article class="news-card">
            <div class="news-image-wrapper">
              <span class="news-category">System</span>
              <img alt="SIRS" class="news-image" src="https://images.unsplash.com/photo-1576091160550-2173ff9e5952?w=800&amp;q=80"/>
            </div>
            <div class="news-content">
              <div class="news-meta"><span>Technology</span><span class="news-meta-dot"></span><span>SIRS Update</span></div>
              <h3 class="news-headline">SIRS Implementation: Streamlining Hospital Information Systems</h3>
              <router-link class="news-link" to="#">Read more <i class="fas fa-chevron-right"></i></router-link>
            </div>
          </article>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <footer class="custom-footer">
      <div class="footer-content">
        <div class="footer-col-main">
          <h2 class="footer-title">Empowers You to <br/><span>Global Competition</span></h2>
          <div class="footer-socials">
            <router-link class="social-btn" to="#"><i class="fab fa-instagram"></i></router-link>
            <router-link class="social-btn" to="#"><i class="fab fa-linkedin"></i></router-link>
            <router-link class="social-btn" to="#"><i class="fab fa-facebook"></i></router-link>
            <router-link class="social-btn" to="#"><i class="fab fa-youtube"></i></router-link>
          </div>
          <p class="footer-address">
            <i class="fas fa-map-marker-alt footer-icon-accent"></i> 
            Wedabay Medical Center - PT Indonesia Weda Bay Industrial Park (IWIP) berlokasi di Tanjung Ulie, Desa Lelilef Sawai, Kecamatan Weda Tengah, Kabupaten Halmahera Tengah, Maluku Utara, 97853
          </p>
        </div>

        <div class="footer-contact">
          <h4 class="footer-heading">Hubungi Kami</h4>
          <a href="mailto:informationsystemwmc@gmail.com">
            <i class="fas fa-envelope footer-icon-accent"></i> informationsystemwmc@gmail.com
          </a>
          <p><i class="fas fa-phone footer-icon-accent"></i> (0761) - 000156</p>
          <p><i class="fab fa-whatsapp footer-icon-accent"></i> 0821 6963 4519 </p>
        </div>

        <div class="footer-services-grid">
          <div>
            <h4 class="footer-heading border-left">Layanan</h4>
            <ul class="footer-links">
              <li><router-link to="/sirs">SIRS (Sistem Informasi Rumah Sakit)</router-link></li>
              <li><router-link to="/i-warehouse">Inventory Internal</router-link></li>
              <li><router-link to="/i-mimo">Mesin Antrian</router-link></li>
              <li><router-link to="/i-ticketing">Hardware Reparasi</router-link></li>
            </ul>
          </div>
          <div style="padding-top: 38px;">
            <ul class="footer-links">
              <li><router-link to="/portal-isd">Portal ISD</router-link></li>
              <li><router-link to="/order-barang">ORDER BARANG IT</router-link></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        2026 &#169; Information System Database. Dikembangkan oleh BSTI ISD
      </div>
    </footer>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import * as THREE from 'three';

// ----------------------------------------------------
// Vue Router Configuration
// ----------------------------------------------------
const router = useRouter();
const route = useRoute();

const activeTab = computed(() => {
  // Check active path to highlight appropriate tab/segmented-control
  if (route.path === '/i-ticketing') {
    return 1;
  } else if (route.path === '/portal-isd' || route.path === '/i-mimo' || route.path === '/i-warehouse' || route.path === '/' || route.path === '/dashboard') {
    return 2;
  }
  return null;
});

const switchDashboard = (num) => {
  if (num === activeTab.value) return;
  
  if (num === 1) {
    router.push('/i-ticketing');
  } else if (num === 2) {
    router.push('/portal-isd');
  }
};

// ----------------------------------------------------
// UI State & Control
// ----------------------------------------------------
const viewportContainer = ref(null);
const isLoading = ref(false);
const routerKey = ref(0);
let idleTimer = null;

const refreshDashboard = () => {
  isLoading.value = true;
  routerKey.value++;
  setTimeout(() => {
    isLoading.value = false;
  }, 400);
  resetIdleTimer();
};

const toggleFullscreen = () => {
  const container = viewportContainer.value;
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen: ' + err.message);
    });
  } else {
    document.exitFullscreen();
  }
};

const resetIdleTimer = () => {
  if (idleTimer) clearTimeout(idleTimer);
  // Uncomment below if you wish to enable auto-refresh on idle
  // idleTimer = setTimeout(refreshDashboard, 60000);
};

// ----------------------------------------------------
// Calendar & Clock Reactivity
// ----------------------------------------------------
const time = ref({
  hoursTens: '0',
  hoursOnes: '0',
  minutesTens: '0',
  minutesOnes: '0',
  secondsTens: '0',
  secondsOnes: '0'
});

const calendar = ref({
  date: '1',
  monthYear: 'April 2026',
  day: 'Tuesday'
});

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  time.value = {
    hoursTens: hours[0],
    hoursOnes: hours[1],
    minutesTens: minutes[0],
    minutesOnes: minutes[1],
    secondsTens: seconds[0],
    secondsOnes: seconds[1]
  };
};

const updateCalendar = () => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  calendar.value = {
    date: String(now.getDate()),
    monthYear: months[now.getMonth()] + ' ' + now.getFullYear(),
    day: days[now.getDay()]
  };
};

// ----------------------------------------------------
// Three.js Animated Background Logic
// ----------------------------------------------------
const canvasContainer = ref(null);
let scene = null;
let camera = null;
let renderer = null;
let disks = [];
let animationFrameId = null;
let mouseX = 0;
let mouseY = 0;
const target = new THREE.Vector3(0, 0, 0);

const initThreeJS = () => {
  try {
    if (!canvasContainer.value) return;

    scene = new THREE.Scene();
    scene.background = null; 

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.value.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0xff8c42, 5, 50);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff5722, 5, 50);
    light2.position.set(-10, -10, 10);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xffb347, 3, 50);
    light3.position.set(0, -15, 5);
    scene.add(light3);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff6b35, 
      metalness: 0.2, 
      roughness: 0.1, 
      transmission: 0.9,
      ior: 1.5, 
      transparent: true, 
      opacity: 0.85, 
      side: THREE.DoubleSide
    });

    const diskCount = 12;
    const geometry = new THREE.CylinderGeometry(2.5, 2.5, 0.3, 64);

    for (let i = 0; i < diskCount; i++) {
      const disk = new THREE.Mesh(geometry, material);
      const distance = 8 + Math.random() * 6;
      const orbitSpeed = 0.002 + Math.random() * 0.004;
      const angle = (i / diskCount) * Math.PI * 2 + Math.random();
      
      const rotSpeed = {
        x: Math.random() * 0.02 - 0.01, 
        y: Math.random() * 0.02 - 0.01, 
        z: Math.random() * 0.02 - 0.01
      };

      const yOffset = (Math.random() - 0.5) * 8;
      disks.push({ 
        mesh: disk, 
        distance: distance, 
        orbitSpeed: orbitSpeed, 
        angle: angle, 
        yOffset: yOffset, 
        rotSpeed: rotSpeed 
      });

      disk.rotation.x = Math.random() * Math.PI;
      disk.rotation.y = Math.random() * Math.PI;
      scene.add(disk);
    }

    window.addEventListener('resize', onWindowResize, { passive: true });
    document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
    animate();

  } catch (error) { 
    console.error("ThreeJS Error:", error); 
  }
};

const onDocumentMouseMove = (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.01;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.01;
};

const onWindowResize = () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
  animationFrameId = requestAnimationFrame(animate);
  
  if (camera && renderer && scene) {
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(target);

    disks.forEach(d => {
      d.angle += d.orbitSpeed;
      d.mesh.position.x = Math.cos(d.angle) * d.distance;
      d.mesh.position.z = Math.sin(d.angle) * d.distance;
      d.mesh.position.y = d.yOffset + Math.sin(d.angle * 2) * 2;
      d.mesh.rotation.x += d.rotSpeed.x;
      d.mesh.rotation.y += d.rotSpeed.y;
      d.mesh.rotation.z += d.rotSpeed.z;
    });
    renderer.render(scene, camera);
  }
};

const cleanupThreeJS = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', onWindowResize);
  document.removeEventListener('mousemove', onDocumentMouseMove);
  
  if (renderer) {
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  disks.forEach(d => {
    if (d.mesh) {
      if (d.mesh.geometry) d.mesh.geometry.dispose();
      if (d.mesh.material) {
        if (Array.isArray(d.mesh.material)) {
          d.mesh.material.forEach(mat => mat.dispose());
        } else {
          d.mesh.material.dispose();
        }
      }
    }
  });

  disks = [];
  scene = null;
  camera = null;
  renderer = null;
};

// ----------------------------------------------------
// Lifecycle Hooks
// ----------------------------------------------------
let clockInterval = null;

onMounted(() => {
  // Apply Apple Recognito body styles dynamically
  document.body.style.backgroundColor = '#000';
  document.body.style.height = '100vh';
  document.body.style.overflow = 'hidden';
  document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  document.body.style.webkitFontSmoothing = 'antialiased';

  // Load FontAwesome CDN dynamically if not available
  if (!document.getElementById('font-awesome-cdn')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-cdn';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
  }

  // Bind idle listeners
  document.addEventListener('click', resetIdleTimer);
  document.addEventListener('mousemove', resetIdleTimer);
  document.addEventListener('keypress', resetIdleTimer);
  document.addEventListener('scroll', resetIdleTimer);

  updateClock();
  clockInterval = setInterval(updateClock, 1000);
  updateCalendar();

  // Initialize background after short buffer
  setTimeout(initThreeJS, 300);
});

onUnmounted(() => {
  // Revert body styles to prevent leakage
  document.body.style.backgroundColor = '';
  document.body.style.height = '';
  document.body.style.overflow = '';
  document.body.style.fontFamily = '';
  document.body.style.webkitFontSmoothing = '';

  // Remove event listeners
  document.removeEventListener('click', resetIdleTimer);
  document.removeEventListener('mousemove', resetIdleTimer);
  document.removeEventListener('keypress', resetIdleTimer);
  document.removeEventListener('scroll', resetIdleTimer);

  if (clockInterval) clearInterval(clockInterval);
  if (idleTimer) clearTimeout(idleTimer);

  // Clean up ThreeJS references
  cleanupThreeJS();
});
</script>

<style scoped>
/* Apple-inspired Design System with Recognito Theme */
* {
  box-sizing: border-box;
}

/* Scoped transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.bg-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 80%, rgba(255, 107, 53, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 140, 66, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 87, 34, 0.2) 0%, transparent 70%),
    linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%);
  z-index: -3;
}

#canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  pointer-events: none;
}

.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1;
  opacity: 0.5;
  pointer-events: none;
}

/* Navigation Bar */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 52px;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(255, 107, 53, 0.1);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 40px;
  max-width: 1400px;
  width: 100%;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.moon-icon {
  width: 28px;
  height: 28px;
  position: relative;
  animation: rotate 20s linear infinite;
}

.moon-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 8px rgba(255, 107, 53, 0.6));
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #fff 0%, #ff8c42 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.beta-badge {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: #000;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
  margin-left: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.segmented-control {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 3px;
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.segment-btn {
  padding: 8px 20px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 2;
  letter-spacing: -0.2px;
}

.segment-btn.active {
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.8) 0%, rgba(255, 140, 66, 0.8) 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
}

.segment-btn:hover:not(.active) {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.main-content {
  position: fixed;
  top: 52px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
  margin-bottom: 10px;
  padding: 0 40px;
  width: 100%;
  max-width: 1400px;
}

.calendar-widget {
  flex-shrink: 0;
  width: 240px;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.3);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.calendar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  color: #ff8c42;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
}

.calendar-icon { width: 18px; height: 18px; }

.calendar-date {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 8px;
}

.calendar-month-year { font-size: 16px; color: rgba(255, 255, 255, 0.6); font-weight: 500; }
.calendar-day { font-size: 14px; color: rgba(255, 107, 53, 0.8); margin-top: 12px; font-weight: 600; text-transform: uppercase; }

.center-content { flex: 1; text-align: center; max-width: 600px; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 107, 53, 0.15);
  border: 1px solid rgba(255, 107, 53, 0.3);
  color: #ff8c42;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 10px;
  text-transform: uppercase;
}

.hero-badge::before {
  content: '';
  width: 5px;
  height: 5px;
  background: #ff6b35;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title-container {
  min-height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -1.5px;
  line-height: 1.2;
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #ff6b35;
  width: 0;
  animation: typing 3s steps(25) forwards, blink-caret 0.75s step-end infinite;
}

.hero-title.line2 {
  margin-top: 4px;
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffb347 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  border-right-color: #ff8c42;
  animation-delay: 3s;
}

.hero-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto 10px;
  line-height: 1.5;
}

.flip-clock-widget { flex-shrink: 0; display: flex; flex-direction: column; align-items: center; gap: 2px; }

.flip-clock {
  display: flex;
  gap: 8px;
  align-items: center;
  background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%);
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(255, 107, 53, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.flip-unit { display: flex; flex-direction: column; align-items: center; position: relative; }

.flip-digit {
  width: 56px;
  height: 76px;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  color: #fff;
  font-family: 'SF Mono', Monaco, monospace;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5), 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
}

.flip-digit::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.5);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.05);
}

.flip-label { font-size: 11px; color: rgba(255, 107, 53, 0.8); text-transform: uppercase; margin-top: 8px; font-weight: 600; }
.flip-separator { font-size: 32px; font-weight: 700; color: #ff6b35; margin-top: -20px; animation: blink-separator 1s infinite; }
.clock-badge { background: rgba(255, 107, 53, 0.2); color: #ff8c42; font-size: 11px; font-weight: 600; padding: 5px 14px; border-radius: 12px; text-transform: uppercase; border: 1px solid rgba(255, 107, 53, 0.3); }

.action-buttons { display: flex; gap: 10px; justify-content: center; margin-bottom: 12px; }

.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
  color: #000;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 20px;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4);
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 107, 53, 0.5); }

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 8px 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover { background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.3); }

/* Main sub-app viewport container (formerly iframe container) */
.iframe-container {
  width: 100%;
  max-width: 100%;
  height: calc(100vh - 275px);
  min-height: 480px;
  background: rgba(10, 10, 10, 0.6);
  border-top: 1px solid rgba(255, 107, 53, 0.2);
  border-bottom: 1px solid rgba(255, 107, 53, 0.2);
  border-left: none;
  border-right: none;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 107, 53, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
  margin-bottom: 20px;
}

.iframe-header { height: 36px; background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid rgba(255, 107, 53, 0.1); display: flex; align-items: center; padding: 0 14px; gap: 8px; }
.iframe-dot { width: 10px; height: 10px; border-radius: 50%; }
.iframe-dot.red { background: #ff5f57; }
.iframe-dot.yellow { background: #febc2e; }
.iframe-dot.green { background: #28c840; }

.iframe-wrapper { width: 100%; height: calc(100% - 36px); position: relative; }
.iframe-wrapper :deep(> *) {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(10, 10, 10, 0.95);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 100; opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
}
.loading-overlay.show { opacity: 1; pointer-events: all; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(255, 107, 53, 0.2); border-top-color: #ff6b35; border-radius: 50%; animation: spin 1s linear infinite; }
.loading-text { color: rgba(255, 255, 255, 0.6); font-size: 13px; margin-top: 12px; }

.floating-elements { position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: -1; }
.floating-tag { position: absolute; background: rgba(255, 107, 53, 0.1); border: 1px solid rgba(255, 107, 53, 0.2); color: rgba(255, 255, 255, 0.5); font-size: 10px; padding: 4px 10px; border-radius: 20px; font-weight: 500; }
.floating-tag:nth-child(1) { top: 15%; left: 8%; }
.floating-tag:nth-child(2) { top: 25%; right: 10%; }
.floating-tag:nth-child(3) { bottom: 20%; left: 12%; }
.floating-tag:nth-child(4) { bottom: 30%; right: 8%; }

/* News section slider */
.news-section {
  width: 100%;
  max-width: 1400px;
  padding: 40px 0;
  margin-bottom: 20px;
  position: relative;
  display: block;
}

.news-header { text-align: center; margin-bottom: 30px; padding: 0 40px; }
.news-title { font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.5px; margin-bottom: 8px; }
.news-subtitle { font-size: 14px; color: rgba(255, 255, 255, 0.5); font-weight: 400; }

.marquee-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 20px 0;
  display: block;
}

.marquee-container::before,
.marquee-container::after {
  content: ''; position: absolute; top: 0; bottom: 0; width: 150px; z-index: 2; pointer-events: none;
}
.marquee-container::before { left: 0; background: linear-gradient(to right, #000 0%, transparent 100%); }
.marquee-container::after { right: 0; background: linear-gradient(to left, #000 0%, transparent 100%); }

.marquee-track {
  display: flex;
  gap: 24px;
  width: max-content;
  animation: marquee 40s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }

.news-card {
  flex-shrink: 0;
  width: 320px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  display: block;
}

.news-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 20px 40px rgba(255, 107, 53, 0.2);
  background: rgba(255, 255, 255, 0.05);
}

.news-image-wrapper {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
  background: #111;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-card:hover .news-image { transform: scale(1.1); }

.news-category {
  position: absolute; top: 12px; left: 12px; background: rgba(255, 107, 53, 0.9); color: #000;
  font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 20px; text-transform: uppercase;
  letter-spacing: 0.5px; z-index: 2;
}

.news-content { padding: 16px; }
.news-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 11px; color: rgba(255, 140, 66, 0.8); font-weight: 500; text-transform: uppercase; }
.news-meta-dot { width: 4px; height: 4px; background: rgba(255, 107, 53, 0.6); border-radius: 50%; }
.news-headline { font-size: 15px; font-weight: 600; color: #fff; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.news-link { display: inline-flex; align-items: center; gap: 6px; color: #ff8c42; font-size: 12px; font-weight: 600; text-decoration: none; transition: all 0.3s ease; }
.news-link:hover { gap: 10px; color: #ff6b35; }
.news-link i { font-size: 10px; transition: transform 0.3s ease; }
.news-card:hover .news-link i { transform: translateX(4px); }

.marquee-container.reverse { margin-top: 20px; }
.marquee-container.reverse .marquee-track { animation: marquee-reverse 45s linear infinite; }

/* Custom Footer */
.custom-footer {
  width: 100%; padding: 30px 40px 20px; background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 107, 53, 0.2); position: relative; z-index: 10; margin-top: auto;
}
.footer-content { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr; gap: 30px; }
.footer-col-main { display: flex; flex-direction: column; }
.footer-title { font-size: 24px; font-weight: 800; color: #fff; line-height: 1.2; margin-bottom: 16px; }
.footer-title span { border-bottom: 4px solid #ff6b35; }
.footer-socials { display: flex; gap: 12px; margin-bottom: 16px; }
.social-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; transition: all 0.3s ease; background: rgba(255, 255, 255, 0.05); }
.social-btn:hover { background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%); border-color: transparent; transform: translateY(-3px); box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); }
.footer-address { color: rgba(255, 255, 255, 0.6); font-size: 13px; display: flex; align-items: flex-start; gap: 10px; line-height: 1.6; }
.footer-icon-accent { color: #ff8c42; margin-top: 3px; }
.footer-heading { font-size: 16px; font-weight: 700; color: #fff; margin-bottom: 14px; }
.footer-heading.border-left { border-left: 4px solid #ff8c42; padding-left: 12px; }
.footer-contact { display: flex; flex-direction: column; gap: 12px; justify-content: center; height: 100%; }
.footer-contact a, .footer-contact p { color: rgba(255, 255, 255, 0.7); text-decoration: none; font-size: 13px; display: flex; align-items: center; gap: 10px; transition: all 0.3s ease; }
.footer-contact a:hover { color: #ff8c42; transform: translateX(5px); }
.footer-services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
.footer-links a { color: rgba(255, 255, 255, 0.5); text-decoration: none; font-size: 13px; transition: all 0.3s ease; display: inline-block; }
.footer-links a:hover { color: #ff8c42; transform: translateX(5px); }
.footer-bottom { max-width: 1400px; margin: 30px auto 0; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center; font-size: 11px; color: rgba(255, 255, 255, 0.4); }

/* KEYFRAMES */
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
@keyframes typing { from { width: 0 } to { width: 100% } }
@keyframes blink-caret { from, to { border-color: transparent } 50% { border-color: #ff6b35 } }
@keyframes blink-separator { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

/* Responsive Grid and Breakpoints */
@media (min-width: 768px) { .footer-content { grid-template-columns: 1.2fr 1fr 1.2fr; } }
@media (max-width: 1200px) {
  .hero-section { flex-direction: column; gap: 20px; padding: 0 20px; }
  .calendar-widget, .flip-clock-widget { width: 100%; max-width: 320px; }
  .calendar-widget { padding: 20px; }
  .calendar-date { font-size: 42px; }
  .hero-title { font-size: 26px; }
  .flip-digit { width: 48px; height: 66px; font-size: 32px; }
  .iframe-container { height: calc(100vh - 320px); min-height: 400px; }
  .news-card { width: 280px; }
  .news-image-wrapper { height: 160px; }
}
@media (max-width: 768px) {
  .nav-content { gap: 20px; }
  .hero-title { font-size: 22px; }
  .hero-title-container { min-height: 50px; }
  .hero-subtitle { font-size: 12px; }
  .iframe-container { width: 100%; height: calc(100vh - 300px); min-height: 350px; margin-bottom: 16px; }
  .segment-btn { padding: 6px 14px; font-size: 12px; }
  .calendar-widget { padding: 16px; max-width: 280px; }
  .calendar-date { font-size: 36px; }
  .flip-clock { padding: 16px; }
  .flip-digit { width: 40px; height: 56px; font-size: 26px; }
  .custom-footer { padding: 24px 20px 16px; }
  .footer-title { font-size: 20px; }
  .news-section { padding: 30px 0; }
  .news-title { font-size: 22px; }
  .news-card { width: 260px; }
  .marquee-container::before, .marquee-container::after { width: 80px; }
}
</style>
