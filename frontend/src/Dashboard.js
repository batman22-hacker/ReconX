function Dashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>ReconX Dashboard</h1>
      <p>Welcome! You are logged in.</p>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
