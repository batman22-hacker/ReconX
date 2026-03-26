import { useState } from "react";
import OtpInput from "../components/OtpInput";
import OtpTimer from "../components/OtpTimer";

const API_URL = import.meta.env.VITE_API_URL;

const VerifyOtp = () => {
  const [email, setEmail] = useState("");

  const handleVerify = async (otp) => {
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Verified successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("❌ Server error");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Verify OTP</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "250px",
        }}
      />

      <OtpInput onSubmit={handleVerify} />

      <OtpTimer email={email} />
    </div>
  );
};

export default VerifyOtp;