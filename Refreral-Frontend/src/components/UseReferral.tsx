import { useState } from "react";
import { Coins, Loader2, CheckCircle, ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReferralSuccess {
  appliedCode: string;
  ownerName: string;
}

export default function UseReferral() {
  const navigate = useNavigate();

  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [success, setSuccess] = useState<ReferralSuccess | null>(null);
  const [showCoins, setShowCoins] = useState(false);

  const applyReferral = async () => {
    if (!referralCode.trim()) {
      setToast("Please enter a referral code!");
      setTimeout(() => setToast(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setToast("");

      const token = localStorage.getItem("token");
      if (!token) return navigate("/signin");

      const response = await fetch(
        "https://referral-project.onrender.com//api/user/use-referral-code",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ referralCode }),
        }
      );

      const data: ReferralSuccess | { message: string } = await response.json();

      if (!response.ok) {
        setToast((data as { message: string }).message || "Something went wrong");
        setTimeout(() => setToast(""), 3500);
        return;
      }

      // SUCCESS
      setSuccess(data as ReferralSuccess);

      setShowCoins(true);
      setTimeout(() => setShowCoins(false), 2500);

      setToast("Referral applied 🎉 Coins added!");
      setTimeout(() => setToast(""), 4000);
    } catch {
      setToast("Server error. Please try again.");
      setTimeout(() => setToast(""), 3500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 text-white p-8 flex flex-col items-center pt-24">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 bg-white text-orange-700 px-6 py-3 rounded-xl shadow-xl font-semibold animate-fadeIn">
          {toast}
        </div>
      )}

      {/* Coin Animation */}
      {showCoins && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(20)].map((_, i) => (
            <Coins
              key={i}
              className="absolute text-yellow-300 animate-coin-burst"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white/20 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/30 max-w-xl w-full text-center mt-10">

        <button
          onClick={() => navigate("/dashboard")}
          className="text-white flex items-center gap-2 mb-6 hover:opacity-90 transition mx-auto"
        >
          <ArrowLeft /> Back to Dashboard
        </button>

        <h1 className="text-4xl font-black drop-shadow mb-2">Apply Referral Code</h1>
        <p className="text-orange-100 mb-6 text-lg">
          Enter a referral code to earn instant bonus coins!
        </p>

        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="w-full px-5 py-3 rounded-xl bg-white/30 text-white placeholder-white/70 border border-white/40 focus:ring-2 focus:ring-yellow-300"
        />

        <button
          onClick={applyReferral}
          disabled={loading}
          className="mt-6 bg-white text-orange-600 font-bold text-lg px-10 py-4 rounded-xl shadow-xl hover:bg-orange-100 transition flex items-center gap-3 mx-auto disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              Apply Now <Sparkles className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Success Card */}
        {success && (
          <div className="mt-10 p-6 bg-black/20 border border-white/20 rounded-xl shadow-xl">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />

            <h2 className="text-3xl font-bold mb-2">Success!</h2>

            <p className="text-orange-100 text-lg">
              Referral applied:{" "}
              <span className="font-bold text-yellow-300">{success.appliedCode}</span>
            </p>

            <p className="mt-2 text-orange-50">
              Referred by <span className="font-bold">{success.ownerName}</span>.
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-xl font-bold text-yellow-300">
              <Coins className="w-6 h-6" /> +50 Coins Earned!
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes coin-burst {
          0% { transform: translateY(0) scale(0.4); opacity: 1; }
          100% { transform: translateY(-300px) scale(1.2); opacity: 0; }
        }
        .animate-coin-burst { animation: coin-burst 1.5s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
