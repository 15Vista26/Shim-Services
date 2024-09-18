import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Load environment variables
import { getAllServiceProviders, addServiceProvider } from './models/serviceProvider.js';
import { getAllCustomers, addCustomer, updateIsSP } from './models/customer.js'; // Added updateIsSP import
import { getAllBookings, addBooking, deleteBooking } from './models/booking.js';
import { getAllServices, addService } from './models/service.js'; // Import service functions
// Import the city functions
import { getAllCities, addCity } from './models/city.js';
// Load environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Middleware to enable CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
}));

// Service Provider Routes
app.get('/serviceproviders', (req, res) => {
  getAllServiceProviders((err, results) => {
    if (err) {
      console.error('Error retrieving service providers:', err);
      return res.status(500).json({ error: 'Failed to retrieve service providers' });
    }
    res.json(results);
  });
});

// Service Provider Routes
app.post('/serviceproviders', (req, res) => {
  const newProvider = req.body;

  // Validate request data
  if (!newProvider.SP_Email || !newProvider.SP_PIN || !newProvider.GovernmentID || !newProvider.CityName) {
    return res.status(400).json({ error: 'Missing required fields: SP_Email, SP_PIN, GovernmentID, CityName' });
  }

  addServiceProvider(newProvider, (err, result) => {
    if (err) {
      console.error('Error adding service provider:', err);
      return res.status(500).json({ error: err.error || 'Failed to add service provider' });
    }
    res.status(201).json({ message: 'Service provider added successfully', result });
  });
});


// Customer Routes
app.get('/customers', (req, res) => {
  getAllCustomers((err, results) => {
    if (err) {
      console.error('Error retrieving customers:', err);
      return res.status(500).json({ error: 'Failed to retrieve customers' });
    }
    res.json(results);
  });
});

app.post('/customers', (req, res) => {
  const newCustomer = req.body;

  // Validate request data
  if (!newCustomer.U_Email) {
    return res.status(400).json({ error: 'Missing required field: email' });
  }

  addCustomer(newCustomer, (err, result) => {
    if (err) {
      console.error('Error adding customer:', err);
      return res.status(500).json({ error: err.error || 'Failed to add customer' });
    }
    res.status(201).json({ message: 'Customer added', result });
  });
});

// Update is_SP for Customer
app.put('/customers/:userId', (req, res) => {
  const { U_Email } = req.params;
  const { is_SP } = req.body;

  // Validate request data
  if (!U_Email || typeof is_SP === 'undefined') {
    return res.status(400).json({ error: 'Missing required fields: userId or is_SP value' });
  }

  updateIsSP(U_Email, is_SP, (err, result) => {
    if (err) {
      console.error('Error updating customer:', err);
      return res.status(500).json({ error: 'Failed to update customer' });
    }
    res.status(200).json({ message: 'Customer updated successfully', result });
  });
});

// Booking Routes
app.get('/bookings', (req, res) => {
  getAllBookings((err, results) => {
    if (err) {
      console.error('Error retrieving bookings:', err);
      return res.status(500).json({ error: 'Failed to retrieve bookings' });
    }
    res.json(results);
  });
});

app.post('/bookings', (req, res) => {
  const newBooking = req.body;

  // Validate request data
  if (!newBooking.Service_Name || !newBooking.Book_Date || !newBooking.Book_City) {
    return res.status(400).json({ error: 'Missing required fields: Service_Name, Book_Date, Book_City' });
  }

  addBooking(newBooking, (err, result) => {
    if (err) {
      console.error('Error adding booking:', err);
      return res.status(500).json({ error: 'Failed to add booking' });
    }
    res.status(201).json({ message: 'Booking added', result });
  });
});

app.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;

  deleteBooking(id, (err, result) => {
    if (err) {
      console.error('Error deleting booking:', err);
      return res.status(500).json({ error: 'Failed to delete booking' });
    }
    res.status(200).json({ message: 'Booking deleted successfully', result });
  });
});

// Service Routes
app.get('/services', (req, res) => {
  getAllServices((err, results) => {
    if (err) {
      console.error('Error retrieving services:', err);
      return res.status(500).json({ error: 'Failed to retrieve services' });
    }
    res.json(results);
  });
});

app.post('/services', (req, res) => {
  const newService = req.body;

  // Validate request data
  if (!newService.Service_Name || !newService.Service_Category) {
    return res.status(400).json({ error: 'Missing required fields: Service_Name, Service_Category' });
  }

  addService(newService, (err, result) => {
    if (err) {
      console.error('Error adding service:', err);
      return res.status(500).json({ error: 'Failed to add service' });
    }
    res.status(201).json({ message: 'Service added', result });
  });
});

// Start the server
const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// City Routes
app.get('/cities', (req, res) => {
  getAllCities((err, results) => {
    if (err) {
      console.error('Error retrieving cities:', err);
      return res.status(500).json({ error: 'Failed to retrieve cities' });
    }
    res.json(results);
  });
});

app.post('/cities', (req, res) => {
  const newCity = req.body;

  // Validate request data
  if (!newCity.City_PIN || !newCity.City_Name || !newCity.City_State || !newCity.City_Country) {
    return res.status(400).json({ error: 'Missing required fields: City_PIN, City_Name, City_State, City_Country' });
  }

  addCity(newCity, (err, result) => {
    if (err) {
      console.error('Error adding city:', err);
      return res.status(500).json({ error: 'Failed to add city' });
    }
    res.status(201).json({ message: 'City added successfully', result });
  });
});

