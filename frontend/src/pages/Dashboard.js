import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fetchDashboardData = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setDashboardData(data.data);
      } else {
        // Token might be expired - let ProtectedRoute handle redirect
        setError("Session expired. Please login again.");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ProtectedRoute already ensures we have a token
    const token = localStorage.getItem("token");
    fetchDashboardData(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ fontSize: "1.2rem", color: "#666" }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ color: "#d32f2f", fontSize: "1.2rem" }}>{error}</div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            borderBottom: "1px solid #eee",
            paddingBottom: "1rem",
          }}
        >
          <h1 style={{ color: "#333", margin: 0 }}>
            Welcome to your Dashboard!
          </h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#d32f2f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            Logout
          </button>
        </div>

        {user && (
          <div style={{ marginBottom: "2rem" }}>
            <h2 style={{ color: "#333", marginBottom: "1rem" }}>
              Your Profile
            </h2>
            <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "1rem",
                borderRadius: "4px",
                border: "1px solid #eee",
              }}
            >
              <p style={{ margin: "0.5rem 0", color: "#555" }}>
                <strong>Email:</strong> {user.email}
              </p>
              <p style={{ margin: "0.5rem 0", color: "#555" }}>
                <strong>User ID:</strong> {user.id}
              </p>
              {dashboardData?.userCreatedAt && (
                <p style={{ margin: "0.5rem 0", color: "#555" }}>
                  <strong>Member since:</strong>{" "}
                  {new Date(dashboardData.userCreatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {dashboardData && (
          <div>
            <h2 style={{ color: "#333", marginBottom: "1rem" }}>
              App Statistics
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "1rem",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "#1976d2",
                  }}
                >
                  {dashboardData.totalUsers}
                </div>
                <div style={{ color: "#666", fontSize: "0.9rem" }}>
                  Total Users
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
