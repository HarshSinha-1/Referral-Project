import pool from './db';
import config from '../configs/config';

// src/Model/createTables.ts

//console.log(pool);

export async function createTables() {
  try {
    // Create the 'users' table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        is_verified BOOLEAN DEFAULT FALSE,
        auth_type VARCHAR(20),
        coins INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the 'user_verification' table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_verification (
        email VARCHAR(255) PRIMARY KEY REFERENCES users(email) ON DELETE CASCADE,
        otp VARCHAR(4)
      );
    `);

    // Create the 'OAUTH_METHOD' table (fixed trailing comma issue)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS OAUTH_METHOD (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        PROVIDER VARCHAR(50) NOT NULL,
        provider_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create the 'user_sessions' table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);
     // create document table 
    await pool.query(`
      CREATE TABLE IF NOT EXISTS referral (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        ReferralCount INTEGER DEFAULT 0,
        referralCode VARCHAR(255) UNIQUE NOT NULL,
        referredby TEXT[] DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (error: any) {
    console.error('Error creating tables:', error.message);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
  }
}
