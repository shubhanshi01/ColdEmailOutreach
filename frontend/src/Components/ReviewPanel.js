import { Card, Button, Table } from "react-bootstrap";

function ReviewPanel({ preview, onSend, onCancel }) {
  if (!preview) return null;

  return (
    <Card className="p-3 mt-3 border-success">
      <h5>Review Before Sending Emails</h5>

      <p>
        Companies: <b>{preview.companies.length}</b>
      </p>

      <p>
        Emails ready: <b>{preview.outreachPreview.length}</b>
      </p>

      <div style={{ maxHeight: "300px", overflowY: "auto" }}>
        <Table striped bordered size="sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Subject</th>
            </tr>
          </thead>

          <tbody>
            {preview.outreachPreview.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.company}</td>
                <td>{item.subject}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Button className="mt-2" variant="success" onClick={onSend}>
        Confirm & Send Emails
      </Button>

      <Button className="mt-2 ms-2" variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
    </Card>
  );
}

export default ReviewPanel;