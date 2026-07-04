import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  namaPelapor: {
    type: String,
    required: true,
    trim: true
  },
  unitPelapor: {
    type: String,
    required: true
  },
  fap: {
    type: String,
    trim: true
  },
  tanggalMelapor: {
    type: Date,
    required: true,
    default: Date.now
  },
  jenis: {
    type: String,
    required: true
  },
  jumlah: {
    type: Number,
    required: true,
    min: 1
  },
  noRegister: {
    type: String,
    trim: true
  },
  kendala: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: Number,
    enum: [1, 2, 3],
    required: true
  },
  nomerHp: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Ongoing', 'Selesai'],
    default: 'Pending'
  },
  handleBy: {
    type: String,
    default: ''
  },
  nomorBA: {
    type: String,
    default: ''
  },
  actionDetail: {
    type: String,
    default: ''
  },
  tglSelesai: {
    type: Date
  }
}, { timestamps: true });

// Pre-save hook to auto-generate unique sequential ticket IDs
ticketSchema.pre('save', async function(next) {
  if (this.isNew) {
    const today = new Date();
    const dateStr = today.getFullYear() + 
      String(today.getMonth() + 1).padStart(2, '0') + 
      String(today.getDate()).padStart(2, '0');
    
    // Find count of tickets created today to generate sequential index
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));
    
    const Ticket = mongoose.model('Ticket');
    const todayCount = await Ticket.countDocuments({
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });
    
    const seqNum = String(todayCount + 1).padStart(4, '0');
    this.ticketId = `TIC-${dateStr}-${seqNum}`;
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
