import React from "react"
import { useProfile } from "../hooks/useProfile";
import { jsonHeaders } from "../utils/jsonHeaders";
import Auth from "./Auth";
import Documents from "./Documents";

export default function App() {
  const { profile, isLoading } = useProfile();

  if (isLoading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!profile) return <Auth />;

  const signOut = async () => {
    await fetch("/users/sign_out", {
      method: "DELETE",
      headers: jsonHeaders()
    });
    window.location.reload();
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "20px auto",
        padding: "0 12px",
        fontFamily: "system-ui"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>File Vault</h2>
        <div>
          Signed in as <strong>{profile.email}</strong>
          <button onClick={signOut} style={{ marginLeft: 8 }}>
            Sign out
          </button>
        </div>
      </div>
      <Documents />
    </div>
  );
}
