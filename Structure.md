path/to/i-portal/
├── App.vue                         <-- Root layout containing shell router-view & styles
├── Dashboard.vue                   <-- Dashboard interface (Three.js WebGL & Reactivity)
├── Ticketing.vue                   <-- i-Ticketing SPA component (Landing, Form, Tracker)
├── main.js                         <-- Application bootstrapper
├── router.js                       <-- Vue Router routing maps and lazy routes redirection
├── index.html                      <-- Shell HTML entry template
├── vite.config.js                  <-- Vite compiler and dev server settings
├── package.json                    <-- Dependencies and workspace execution scripts
├── isdwmc.html                     <-- Legacy responsive WMC template page
├── i_ticketing.html                <-- Legacy static fallback ticketing page
├── form.html                       <-- Legacy static fallback form page
├── README.md                       <-- Installation, running, and local developer guides
└── i-ticketing-service/            <-- Express/Node.js Ticketing Backend Microservice
    ├── server.js                   <-- API controllers & routes (master data, logs, update)
    ├── seed.js                     <-- Database master data seeder (Units and Categories)
    ├── .env                        <-- Development environment variables
    ├── package.json                <-- Backend dependencies configuration
    └── models/                     <-- Mongoose Database Schemas
        ├── Category.js             <-- Master incident categories schema
        ├── Ticket.js               <-- Log entry details, assignments, checksheets schema
        └── Unit.js                 <-- Master departments list schema
