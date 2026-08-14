path/to/i-portal/
├── App.vue                         <-- Root layout containing shell router-view & styles
├── Dashboard.vue                   <-- Dashboard interface (Three.js WebGL & Reactivity)
├── Ticketing.vue                   <-- i-Ticketing SPA component (Landing, Form, Tracker)
├── Mimo.vue                        <-- i-MIMO sub-app iframe wrapper component
├── main.js                         <-- Application bootstrapper
├── router.js                       <-- Vue Router routing maps and lazy routes redirection
├── index.html                      <-- Shell HTML entry template
├── vite.config.js                  <-- Vite compiler and dev server settings
├── package.json                    <-- Dependencies and workspace development scripts
├── isdwmc.html                     <-- Legacy responsive WMC template page
├── i_ticketing.html                <-- Legacy static fallback ticketing page
├── form.html                       <-- Legacy static fallback form page
├── README.md                       <-- Installation, running, and local developer guides
├── i-ticketing-service/            <-- Express/Node.js Ticketing Backend Microservice
│   ├── server.js                   <-- API controllers & routes (master data, logs, update)
│   ├── seed.js                     <-- Database master data seeder (Units and Categories)
│   ├── .env                        <-- Development environment variables
│   ├── package.json                <-- Backend dependencies configuration
│   └── models/                     <-- Mongoose Database Schemas
│       ├── Category.js             <-- Master incident categories schema
│       ├── Ticket.js               <-- Log entry details, assignments, checksheets schema
│       └── Unit.js                 <-- Master departments list schema
└── i-mimo/                         <-- Duplicate of i-MIMO Microservice code
    ├── docker-compose.yml          <-- Local multi-container Docker orchestration config
    ├── healthcheck-i-mimo.sh       <-- Cluster diagnostics and system check script
    ├── install-i-mimo.sh           <-- Automated Ubuntu/Kubernetes installer script
    ├── rollback-i-mimo.sh          <-- Manual kubernetes deployment rollback script
    ├── uninstall-i-mimo.sh         <-- Automated kubernetes teardown script
    ├── db_checklist_seed.json      <-- MongoDB database checklist seed data
    ├── Structure.md                <-- i-MIMO project structure map
    ├── README.md                   <-- i-MIMO setup and architecture guide
    ├── backend/                    <-- Go Gin microservice
    │   ├── Dockerfile              <-- Multi-stage Go builder container config
    │   ├── go.mod                  <-- Go backend package manager definition
    │   └── main.go                 <-- Go Gin routes, authentication and database handlers
    ├── frontend/                   <-- Frontend static web application
    │   ├── Dockerfile              <-- Nginx static server container configuration
    │   ├── nginx.conf              <-- Reverse proxy rules mapping external endpoints
    │   └── static/                 <-- Static assets served by Nginx Nginx
    │       ├── index.html          <-- Web login page container
    │       ├── dashboard.html      <-- Main dashboard layout
    │       ├── css/                <-- UI layout style sheets
    │       └── js/                 <-- Modularized controller scripts
    └── kubernetes/                 <-- Production-ready Kubernetes templates
        ├── backend/                <-- Go REST server resources yml
        ├── frontend/               <-- Nginx client resources yml
        ├── mongodb/                <-- Persistent volume, config, secret & statefulsets
        └── mysql/                  <-- Persistent volume, secret & deployment files
