import React, { useState } from "react";
import { jsonHeaders } from "../utils/jsonHeaders";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const path = mode === "login" ? "/users/sign_in" : "/users";
    const resp = await fetch(path, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ user: { email, password } })
    });
    if (resp.ok) window.location.reload();
    else alert("Auth failed");
  };

  return (
    <div
      style={{ maxWidth: 400, margin: "40px auto", fontFamily: "system-ui" }}
    >
      <h1>File Vault</h1>
      <p>{mode === "login" ? "Login" : "Register"}</p>
      <form onSubmit={submit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          {mode === "login" ? "Login" : "Create account"}
        </button>
        <button
          type="button"
          style={{ marginLeft: 8, padding: "8px 12px" }}
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Or, Register" : "Or, Login"}
        </button>
      </form>
    </div>
  );
}
