import { useState, useEffect } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";
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
      setLogs((prev) => [
        ...prev,
        {
          stage: "PIPELINE",
          step: "LIVE",
          message: event.data
        }
      ]);
    };

    eventSource.onerror = () => {
      console.log("Log stream disconnected");
    };

    return () => eventSource.close();
  }, []);

  /*
   * RUN PIPELINE
   */
  const runPipeline = async () => {
    setLoading(true);
    setLogs([]);
    setPreview(null);

    try {
      const res = await fetch("http://localhost:5000/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain })
      });

      const data = await res.json();

      setLoading(false);

      if (data.data?.requiresApproval) {
        setPreview(data.data);
      } else {
        alert(data?.message || "Pipeline failed");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert("Server error while running pipeline");
    }
  };

  /*
   * SEND EMAILS
   */
  const sendEmails = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          runId: preview?.runId,
          outreachPreview: preview?.outreachPreview
        })
      });

      const data = await res.json();

      alert(data.message);
      setPreview(null);
    } catch (err) {
      console.error(err);
      alert("Failed to send emails");
    }
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Card style={{ width: "80%" }} className="p-3 shadow">

        <h4>Pipeline Dashboard</h4>

        {/* INPUT */}
        <Form.Control
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <Button className="mt-2" onClick={runPipeline} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Run Pipeline"}
        </Button>

        {/* LIVE LOGS */}
        <PipelineLogs logs={logs} />

        {/* REVIEW SCREEN */}
        <ReviewPanel
          preview={preview}
          onSend={sendEmails}
          onCancel={() => setPreview(null)}
        />

      </Card>
    </div>
  );
}

export default Chatbot;