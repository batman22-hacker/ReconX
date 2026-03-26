import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const OtpTimer = ({ email }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleResend = async () => {
    try {
      await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setTimeLeft(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to resend OTP");
    }
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {canResend ? (
        <button onClick={handleResend}>Resend OTP</button>
      ) : (
        <p>Resend in {timeLeft}s</p>
      )}
    </div>
  );
};

export default OtpTimer;