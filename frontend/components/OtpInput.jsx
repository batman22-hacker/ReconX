import { motion } from "framer-motion";
import { useState } from "react";

const OtpInput = ({ onSubmit }) => {
  const [otp, setOtp] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: "flex", flexDirection: "column", gap: "10px" }}
    >
      <input
        type="text"
        maxLength="6"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        style={{
          padding: "12px",
          fontSize: "18px",
          textAlign: "center",
          letterSpacing: "6px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSubmit(otp)}
      >
        Verify OTP
      </motion.button>
    </motion.div>
  );
};

export default OtpInput;