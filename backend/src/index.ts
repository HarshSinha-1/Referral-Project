import express from 'express';
import config from './configs/config';
import dotenv from 'dotenv';
import path from "path";

// Fix: load .env regardless of dist/ folder
dotenv.config({
  path: path.resolve(__dirname, "../../.env")
});

import { createTables } from './Models/CreateTable';
import {errorHandler} from './middlewares/error.middleware';
import authRoutes from './api/auth/auth.routes';
import session from 'express-session';
import passport from 'passport'; 

import UserRouter from './api/user/user.route';
import './configs/passport-config';  
import cors from "cors";
  // Load environment variables from .env file
const app = express();

app.use(express.json());
app.use(errorHandler);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});
 
// 1. Define ONE CORS config
app.use(cors({
  origin: ['http://localhost:5173',
    "https://referral-project-peach.vercel.app",
    "https://referral-project.onrender.com"

  ], // your frontend URL
  credentials: true,               // allow cookies if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Add CORS preflight handling for all routes
app.options(/.*/, cors());
console.log(config.Session_secret)
app.use(session({
  secret: config.Session_secret,  // Set a secret key for session encryption
  resave: false,
  saveUninitialized: true,
}));


app.use(passport.initialize());  // Initialize Passport.js
app.use(passport.session()); 
 
app.use('/auth', authRoutes);
app.use('/api/user', UserRouter);

createTables();


app.listen(config.port || 3000, () => {
    console.log('Server started at:', config.port || 3000);
  });

export default app;
 