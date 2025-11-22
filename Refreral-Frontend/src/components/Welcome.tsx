// import React from "react";
import { ArrowRight, Star, Gift, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReferralLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-500 text-white">

      {/* Header */}
      <header className="px-8 py-6 flex justify-between items-center bg-black/20 backdrop-blur-md">
        <h1 className="text-3xl font-bold tracking-tight cursor-pointer" onClick={() => navigate("/")}>
          Refer & Earn
        </h1>

        <button
          onClick={() => navigate("/signin")}
          className="border-2 border-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition"
        >
          Login
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-32">
        <h2 className="text-6xl md:text-7xl font-black leading-tight drop-shadow-xl">
          Earn Rewards <br /> By Inviting Your Friends
        </h2>

        <p className="text-orange-100 text-xl mt-6 max-w-2xl">
          Share your referral code, invite your friends, and earn coins instantly.
          No limits, no complications — just rewards.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">

          {/* Start Now → Sign In */}
          <button
            onClick={() => navigate("/signin")}
            className="bg-white text-orange-600 px-10 py-4 rounded-lg font-bold text-lg shadow-2xl hover:scale-105 transition flex items-center"
          >
            Start Now
            <ArrowRight className="ml-2 w-6 h-6" />
          </button>

          {/* Learn More → Scroll or Route */}
          <button
            onClick={() => {
              const featuresSection = document.getElementById("features-section");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="border-2 border-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition flex items-center"
          >
            Learn More
            <Star className="ml-3 w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="bg-white text-slate-800 py-28 px-8">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h3 className="text-5xl font-black mb-4">How It Works</h3>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto">
            A simple 3-step referral system built to reward you fairly.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="bg-orange-50 p-10 rounded-xl border border-orange-200 shadow hover:scale-105 transition">
            <div className="bg-orange-600 p-4 w-fit rounded-lg mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Invite Friends</h4>
            <p className="text-slate-600">Share your referral code anywhere — WhatsApp, Instagram, or SMS.</p>
          </div>

          <div className="bg-orange-50 p-10 rounded-xl border border-orange-200 shadow hover:scale-105 transition">
            <div className="bg-orange-600 p-4 w-fit rounded-lg mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-3">They Sign Up</h4>
            <p className="text-slate-600">Your friends join the platform using your referral code.</p>
          </div>

          <div className="bg-orange-50 p-10 rounded-xl border border-orange-200 shadow hover:scale-105 transition">
            <div className="bg-orange-600 p-4 w-fit rounded-lg mb-6">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Earn Coins</h4>
            <p className="text-slate-600">You instantly earn coins which you can redeem later.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-16 text-center text-slate-300 text-lg">
        Built with ❤️ • Refer & Earn Platform 2025
      </footer>

    </div>
  );
}
