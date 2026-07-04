import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import Dashboard from './Dashboard.vue'
import Ticketing from './Ticketing.vue'

// Helpers to render clean dynamic placeholder screens for local previewing
const createPlaceholder = (title, subtitle, bgColor) => {
  return {
    name: title.replace(/\s+/g, ''),
    render() {
      return h('div', {
        style: `padding: 60px 40px; color: #fff; text-align: center; font-family: sans-serif; background: ${bgColor}; height: 100%; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.5);`
      }, [
        h('h2', { style: 'font-size: 2.2rem; font-weight: 800; margin-bottom: 12px; letter-spacing: -1px; background: linear-gradient(135deg, #fff 0%, #ff8c42 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;' }, title),
        h('p', { style: 'font-size: 1.1rem; color: rgba(255,255,255,0.7); max-width: 500px; line-height: 1.6;' }, subtitle)
      ])
    }
  }
}

// Placeholder layouts matching actual sub-apps
const PortalIsdView = createPlaceholder(
  'Portal ISD System',
  'Dashboard terpadu untuk monitoring dan kontrol infrastruktur jaringan, hardware reparasi, dan inventori internal PT Indonesia Weda Bay Industrial Park.',
  'radial-gradient(circle at center, #1e1b4b 0%, #0f0b29 100%)'
)

const MimoView = createPlaceholder(
  'i-MIMO (Mesin Antrian)',
  'Aplikasi antrian terintegrasi untuk mengoptimalkan alur pelayanan pasien di Wedabay Medical Center secara real-time.',
  'radial-gradient(circle at center, #064e3b 0%, #022c22 100%)'
)

const TicketingView = createPlaceholder(
  'i-Ticketing Helpdesk & Reparasi',
  'Sistem registrasi tiket pelaporan kendala jaringan, reparasi hardware komputer, serta bantuan keluhan sistem informasi rumah sakit (SIRS).',
  'radial-gradient(circle at center, #1c1917 0%, #0c0a09 100%)'
)

const WarehouseView = createPlaceholder(
  'i-Warehouse (Inventory Internal)',
  'Sistem pencatatan logistik stok barang IT, pergantian label inventaris aset, dan manajemen permintaan barang terintegrasi.',
  'radial-gradient(circle at center, #0f172a 0%, #020617 100%)'
)

const SirsView = createPlaceholder(
  'SIRS (Sistem Informasi Rumah Sakit)',
  'Pusat kendali dan administrasi data rekam medis pasien, pendaftaran antrean klinik, billing rumah sakit, dan modul apotek.',
  'radial-gradient(circle at center, #581c87 0%, #2e1065 100%)'
)

const OrderBarangView = createPlaceholder(
  'Order Barang IT',
  'Halaman formulir dan pelacakan persetujuan pengadaan barang, peripheral komputer, kertas printer, dan tinta cartridge.',
  'radial-gradient(circle at center, #881337 0%, #4c0519 100%)'
)

const routes = [
  {
    path: '/',
    component: Dashboard,
    children: [
      {
        path: '',
        redirect: '/i-ticketing'
      },
      {
        path: 'portal-isd',
        name: 'PortalIsd',
        component: PortalIsdView
      },
      {
        path: 'i-ticketing',
        name: 'ITicketing',
        component: Ticketing
      },
      {
        path: 'i-warehouse',
        name: 'IWarehouse',
        component: WarehouseView
      },
      {
        path: 'i-mimo',
        name: 'IMimo',
        component: MimoView
      },
      {
        path: 'sirs',
        name: 'Sirs',
        component: SirsView
      },
      {
        path: 'order-barang',
        name: 'OrderBarang',
        component: OrderBarangView
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
