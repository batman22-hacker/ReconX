import { useState, useRef } from "react";
import axios from "axios";

export default function OtpVerify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setMsg("");

      const finalOtp = otp.join("");

      const res = await axios.post(
        "https://reconx-ll7b.onrender.com/api/auth/verify-otp",
        { email, otp: finalOtp }
      );

      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔐 Verify OTP</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.email}
      />

      <div style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => (inputs.current[index] = el)}
            onChange={(e) => handleChange(e.target.value, index)}
            style={styles.otpBox}
          />
        ))}
      </div>

      <button onClick={handleVerify} style={styles.button} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      {msg && <p style={styles.msg}>{msg}</p>}
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  },

  title: {
    marginBottom: "20px",
    fontSize: "28px",
    letterSpacing: "1px",
  },

  email: {
    padding: "12px",
    width: "280px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    textAlign: "center",
  },

  otpContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  otpBox: {
    width: "45px",
    height: "50px",
    fontSize: "22px",
    textAlign: "center",
    borderRadius: "8px",
    border: "2px solid #0ea5e9",
    background: "#020617",
    color: "#fff",
    outline: "none",
    transition: "0.2s",
  },

  button: {
    padding: "12px 30px",
    background: "#0ea5e9",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  msg: {
    marginTop: "15px",
    color: "#22c55e",
  },
};