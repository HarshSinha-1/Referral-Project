# 🚀 Referral Rewards Platform  
A full-stack **Refer & Earn** platform built using **React + Node.js + PostgreSQL**, supporting secure authentication, referral-based coin rewards, and OAuth (coming soon).  
Both **backend** and **frontend** are live on Render.

---

# ✨ Features

## 🧑‍💼 User Authentication  
✔ Sign Up with email & password  
✔ Sign In with secure JWT Authentication  
✔ Protected routes using JWT  
✔ Email-less signup (direct login allowed)  
✔ OAuth (Google & GitHub) integration **coming soon**  

---

## 🎁 Referral System  
### 🎉 **Referral Rewards Logic**
- Each user can **generate a unique referral code**.
- A user **cannot use their own code**.
- A user can apply **up to 5 referral codes total**.
- When someone uses your referral code:
  - **Referrer earns: 100 Coins**
  - **Referee (user applying the code) earns: 50 Coins**

### 📌 Key Rules
- Referral code must be valid.
- Referral code cannot be used more than **5 times** by the same user.  
- A referral entry is created for every user during signup.

---

## 📊 User Dashboard  
✔ Shows user profile  
✔ Shows earned coins  
✔ Shows referral code section  
✔ Generate referral code  
✔ Copy referral code  
✔ Navigate to “Use Referral” page  

---

## 🔐 Secure Backend  
- JWT-based authentication  
- Secure protected routes  
- PostgreSQL for permanent storage  
- Strong validation on referral operations  
- Clean MVC structure  
- Passport OAuth support (coming soon)  

---

# 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind/MUI, React Router |
| **Backend** | Node.js, Express.js, PostgreSQL, JWT |
| **Database** | PostgreSQL (Render hosted) |
| **Auth** | JWT, Email OTP (optional), OAuth coming soon |
| **Deployment** | Render (Frontend + Backend) |

---

# 🌐 Live Demo URLs  :  https://referral-project-gl81.onrender.com/

### 🔥 **Backend URL (if BE sleeped)** :   https://referral-project.onrender.com/
