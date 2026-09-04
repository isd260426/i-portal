import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Unit from './models/Unit.js';
import Category from './models/Category.js';
import Ticket from './models/Ticket.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/i_ticketing';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB database (i_ticketing)'))
  .catch((err) => console.error('MongoDB database connection failure:', err));

// ----------------------------------------------------
// ROOT & HEALTH CHECK ROUTES
// ----------------------------------------------------

app.get('/', (req, res) => {
  res.json({
    service: 'i-Ticketing Microservice API',
    status: 'online',
    version: '2.0.0',
    endpoints: [
      'GET /health',
      'GET /api/master/units',
      'GET /api/master/categories',
      'POST /api/tickets',
      'GET /api/tickets',
      'GET /api/tickets/:id',
      'PUT /api/tickets/:id'
    ]
  });
});

app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : (dbState === 2 ? 'connecting' : 'disconnected');
  res.json({
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Fetch all master units (for Unit Pelapor dropdown)
app.get('/api/master/units', async (req, res) => {
  try {
    const units = await Unit.find().sort({ name: 1 });
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch master units data.' });
  }
});

// 2. Fetch all master categories (for Jenis Kendala dropdown)
app.get('/api/master/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch master categories data.' });
  }
});

// 3. Create/submit a new helpdesk ticket
app.post('/api/tickets', async (req, res) => {
  try {
    const { 
      namaPelapor, 
      unitPelapor, 
      fap, 
      tanggalMelapor, 
      jenis, 
      otherJenis,
      jumlah, 
      noRegister, 
      kendala, 
      priority, 
      moreDetails,
      nomerHp 
    } = req.body;

    if (!namaPelapor || !unitPelapor || !jenis || !kendala || !nomerHp) {
      return res.status(400).json({
        error: 'Field Nama Pelapor, Unit Pelapor, Jenis Kendala, Kendala, dan WhatsApp / No HP wajib diisi.'
      });
    }

    // Check if the category requires a register number (SIRS)
    if (jenis === 'SIRS' && (!noRegister || noRegister.trim() === '')) {
      return res.status(400).json({ 
        error: 'Nomor Register wajib diisi jika Jenis Kendala adalah SIRS.' 
      });
    }

    const newTicket = new Ticket({
      namaPelapor,
      unitPelapor,
      fap: fap || '',
      tanggalMelapor: tanggalMelapor ? new Date(tanggalMelapor) : new Date(),
      jenis,
      otherJenis: otherJenis || '',
      jumlah: jumlah ? String(jumlah) : '1',
      noRegister: noRegister || '',
      kendala,
      priority: Number(priority) || 1,
      moreDetails: moreDetails || '',
      nomerHp: nomerHp || ''
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({
      success: true,
      message: 'Ticket successfully created.',
      ticket: savedTicket
    });

  } catch (error) {
    console.error('Ticket submission failure:', error);
    res.status(500).json({ error: error.message || 'Failed to submit ticket details.' });
  }
});

// 4. Fetch all tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ticket history.' });
  }
});

// 5. Fetch single ticket details by ticketId or _id
app.get('/api/tickets/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let ticket;
    
    // Check if ID is a valid MongoDB ObjectId, otherwise search by ticketId (TIC-...)
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await Ticket.findById(id);
    } else {
      ticket = await Ticket.findOne({ ticketId: id });
    }

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket record not found.' });
    }
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to query ticket info.' });
  }
});

// 6. Update ticket status / details
app.put('/api/tickets/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { handleBy, status, nomorBA, actionDetail } = req.body;
    
    let ticket;
    if (mongoose.Types.ObjectId.isValid(id)) {
      ticket = await Ticket.findById(id);
    } else {
      ticket = await Ticket.findOne({ ticketId: id });
    }

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket record not found.' });
    }

    if (handleBy !== undefined) ticket.handleBy = handleBy;
    if (status !== undefined) {
      ticket.status = status;
      if (status === 'Selesai') {
        ticket.tglSelesai = new Date();
      }
    }
    if (nomorBA !== undefined) ticket.nomorBA = nomorBA;
    if (actionDetail !== undefined) ticket.actionDetail = actionDetail;

    const updatedTicket = await ticket.save();
    res.json({
      success: true,
      message: 'Ticket successfully updated.',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Ticket update failure:', error);
    res.status(500).json({ error: 'Failed to update ticket details.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`i-Ticketing microservice running at: http://localhost:${PORT}`);
});
