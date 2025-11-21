import React, { useState, useEffect } from "react";
import {
  Copy,
  CheckCircle,
  Coins,
  Loader2,
  ArrowRight,
  User,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function Dashboard() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");

  // 🪙 Coin drop animation
  const dropCoins = () => {
    for (let i = 0; i < 12; i++) {
      const coin = document.createElement("div");
      coin.innerHTML = "🪙";
      coin.style.position = "fixed";
      coin.style.left = Math.random() * window.innerWidth + "px";
      coin.style.top = "-50px";
      coin.style.fontSize = "32px";
      coin.style.animation = "coinFall 2.2s ease-out forwards";
      document.body.appendChild(coin);

      setTimeout(() => coin.remove(), 2500);
    }
  };

  // 🎉 Confetti Animation
  const fireConfetti = () => {
    confetti({
      particleCount: 140,
      spread: 90,
      startVelocity: 45,
      gravity: 1,
      origin: { y: 0.6 },
    });
  };

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          window.location.href = "/signin";
          return;
        }

        const response = await fetch("https://referral-project.onrender.com/api/user/info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user info");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        window.location.href = "/signin";
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Generate referral code
  const generateReferral = async () => {
    try {
      setReferralLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/signin";
        return;
      }

      const response = await fetch(
        "https://referral-project.onrender.com/api/user/getReferral-code",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to generate referral code");

      setReferralCode(data.referralCode);

      // 🔥 Show toast + animations
      setToast("Referral code generated successfully!");
      fireConfetti();
      dropCoins();

      setTimeout(() => setToast(""), 3000);
    } catch (err: any) {
      setToast(err?.message || "Something went wrong while generating code");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setReferralLoading(false);
    }
  };

  // Copy referral code
  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white text-xl font-bold">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );

  return (
    <>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes coinFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }

          @keyframes glowPulse {
            0% { box-shadow: 0 0 10px rgba(255, 200, 120, 0.3); }
            50% { box-shadow: 0 0 28px rgba(255, 200, 120, 0.8); }
            100% { box-shadow: 0 0 10px rgba(255, 200, 120, 0.3); }
          }

          .animate-glow {
            animation: glowPulse 2.5s infinite ease-in-out;
          }
        `}
      </style>

      <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 text-white p-8 font-sans">
        {/* Toast */}
        {toast && (
          <div className="fixed top-6 right-6 bg-white text-orange-600 px-6 py-3 rounded-xl shadow-xl font-semibold animate-fadeIn z-50">
            {toast}
          </div>
        )}

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black tracking-tight drop-shadow-lg flex items-center gap-2">
            <User className="w-10 h-10" /> Dashboard
          </h1>

          <button
            onClick={() => (window.location.href = "/")}
            className="bg-white text-orange-600 px-5 py-2 font-bold rounded-lg shadow-xl hover:bg-orange-100 transition"
          >
            Home
          </button>
        </header>

        {/* User Card */}
        <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-6 drop-shadow">
            Welcome, {user?.username}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-orange-50">
            <div className="bg-black/20 p-6 rounded-xl border border-white/20 shadow-xl">
              <p className="text-sm opacity-80">Email</p>
              <p className="text-xl font-bold break-all">{user?.email}</p>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-white/20 shadow-xl">
              <p className="text-sm opacity-80">Coins</p>
              <div className="flex items-center gap-2 text-xl font-bold">
                <Coins className="w-6 h-6 text-yellow-300" /> {user?.coins}
              </div>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-white/20 shadow-xl">
              <p className="text-sm opacity-80">User ID</p>
              <p className="text-xl font-bold">{user?.id}</p>
            </div>

            <div className="bg-black/20 p-6 rounded-xl border border-white/20 shadow-xl">
              <p className="text-sm opacity-80">Auth Type</p>
              <p className="text-xl font-bold">{user?.auth_type}</p>
            </div>
          </div>
        </div>

        {/* Referral Section */}
        <div className="mt-12 max-w-3xl mx-auto bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 text-center">
          <h3 className="text-3xl font-black mb-4">Your Referral Rewards</h3>
          <p className="text-orange-100 mb-6 text-lg">
            Invite your friends and earn instant coins!
          </p>

          {!referralCode ? (
            <>
              {/* Generate referral */}
              <button
                onClick={generateReferral}
                disabled={referralLoading}
                className="bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl shadow-xl hover:bg-orange-100 transition flex items-center gap-3 mx-auto disabled:opacity-50"
              >
                {referralLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    Generate Referral Code <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Use referral */}
              <button
                onClick={() => (window.location.href = "/use-referral")}
                className="mt-6 bg-white/30 text-white border border-white/40 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-white/40 backdrop-blur-md transition flex items-center gap-3 mx-auto"
              >
                Use Referral Code
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <div className="mt-6 bg-black/20 border border-white/20 p-6 rounded-xl shadow-xl animate-glow">
                <p className="text-xl opacity-80 mb-2">Your Code:</p>
                <p className="text-4xl font-extrabold tracking-widest bg-gradient-to-r from-yellow-300 to-orange-300 text-transparent bg-clip-text">
                  {referralCode}
                </p>

                <button
                  onClick={copyCode}
                  className="mt-4 bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold shadow-xl hover:bg-orange-100 transition flex items-center gap-2 mx-auto"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" /> Copy Code
                    </>
                  )}
                </button>
              </div>

              {/* Use referral */}
              <button
                onClick={() => (window.location.href = "/use-referral")}
                className="mt-6 bg-white/30 text-white border border-white/40 px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-white/40 backdrop-blur-md transition flex items-center gap-3 mx-auto"
              >
                Use Referral Code
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
