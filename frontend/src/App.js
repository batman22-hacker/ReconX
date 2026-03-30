import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "https://reconx-ll7b.onrender.com/api";

function App() {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token"));
  const intervalRef = useRef(null);
  const isLoggedIn = !!token;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  /* ================= OTP VERIFY ================= */

  const verifyOtp = async (otp) => {
    if (!otp) return setError("Enter OTP");

    try {
      const res = await axios.post(`${API}/auth/verify-otp`, {
        email,
        otp,
      });

      if (res.data.success) {
        setError(""); // ✅ clear old error

        // ✅ AUTO LOGIN AFTER OTP
        const loginRes = await axios.post(`${API}/auth/login`, {
          email,
          password,
        });

        const token = loginRes.data.accessToken || loginRes.data.token;

        localStorage.setItem("token", token);
        setToken(token);

        setShowOtp(false);
        setOtpInput("");
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    }
  };

  /* ================= AUTH ================= */

  const handleAuth = async () => {
    if (!email || !password) return setError("Enter credentials");

    try {
      setLoading(true);
      setError("");

      if (mode === "login") {
        // ✅ FIXED LOGIN (email instead of username)
        const res = await axios.post(`${API}/auth/login`, {
          email,
          password,
        });

        const token = res.data.accessToken || res.data.token;

        localStorage.setItem("token", token);
        setToken(token);
      } else {
        await axios.post(`${API}/auth/register`, {
          username,
          email,
          password,
        });

        setShowOtp(true);
        setError("OTP sent to your email");
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          err.response?.data?.message ||
          err.message ||
          "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setScanResult(null);
    setTerminalLogs([]);
  };

  return (
    <>
      <div className="navbar">
        <div className="logo">RECONX CYBER OPS</div>
        {isLoggedIn && (
          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        )}
      </div>

      <div className="container">
        <h1>RECONX CYBER OPERATIONS PLATFORM</h1>

        {!isLoggedIn ? (
          <div className="card auth-card">

            {showOtp ? (
              <>
                <h2>Verify OTP</h2>

                <input
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  placeholder="Enter OTP"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                />

                <button onClick={() => verifyOtp(otpInput)}>
                  Verify OTP
                </button>

                {error && <p className="error">{error}</p>}
              </>
            ) : (
              <>
                <h2>{mode === "login" ? "Login" : "Register"}</h2>

                {/* ✅ FIXED EMAIL INPUT */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                {mode === "register" && (
                  <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                )}

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleAuth} disabled={loading}>
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Login"
                    : "Register"}
                </button>

                {error && <p className="error">{error}</p>}

                <p
                  style={{ marginTop: "15px", cursor: "pointer" }}
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                >
                  {mode === "login"
                    ? "No account? Register"
                    : "Already have account? Login"}
                </p>
              </>
            )}

          </div>
        ) : (
          <h2 style={{ textAlign: "center" }}>
            ✅ Logged In Successfully
          </h2>
        )}
      </div>
    </>
  );
}

export default App;