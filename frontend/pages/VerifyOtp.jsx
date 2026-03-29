import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      return setError("Email and OTP required");
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          email,
          otp: String(otp).trim(), // 🔥 CRITICAL FIX
        }
      );

      /* ✅ SUCCESS */
      if (res.data.success) {
        alert("✅ Verified! Now login.");
        navigate("/login");
      } else {
        setError(res.data.message || "OTP verification failed");
      }

    } catch (err) {
      console.error("Verify OTP Error:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerify} className="auth-card">
        <h2>Verify OTP</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
          required
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "")) // 🔥 only numbers
          }
          maxLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default VerifyOtp;