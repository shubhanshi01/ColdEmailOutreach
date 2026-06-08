function PipelineLogs({ logs }) {
  return (
    <div style={styles.panel}>
      <div style={styles.label}>Live updates</div>
      <div style={styles.logWrap}>
        {logs.length === 0 ? (
          <div style={styles.empty}>Pipeline logs will appear here</div>
        ) : (
          logs.map((msg, i) => (
            <div key={i} style={styles.logItem}>
              <span style={{ ...styles.dot, ...(i === logs.length - 1 ? styles.dotLive : {}) }} />
              <span style={styles.msg}>{msg}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  panel: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" },
  label: { fontSize: 11, fontWeight: 500, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 },
  logWrap: { maxHeight: 200, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 },
  logItem: { fontSize: 12, padding: "6px 10px", borderRadius: 6, display: "flex", alignItems: "center", gap: 8, color: "#555", background: "#fafafa" },
  dot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: "#ccc" },
  dotLive: { background: "#3B6D11", animation: "pulse 1.2s infinite" },
  msg: { lineHeight: 1.5 },
  empty: { fontSize: 13, color: "#bbb", textAlign: "center", padding: "1.5rem 0" },
};

export default PipelineLogs;