import { useState } from "react";

const AVATAR_COLORS = [
  ["#E6F1FB", "#185FA5"],
  ["#E1F5EE", "#0F6E56"],
  ["#EEEDFE", "#534AB7"],
  ["#FAECE7", "#993C1D"],
  ["#FBEAF0", "#993556"],
];

function getInitials(name) {
  return (name || "UN").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function ReviewPanel({ preview, onSend, onCancel }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sending, setSending] = useState(false);

  if (!preview) return null;

  const { companies = [], outreachPreview = [] } = preview;
  const totalContacts = companies.reduce((s, c) => s + (c.contacts?.length || 0), 0);
  const selected = outreachPreview[selectedIdx];

  const handleSend = async () => {
    setSending(true);
    await onSend();
    setSending(false);
  };

  return (
    <div style={styles.panel}>

      {/* Stats */}
      <div style={styles.stats}>
        <Stat value={companies.length} label="Companies found" />
        <Stat value={totalContacts} label="Contacts enriched" />
        <Stat value={outreachPreview.length} label="Emails ready" />
      </div>

      <div style={styles.sectionTitle}>Review outreach queue</div>

      <div style={styles.grid}>

        {/* Left: contact list */}
        <div>
          <div style={styles.colLabel}>Select to preview</div>
          <div style={styles.contactList}>
            {outreachPreview.map((item, i) => {
              const [bg, fg] = AVATAR_COLORS[i % AVATAR_COLORS.length];
              const isSelected = i === selectedIdx;
              return (
                <div
                  key={i}
                  style={{
                    ...styles.contactRow,
                    ...(isSelected ? styles.contactRowSelected : {}),
                  }}
                  onClick={() => setSelectedIdx(i)}
                >
                  <div style={{ ...styles.avatar, background: bg, color: fg }}>
                    {getInitials(item.name)}
                  </div>
                  <div style={styles.contactInfo}>
                    <div style={{ ...styles.contactName, ...(isSelected ? { color: "#085041" } : {}) }}>
                      {item.name}
                    </div>
                    <div style={styles.contactMeta}>
                      <span style={styles.badge}>{item.company}</span>
                    </div>
                  </div>
                  <div style={styles.contactEmail}>{item.email}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: email preview */}
        <div>
          <div style={styles.colLabel}>Email content</div>
          {selected ? (
            <EmailPreview item={selected} />
          ) : (
            <div style={styles.emptyPreview}>Select a contact to preview their email</div>
          )}
        </div>

      </div>

      <div style={styles.divider} />

      <div style={styles.actionRow}>
        <button
          style={{ ...styles.btn, ...styles.btnSuccess, opacity: sending ? 0.6 : 1 }}
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? (
            <><InlineSpinner color="#EAF3DE" /> Sending...</>
          ) : (
            <><SendIcon /> Confirm &amp; send {outreachPreview.length} emails</>
          )}
        </button>
        <button style={{ ...styles.btn, ...styles.btnCancel }} onClick={onCancel}>
          <XIcon /> Cancel
        </button>
      </div>

    </div>
  );
}

function EmailPreview({ item }) {
  return (
    <div style={styles.emailWrap}>
      <div style={styles.emailHeader}>
        <EmailField label="To" value={`${item.name} <${item.email}>`} />
        <EmailField label="From" value="Subspace <outreach@subspace.com>" />
        <EmailField label="Subject" value={item.subject} bold />
      </div>
      <div
        style={styles.emailBody}
        dangerouslySetInnerHTML={{ __html: item.html || "<p>No content</p>" }}
      />
    </div>
  );
}

function EmailField({ label, value, bold }) {
  return (
    <div style={styles.emailField}>
      <span style={styles.emailFieldLabel}>{label}</span>
      <span style={{ ...styles.emailFieldValue, ...(bold ? { fontWeight: 500 } : {}) }}>{value}</span>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={styles.stat}>
      <div style={styles.statVal}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

function InlineSpinner({ color = "#fff" }) {
  return (
    <span style={{ width: 13, height: 13, border: `2px solid transparent`, borderTopColor: color, borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
  );
}

function SendIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

const styles = {
  panel: { background: "#fff", border: "0.5px solid #e5e5e5", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" },
  stats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: "1.25rem" },
  stat: { background: "#fafafa", borderRadius: 8, padding: 12 },
  statVal: { fontSize: 22, fontWeight: 500, color: "#111" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 2 },
  sectionTitle: { fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 12 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  colLabel: { fontSize: 11, fontWeight: 500, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 },
  contactList: { display: "flex", flexDirection: "column", gap: 6, maxHeight: 280, overflowY: "auto" },
  contactRow: { display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "0.5px solid #e5e5e5", borderRadius: 8, cursor: "pointer", transition: "all 0.15s" },
  contactRowSelected: { border: "0.5px solid #1D9E75", background: "#E1F5EE" },
  avatar: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, flexShrink: 0 },
  contactInfo: { flex: 1, minWidth: 0 },
  contactName: { fontSize: 13, fontWeight: 500, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  contactMeta: { marginTop: 2 },
  badge: { fontSize: 11, padding: "1px 7px", borderRadius: 99, background: "#E6F1FB", color: "#185FA5", fontWeight: 500 },
  contactEmail: { fontSize: 11, color: "#aaa", textAlign: "right", flexShrink: 0, maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" },
  emailWrap: { border: "0.5px solid #e5e5e5", borderRadius: 8, overflow: "hidden" },
  emailHeader: { background: "#fafafa", padding: "10px 14px", borderBottom: "0.5px solid #e5e5e5", display: "flex", flexDirection: "column", gap: 4 },
  emailField: { fontSize: 12, display: "flex", gap: 8 },
  emailFieldLabel: { color: "#bbb", width: 48, flexShrink: 0 },
  emailFieldValue: { color: "#111" },
  emailBody: { padding: "12px 14px", fontSize: 13, color: "#333", lineHeight: 1.7, maxHeight: 220, overflowY: "auto" },
  divider: { height: "0.5px", background: "#e5e5e5", margin: "1rem 0" },
  actionRow: { display: "flex", gap: 8, alignItems: "center" },
  btn: { fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 8, border: "0.5px solid #ddd", background: "#fff", color: "#111", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" },
  btnSuccess: { background: "#3B6D11", color: "#EAF3DE", border: "none" },
  btnCancel: { background: "#FEF2F2", color: "#991B1B", border: "0.5px solid #FECACA" },
};

export default ReviewPanel;