import React, { useState } from "react";

export default function Uploader({ onUploaded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a file");

    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    fd.append("file", file);

    const resp = await fetch("/api/v1/documents", {
      method: "POST",
      headers: {
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
          .content
      },
      body: fd
    });

    if (resp.ok) {
      const json = await resp.json();
      onUploaded(json.document);
      setTitle("");
      setDescription("");
      setFile(null);
    } else {
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 16 }}>
      <h3>Upload new file</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        style={{ display: "block", marginBottom: 8, padding: 6, width: "100%" }}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        style={{
          display: "block",
          marginBottom: 8,
          padding: 6,
          width: "100%",
          height: 60
        }}
      />
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ display: "block", marginBottom: 8 }}
      />
      <button type="submit">Upload</button>
    </form>
  );
}
