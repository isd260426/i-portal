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
      jumlah, 
      noRegister, 
      kendala, 
      priority, 
      nomerHp 
    } = req.body;

    // Check if the category requires a register number
    const category = await Category.findOne({ code: jenis });
    if (category && category.requiresRegister && (!noRegister || noRegister.trim() === '')) {
      return res.status(400).json({ 
        error: `Nomor Register wajib diisi jika Jenis Kendala adalah ${category.name}.` 
      });
    }

    const newTicket = new Ticket({
      namaPelapor,
      unitPelapor,
      fap,
      tanggalMelapor: tanggalMelapor ? new Date(tanggalMelapor) : new Date(),
      jenis,
      jumlah: Number(jumlah) || 1,
      noRegister: category && category.requiresRegister ? noRegister : '',
      kendala,
      priority: Number(priority) || 1,
      nomerHp
    });

    const savedTicket = await newTicket.save();
    res.status(201).json({
      success: true,
      message: 'Ticket successfully created.',
      ticket: savedTicket
    });

  } catch (error) {
    console.error('Ticket submission failure:', error);
    res.status(500).json({ error: 'Failed to submit ticket details.' });
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

// Start server
app.listen(PORT, () => {
  console.log(`i-Ticketing microservice running at: http://localhost:${PORT}`);
});
