import { Card } from "react-bootstrap";

function PipelineLogs({ logs }) {
  return (
    <Card className="p-3 mt-3">
      <h5>Live Pipeline Updates</h5>

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        {logs.map((log, i) => (
          <div
            key={i}
            style={{
              padding: "8px",
              marginBottom: "6px",
              borderRadius: "6px",
              background:
                log.stage === "OCEAN"
                  ? "#e6f0ff"
                  : log.stage === "PROSPEO"
                  ? "#fff3cd"
                  : log.stage === "ENRICHMENT"
                  ? "#f0e6ff"
                  : log.stage === "EMAIL"
                  ? "#e6ffed"
                  : "#f1f1f1"
            }}
          >
            <b>{log.stage}</b> → {log.step}
            <br />
            {log.message}
          </div>
        ))}
      </div>
    </Card>
  );
}

export default PipelineLogs;