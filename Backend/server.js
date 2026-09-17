// server.js 
const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const cookieParser = require('cookie-parser'); // Imported cookie-parser
const connectDB = require('./config/db'); 
 
dotenv.config(); 
 
const app = express(); 
 

// Middlewares 
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:5173',  
  credentials: true // Crucial for passing JWT cookies
})); 
app.use(express.json()); 
app.use(cookieParser()); // Enables reading req.cookies
 
// Connect Database 
connectDB(); 
 
// Route Mounts 
// Matches the React frontend pointing to BASE_URL/users/login 
app.use('/api/users', require('./routes/authRoutes')); 
app.use('/api/telemetry', require('./routes/fastLane')); 
app.use('/api/logistics', require('./routes/slowLane')); 
app.use('/api/orders', require('./routes/orderRoutes'));
 
// Root Health Check 
app.get('/', (req, res) => { 
  res.json({ message: 'Antarctic Digital Twin API is active.' }); 
}); 
 
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => { 
  console.log(`[Server] Running on http://localhost:${PORT}`); 
});