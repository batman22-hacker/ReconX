import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [domain, setDomain] = useState("");
  const [scanEmail, setScanEmail] = useState("");

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

  /* ================= TERMINAL ================= */

  const simulateScan = (type) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    const steps =
      type === "email"
        ? [
            "Booting Email OSINT Engine...",
            "Checking breach databases...",
            "Validating MX records...",
            "Analyzing SPF / DMARC...",
            "Calculating Risk Profile...",
            "Email Recon Complete.",
          ]
        : [
            "Booting ReconX Engine...",
            "Resolving DNS...",
            "Running WHOIS Intelligence...",
            "Analyzing Security Headers...",
            "Calculating Threat Score...",
            "Recon Complete.",
          ];

    setTerminalLogs([]);
    let index = 0;

    intervalRef.current = setInterval(() => {
      setTerminalLogs((prev) => [...prev, steps[index]]);
      index++;
      if (index >= steps.length) clearInterval(intervalRef.current);
    }, 500);
  };

  /* ================= AUTH ================= */

  const handleAuth = async () => {
    if (!username || !password) return setError("Enter credentials");

    try {
      setLoading(true);
      setError("");

      if (mode === "login") {
        const res = await axios.post(`${API}/api/auth/login`, {
          username,
          password,
        });

        const receivedToken =
          res.data.accessToken || res.data.token;

        if (!receivedToken) throw new Error("Token not received");

        localStorage.setItem("token", receivedToken);
        setToken(receivedToken);
      } else {
        await axios.post(`${API}/api/auth/register`, {
          username,
          email,
          password,
        });

        setMode("login");
        setError("Registration successful. Please login.");
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

  /* ================= SCANS ================= */

  const runDomainScan = async () => {
    if (!domain) return setError("Enter domain");
    if (!token) return setError("Login required");

    try {
      setLoading(true);
      setError("");
      simulateScan("domain");

      const res = await axios.post(
        `${API}/api/scan/full-scan`,
        { domain },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanResult(res.data);
    } catch (err) {
      setError("Domain scan failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
            <h2>{mode === "login" ? "Login" : "Register"}</h2>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {mode === "register" && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              style={{ marginTop: "20px", width: "100%" }}
              onClick={handleAuth}
              disabled={loading}
            >
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
          </div>
        ) : (
          <>
            <div className="card">
              <div className="scan-row">
                <input
                  placeholder="Enter domain..."
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                />
                <button onClick={runDomainScan} disabled={loading}>
                  FULL RECON
                </button>
              </div>

              {error && <p className="error">{error}</p>}
            </div>

            {terminalLogs.length > 0 && (
              <div className="result-box">
                {terminalLogs.map((log, i) => (
                  <p key={i}>&gt; {log}</p>
                ))}
              </div>
            )}

            {scanResult && (
              <div className="result-box">
                <h3>Recon Intelligence Report</h3>

                <p><strong>Target:</strong> {scanResult.target}</p>

                {/* WHOIS */}
                {scanResult.result?.whois && (
                  <>
                    <h4>WHOIS Intelligence</h4>
                    <div className="whois-grid">
                      <div>
                        <strong>Registrar</strong>
                        <p>{scanResult.result.whois.registrar}</p>
                      </div>
                      <div>
                        <strong>Created</strong>
                        <p>{scanResult.result.whois.creationDate}</p>
                      </div>
                      <div>
                        <strong>Expires</strong>
                        <p>{scanResult.result.whois.registrarRegistrationExpirationDate}</p>
                      </div>
                      <div>
                        <strong>Organization</strong>
                        <p>{scanResult.result.whois.registrantOrganization}</p>
                      </div>
                      <div>
                        <strong>Country</strong>
                        <p>{scanResult.result.whois.registrantCountry}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* HEADERS */}
                {scanResult.result?.headers && (
                  <>
                    <h4 style={{ marginTop: "30px" }}>
                      Security Headers Analysis
                    </h4>

                    <div className="headers-grid">
                      {Object.entries(scanResult.result.headers).map(
                        ([key, value]) => (
                          <div key={key}>
                            <strong>{key}</strong>
                            <p className={value ? "secure" : "insecure"}>
                              {value ? "Present" : "Missing"}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;