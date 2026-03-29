import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        { email, otp }
      );

      alert(res.data.message);

      // ✅ SUCCESS → REDIRECT
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <h2>Verify OTP</h2>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />

      <button type="submit">Verify</button>
    </form>
  );
};

export default VerifyOtp;