import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) navigate("/");
        else setError(res.message);
      } else {
        await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
          role,
        });
        const res = await login(email, password);
        if (res.success) navigate("/");
        else setError(res.message);
      }
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      <div className="glass-panel" style={{ width: "100%", maxWidth: "400px" }}>
        <h2
          style={{
            textAlign: "center",
            color: "var(--primary)",
            marginBottom: "24px",
          }}
        >
          RentBreaker {isLogin ? "Login" : "Register"}
        </h2>
        {error && (
          <div
            style={{
              color: "var(--danger)",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Staff">Staff</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "16px" }}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div
          style={{
            textAlign: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
          }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
};

export default Login;
