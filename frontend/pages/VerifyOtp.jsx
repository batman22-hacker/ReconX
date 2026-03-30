import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState(""); // 🔥 needed for auto login
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // ✅ STEP 1: VERIFY OTP
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { email, otp }
      );

      console.log("VERIFY RESPONSE:", res.data);

      if (res.data.success || res.data.message === "OTP verified successfully") {

        // ✅ STEP 2: AUTO LOGIN
        const loginRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          {
            email,
            password,
          }
        );

        const token = loginRes.data.token || loginRes.data.accessToken;

        if (!token) throw new Error("Token not received");

        // ✅ SAVE TOKEN
        localStorage.setItem("token", token);

        // ✅ REDIRECT TO DASHBOARD
        navigate("/dashboard"); // change if your route different

      } else {
        setError(res.data.message || "OTP verification failed");
      }

    } catch (err) {
      console.error("VERIFY ERROR:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Server error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerify} className="auth-card">
        <h2>Verify OTP</h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD (needed for auto login) */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* OTP */}
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {error && !loading && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
};

export default VerifyOtp;