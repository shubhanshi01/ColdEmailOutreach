import { useState, useEffect } from "react";
import PipelineLogs from "./PipelineLogs";
import ReviewPanel from "./ReviewPanel";

function Chatbot() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/api/logs");
    eventSource.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };
    eventSource.onerror = () => console.log("Log stream disconnected");
    return () => eventSource.close();
  }, []);

  const runPipeline = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setLogs([]);
    setPreview(null);

    try {
      const res = await fetch("http://localhost:5000/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (data.data?.requiresApproval) {
        setPreview(data.data);
      } else {
        setLogs((prev) => [...prev, "Pipeline failed: " + (data.message || "unknown error")]);
      }
    } catch (err) {
      setLogs((prev) => [...prev, "Server error: " + err.message]);
    } finally {
      setLoading(false);
    }
  };

  const sendEmails = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: preview?.runId,
          outreachPreview: preview?.outreachPreview,
        }),
      });
      const data = await res.json();
      setLogs((prev) => [...prev, data.message || "Emails sent!"]);
      setPreview(null);
    } catch (err) {
      setLogs((prev) => [...prev, "Send failed: " + err.message]);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logoBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="2"/><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="M12 2a10 10 0 0 0-7.38 16.75"/><path d="M12 22a10 10 0 0 0 5.26-1.5"/><path d="M12 22a10 10 0 0 1-5.26-1.5"/>
            </svg>
          </div>
          <div>
            <div style={styles.title}>Outreach Pipeline</div>
            <div style={styles.subtitle}>B2B lookalike enrichment → email dispatch</div>
          </div>
        </div>

        {/* Input */}
        <div style={styles.panel}>
          <div style={styles.panelLabel}>Seed domain</div>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder="e.g. stripe.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && runPipeline()}
            />
            <button
              style={{ ...styles.btn, ...styles.btnPrimary, opacity: loading ? 0.6 : 1 }}
              onClick={runPipeline}
              disabled={loading}
            >
              {loading ? <Spinner /> : (
                <>
                  <PlayIcon /> Run pipeline
                </>
              )}
            </button>
          </div>
        </div>

        {/* Logs */}
        <PipelineLogs logs={logs} />

        {/* Review */}
        {preview && (
          <ReviewPanel
            preview={preview}
            onSend={sendEmails}
            onCancel={() => setPreview(null)}
            senderEmail={process.env.REACT_APP_SENDER_EMAIL}
          />
        )}

      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f7f7f5", padding: "2rem 1rem", fontFamily: "system-ui, -apple-system, sans-serif" },
  container: { maxWidth: 900, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" },
  logoBox: { width: 36, height: 36, borderRadius: 8, background: "#fff", border: "0.5px solid #ddd", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" },
  title: { fontSize: 18, fontWeight: 500, color: "#111" },
  subtitle: { fontSize: 13, color: "#888", marginTop: 2 },
  panel: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" },
  panelLabel: { fontSize: 11, fontWeight: 500, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 },
  inputRow: { display: "flex", gap: 8 },
  input: { flex: 1, fontSize: 14, padding: "8px 12px", borderRadius: 8, border: "0.5px solid #ddd", background: "#fafafa", color: "#111", outline: "none" },
  btn: { fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 8, border: "0.5px solid #ddd", background: "#fff", color: "#111", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" },
  btnPrimary: { background: "#111", color: "#fff", border: "none" },
};

function Spinner() {
  return (
    <span style={{ width: 14, height: 14, border: "2px solid transparent", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5,3 19,12 5,21"/>
    </svg>
  );
}

export default Chatbot;