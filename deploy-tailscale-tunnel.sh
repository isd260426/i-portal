#!/bin/bash
# ==============================================================================
# deploy-tailscale-tunnel.sh
# Automated Server Update & Tailscale Funnel Deployment
# Host Target: isd-platform.tail9c26ef.ts.net
# ==============================================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}   🚀 ISD PLATFORM — SERVER UPDATE & TAILSCALE TUNNEL DEPLOYMENT    ${NC}"
echo -e "${CYAN}====================================================================${NC}"
echo ""

# 1. Pastikan Script dijalankan dengan hak akses root/sudo
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERROR] Harap jalankan script ini dengan sudo:${NC}"
    echo "  sudo bash $0"
    exit 1
fi

PROJECT_DIR=$(pwd)
echo -e "${YELLOW}[1/6] Memeriksa direktori project...${NC}"
echo "Direktori saat ini: $PROJECT_DIR"

# 2. Update Source Code dari GitHub
echo ""
echo -e "${YELLOW}[2/6] Menarik update source code terbaru dari GitHub...${NC}"
git pull origin main

# 3. Update Dependensi Backend i-Ticketing
echo ""
echo -e "${YELLOW}[3/6] Memperbarui dependensi i-ticketing-service...${NC}"
if [ -d "$PROJECT_DIR/i-ticketing-service" ]; then
    cd "$PROJECT_DIR/i-ticketing-service"
    npm install --production
    cd "$PROJECT_DIR"
fi

# 4. Restart Layanan i-Ticketing via Systemd
echo ""
echo -e "${YELLOW}[4/6] Me-restart layanan systemd i-ticketing...${NC}"
if systemctl is-active --quiet i-ticketing; then
    systemctl restart i-ticketing
    echo -e "${GREEN}✓ Layanan i-ticketing berhasil di-restart.${NC}"
else
    echo -e "${YELLOW}! Layanan i-ticketing belum terdaftar di systemd atau belum aktif.${NC}"
    echo "  Mencoba start i-ticketing.service..."
    systemctl restart i-ticketing || true
fi

# Cek Health API lokal
echo "Menunggu inisialisasi API backend..."
sleep 2
HEALTH_CHECK=$(curl -s http://127.0.0.1:5000/health || echo "FAIL")
if [[ "$HEALTH_CHECK" =~ "connected" || "$HEALTH_CHECK" =~ "UP" ]]; then
    echo -e "${GREEN}✓ Backend Express & Database MongoDB lokal terhubung.${NC}"
else
    echo -e "${YELLOW}! Catatan: API local healthcheck response: $HEALTH_CHECK${NC}"
fi

# 5. Konfigurasi Tailscale Hostname & Reverse Proxy (Serve)
echo ""
echo -e "${YELLOW}[5/6] Mengonfigurasi Tailscale node name & Unified Reverse Proxy...${NC}"

# Set Tailscale Node Hostname menjadi isd-platform
echo "Menyetel hostname Tailscale menjadi 'isd-platform'..."
tailscale set --hostname=isd-platform || tailscale up --hostname=isd-platform --accept-routes --ssh

# Reset konfigurasi serve lama untuk memastikan kebersihan routing
echo "Mereset routing Tailscale Serve lama..."
tailscale serve reset || true

# Forwarding Root (/) ke Frontend (Port 5173 atau Port 80 Nginx)
FRONTEND_TARGET="http://127.0.0.1:5173"
if ss -tuln | grep -q ":80 "; then
    FRONTEND_TARGET="http://127.0.0.1:80"
fi
echo "Routing HTTPS Root (/) -> $FRONTEND_TARGET"
tailscale serve --bg --https=443 "$FRONTEND_TARGET"

# Forwarding API (/api) ke Backend Express (Port 5000)
echo "Routing HTTPS (/api) -> http://127.0.0.1:5000/api"
tailscale serve --bg --https=443 /api http://127.0.0.1:5000/api

# Forwarding Health (/health) ke Backend Express (Port 5000)
tailscale serve --bg --https=443 /health http://127.0.0.1:5000/health

# 6. Aktifkan Tailscale Funnel (Publik) & Private Database Tunnel
echo ""
echo -e "${YELLOW}[6/6] Mengaktifkan Tailscale Funnel publik & Private Database Tunnel...${NC}"

# Aktifkan Funnel Publik Port 443
echo "Mengaktifkan Tailscale Funnel untuk akses publik..."
tailscale funnel 443 on

# Aktifkan Private TCP Tunnel untuk Database MongoDB (Port 27017)
# Port 27017 HANYA terbuka untuk private Tailnet, TIDAK bocor ke publik
echo "Mengonfigurasi Private TCP Tunnel untuk MongoDB (:27017)..."
tailscale serve --bg --tcp=27017 tcp://127.0.0.1:27017

echo ""
echo -e "${GREEN}====================================================================${NC}"
echo -e "${GREEN}             🎉 DEPLOYMENT & TUNNELING BERHASIL!                    ${NC}"
echo -e "${GREEN}====================================================================${NC}"
echo ""
echo -e "${CYAN}🌐 URL APLIKASI WEB PUBLIK (HP & Desktop):${NC}"
echo -e "   👉 ${GREEN}https://isd-platform.tail9c26ef.ts.net${NC}"
echo ""
echo -e "${CYAN}📊 URL API HEALTHCHECK:${NC}"
echo -e "   👉 ${GREEN}https://isd-platform.tail9c26ef.ts.net/health${NC}"
echo ""
echo -e "${CYAN}🔒 KONEKSI DATABASE MONGODB (Khusus Admin / MongoDB Compass):${NC}"
echo -e "   👉 ${YELLOW}mongodb://isd-platform.tail9c26ef.ts.net:27017/i_ticketing${NC}"
echo -e "   *(Hanya dapat diakses melalui perangkat yang login ke akun Tailnet)*"
echo ""
echo -e "${CYAN}📋 STATUS FUNNEL:${NC}"
tailscale funnel status
echo ""
