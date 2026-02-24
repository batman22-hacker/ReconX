import React, { useState } from "react";
import axios from "axios";
import "./App.css";

/* ✅ PRODUCTION-READY API LINE */
const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.reload();
    } catch {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const sanitizeDomain = (value) =>
    value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");

  const simulateScan = async (type) => {
    setTerminalLogs([]);

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
            "Booting ReconX...",
            "Resolving DNS...",
            "Executing Recon...",
            "Calculating Threat Score...",
            "Scan Complete.",
          ];

    for (let step of steps) {
      await new Promise((r) => setTimeout(r, 400));
      setTerminalLogs((prev) => [...prev, step]);
    }
  };

  const runDomainScan = async () => {
    if (!domain) return setError("Enter target domain");

    setLoading(true);
    setError("");
    setScanResult(null);

    try {
      await simulateScan("domain");

      const res = await axios.post(
        `${API}/api/scan/full-scan`,
        { domain: sanitizeDomain(domain) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanResult(res.data);
    } catch {
      setError("Domain scan failed.");
    } finally {
      setLoading(false);
    }
  };

  const runEmailScan = async () => {
    if (!email) return setError("Enter email address");

    setLoading(true);
    setError("");
    setScanResult(null);

    try {
      await simulateScan("email");

      const res = await axios.post(
        `${API}/api/email/scan`,
        { email, consent: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setScanResult(res.data);
    } catch {
      setError("Email scan failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>RECONX CYBER OPERATIONS PLATFORM</h1>

      {!isLoggedIn ? (
        <div className="card">
          <h2>Login</h2>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <div className="scan-wrapper">
            <div className="scan-row">
              <input
                className="scan-input"
                placeholder="Enter domain..."
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
              <button onClick={runDomainScan} disabled={loading}>
                FULL RECON
              </button>
            </div>

            <div className="scan-row">
              <input
                className="scan-input"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={runEmailScan} disabled={loading}>
                EMAIL RECON
              </button>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          {terminalLogs.length > 0 && (
            <div className="card terminal">
              {terminalLogs.map((log, i) => (
                <p key={i}>&gt; {log}</p>
              ))}
            </div>
          )}

          {scanResult && (
            <div className="card result">
              <h3>Scan Result</h3>

              <div className="whois-grid">
                <div className="label">Target</div>
                <div className="value">{scanResult.target}</div>

                <div className="label">Scan Type</div>
                <div className="value">{scanResult.scanType}</div>

                <div className="label">Security Score</div>
                <div className="value">
                  {scanResult.securityScore ?? "N/A"}
                </div>

                <div className="label">Risk Level</div>
                <div
                  className={`risk-badge ${scanResult.riskLevel?.toLowerCase()}`}
                >
                  {scanResult.riskLevel || "Unknown"}
                </div>
              </div>

              {scanResult.scanType === "email" && (
                <>
                  <h4 style={{ marginTop: "30px" }}>Email Intelligence</h4>
                  <div className="whois-grid">
                    <div className="label">Breach Count</div>
                    <div className="value">
                      {scanResult.result?.breachData?.count || 0}
                    </div>

                    <div className="label">Disposable</div>
                    <div className="value">
                      {scanResult.result?.disposable ? "Yes" : "No"}
                    </div>

                    <div className="label">MX</div>
                    <div className="value">
                      {scanResult.result?.dnsData?.mxValid
                        ? "Valid"
                        : "Invalid"}
                    </div>

                    <div className="label">SPF</div>
                    <div className="value">
                      {scanResult.result?.dnsData?.spfValid
                        ? "Valid"
                        : "Missing"}
                    </div>

                    <div className="label">DMARC</div>
                    <div className="value">
                      {scanResult.result?.dnsData?.dmarcValid
                        ? "Valid"
                        : "Missing"}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;