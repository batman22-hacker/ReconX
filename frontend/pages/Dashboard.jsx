{isLoggedIn && (
  <>
    <button className="logout-btn" onClick={handleLogout}>
      Logout
    </button>

    <div className="dashboard-grid">

      {/* Stats Cards */}
      <div className="card stat-card">
        <h3>Total Scans</h3>
        <p>{scanResult ? 1 : 0}</p>
      </div>

      <div className="card stat-card">
        <h3>Email Scans</h3>
        <p>{scanResult?.scanType === "email" ? 1 : 0}</p>
      </div>

      <div className="card stat-card">
        <h3>Domain Scans</h3>
        <p>{scanResult?.scanType === "full" ? 1 : 0}</p>
      </div>

      <div className="card stat-card">
        <h3>Risk Level</h3>
        {scanResult?.riskLevel ? (
          <span className={`risk-badge ${scanResult.riskLevel.toLowerCase()}`}>
            {scanResult.riskLevel}
          </span>
        ) : (
          <p>—</p>
        )}
      </div>

    </div>

    {/* Scan Section */}
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
          value={scanEmail}
          onChange={(e) => setScanEmail(e.target.value)}
        />
        <button onClick={runEmailScan} disabled={loading}>
          EMAIL RECON
        </button>
      </div>

    </div>

    {/* Terminal */}
    {terminalLogs.length > 0 && (
      <div className="card terminal">
        {terminalLogs.map((log, i) => (
          <p key={i}>&gt; {log}</p>
        ))}
      </div>
    )}

    {/* Result */}
    {scanResult && (
      <div className="card result">
        <h3>Scan Result</h3>

        <p><strong>Target:</strong> {scanResult.target}</p>
        <p><strong>Security Score:</strong> {scanResult.securityScore}</p>

        <span className={`risk-badge ${scanResult.riskLevel?.toLowerCase()}`}>
          {scanResult.riskLevel}
        </span>

        <pre>
          {JSON.stringify(scanResult.result, null, 2)}
        </pre>
      </div>
    )}
  </>
)}