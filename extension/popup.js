let redactedHTML = "";

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const status = document.getElementById("status");
  status.innerText = "Reading page HTML...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => document.documentElement.outerHTML
      },
      (results) => {
        if (!results || !results[0]) {
          status.innerText = "Failed to read page HTML";
          return;
        }

        sendToBackend(results[0].result);
      }
    );
  });
});

async function sendToBackend(html) {
  const status = document.getElementById("status");

  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html })
    });

    if (!response.ok) throw new Error("Backend error");

    const data = await response.json();

    redactedHTML = data.redacted_html || "";

    const hidden = data.redaction_summary.hidden_elements_removed;
    const encoded = data.redaction_summary.encoded_payloads_removed;
    const risks = data.risk_elements_detected.join(", ");
    const explanation = data.explanation;

    status.innerHTML = `
      <strong>Hidden:</strong> ${hidden}<br>
      <strong>Encoded:</strong> ${encoded}<br>
      <strong>Risk:</strong> ${risks}<br><br>
      <em>${explanation}</em>
    `;

    document.getElementById("actions").classList.remove("hidden");

  } catch (err) {
    console.error(err);
    status.innerText = "Backend connection failed";
  }
}

document.getElementById("openHtml").addEventListener("click", () => {
  const w = window.open();
  w.document.write(redactedHTML);
  w.document.close();
});

document.getElementById("copyHtml").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(redactedHTML);
    alert("Redacted HTML copied");
  } catch {
    alert("Copy failed");
  }
});
