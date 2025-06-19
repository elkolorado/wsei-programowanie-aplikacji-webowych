import React, { useState } from "react";

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    if (res.ok) {
      window.location.href = "/"; // cookie is set, just redirect
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on" className="p-4 border rounded shadow-sm bg-white" style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2 className="mb-4 text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label htmlFor="login" className="form-label">Login</label>
        <input
          id="login"
          name="username"
          type="text"
          className="form-control"
          value={login}
          onChange={e => setLogin(e.target.value)}
          placeholder="Login"
          required
          autoComplete="username"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          autoComplete="current-password"
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  );
};

export default LoginForm;