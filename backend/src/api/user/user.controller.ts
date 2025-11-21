import axios from 'axios';
import pg from 'pg'
import { Request, Response } from 'express';
import pool from '../../Models/db';
import { generateRandomCode } from '../../utils/utils';

export async function getUserProfile(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user.id;
  try {
    const response = await pool.query('SELECT id, username, email, coins, auth_type, created_at FROM users WHERE id = $1', [userId]);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error'});
  }
}

export async function generateReferralCode(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user.id;
  //console.log("Generating referral code for user ID:", userId);

  try {  
  // 1️⃣ First check if user already has a referral record
    const existingReferral = await pool.query(
      `SELECT referralCode FROM referral WHERE user_id = $1`,
      [userId]
    );

    if (existingReferral.rows.length > 0) {
      // User already has a code → return it
      return res.status(200).json({
        message: "Referral code already exists",
        referralCode: existingReferral.rows[0].referralcode
      });
    }

    // 2️⃣ Generate a UNIQUE referral code
    let newCode: string;
    let isUnique = false;

    while (!isUnique) {
      newCode = generateRandomCode(8); // 8-char alpha-numeric
      const checkCode = await pool.query(
        `SELECT id FROM referral WHERE referralCode = $1`,
        [newCode]
      );
      if (checkCode.rows.length === 0) {
        isUnique = true;
      }
    }


    // 3️⃣ Insert new code into database
    const insertReferral = await pool.query(
      `INSERT INTO referral (user_id, referralCode)
       VALUES ($1, $2)
       RETURNING *`,
       //@ts-ignore
      [userId, newCode]
    );


    return res.status(200).json({
      message: "Referral code generated successfully",
      //@ts-ignore
      referralCode: newCode,
      data: insertReferral.rows[0]
    });


  } catch (error) {
    console.error("Error generating referral code:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


export async function useRefreealcode(req: Request, res: Response) {
  //@ts-ignore
  const userId = req.user.id;    
  const { referralCode } = req.body;

  try {
    // 1. Check referral code exists
    const referralCheck = await pool.query(
      'SELECT * FROM referral WHERE referralCode = $1',
      [referralCode]
    );

    if (referralCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid referral code' });
    }
    
    
    const refOwner = referralCheck.rows[0];
    const ownerName = refOwner.username;


    // 2. Check if user is trying to use their own code
    if (refOwner.user_id === userId) {
      return res.status(400).json({ message: 'Cannot use your own referral code' });
    }


    // 3. Check if the user already has a referral entry
    const userReferral = await pool.query(
      'SELECT * FROM referral WHERE user_id = $1',
      [userId]
    );

    if (userReferral.rows.length === 0) {
      return res.status(400).json({ message: 'User referral record not found !! First generate the referall code.' });
    }              

    const currentUserReferral = userReferral.rows[0];

    // ❗ NEW CHECK — Has the user already used this same referral code?
      if (currentUserReferral.referredby.includes(referralCode)) {
        return res.status(400).json({
          message: 'You have already used this referral code before.',
        });
    }


    // Check if user already used a referral
    if (currentUserReferral.referredby.length > 5) {
      return res.status(400).json({ message: 'Referral Code had reached the share limit.! \n Use Other Referral code.' });
    }


    // 4. UPDATE user's referredBy list (push referralCode)
    await pool.query(
      `UPDATE referral 
       SET referredBy = array_append(referredby, $1)
       WHERE user_id = $2`,
      [referralCode, userId]
    );


    // 5. Increment the referral count of the referrer
    await pool.query(
      `UPDATE referral 
       SET ReferralCount = ReferralCount + 1
       WHERE user_id = $1`,
      [refOwner.user_id]
    );


    // 6. OPTIONAL: Add 100 coin to the referrer
    await pool.query(
      `UPDATE users 
       SET coins = coins + 100 
       WHERE id = $1`,
      [refOwner.user_id]
    );

    // 7. OPTIONAL: Add 50 coin to the referee
    await pool.query(
      `UPDATE users 
       SET coins = coins + 50 
       WHERE id = $1`,
      [userId]
    );


    return res.json({
      message: 'Referral applied successfully',
      appliedCode: referralCode,
      ownerName: ownerName
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
}
