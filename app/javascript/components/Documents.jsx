import React, { useEffect, useState } from "react";
import { jsonHeaders } from "../utils/jsonHeaders";
import Uploader from "./Uploader";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  const load = async () => {
    const r = await fetch("/api/v1/documents");
    if (r.ok) {
      const j = await r.json();
      setDocs(j.documents);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!confirm("Delete this file?")) return;
    const r = await fetch(`/api/v1/documents/${id}`, {
      method: "DELETE",
      headers: jsonHeaders()
    });
    if (r.status === 204) setDocs(docs.filter((d) => d.id !== id));
  };

  const share = async (id) => {
    const r = await fetch(`/api/v1/documents/${id}/share`, {
      method: "POST",
      headers: jsonHeaders()
    });
    if (r.ok) {
      const { public_url } = await r.json();
      setDocs(docs.map((d) => (d.id === id ? { ...d, public_url } : d)));
      alert(`New share URL copied:\n${public_url}`);
      try {
        await navigator.clipboard.writeText(public_url);
      } catch {}
    }
  };

  return (
    <div>
      <Uploader onUploaded={(doc) => setDocs([doc, ...docs])} />
      <h3>Your files</h3>
      {docs.length === 0 && <p>No files yet.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {docs.map((d) => (
          <li
            key={d.id}
            style={{ border: "1px solid #ddd", padding: 10, marginBottom: 8 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8
              }}
            >
              <div>
                <strong>{d.title}</strong>
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {d.content_type} • {Math.round(d.byte_size / 1024)} KB{" "}
                  {d.compressed ? "(gzipped)" : ""}
                </div>
                {d.description && (
                  <div style={{ marginTop: 6 }}>{d.description}</div>
                )}
                <div style={{ marginTop: 6 }}>
                  Public URL:{" "}
                  <a href={d.public_url} target="_blank" rel="noreferrer">
                    {d.public_url}
                  </a>
                </div>
              </div>
              <div style={{ whiteSpace: "nowrap" }}>
                <button onClick={() => share(d.id)} style={{ marginRight: 8 }}>
                  Regenerate share URL
                </button>
                <button onClick={() => del(d.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
