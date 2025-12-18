let lastRedactedHTML = null;

document.getElementById("analyzeBtn").addEventListener("click", () => {
  const status = document.getElementById("status");
  status.innerText = "Reading page HTML...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || !tabs[0]) {
      status.innerText = "No active tab found";
      return;
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => document.documentElement.outerHTML
      },
      (results) => {
        if (!results || !results[0] || !results[0].result) {
          status.innerText = "Failed to read page HTML";
          return;
        }

        status.innerText = "Analyzing page...";
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ html })
    });

    if (!response.ok) {
      throw new Error("Backend error");
    }

    const data = await response.json();

    // Safely extract backend response
    const hidden = data.redaction_summary?.hidden_elements_removed ?? 0;
    const encoded = data.redaction_summary?.encoded_payloads_removed ?? 0;
    const risks = data.risk_elements_detected ?? [];
    const explanation = data.explanation ?? "No explanation available";

    lastRedactedHTML = data.redacted_html || null;

    // Render analytics UI
    status.innerHTML = `
      <strong>Hidden:</strong> ${hidden}<br>
      <strong>Encoded:</strong> ${encoded}<br>
      <strong>Risk:</strong> ${risks.length ? risks.join(", ") : "None"}<br><br>
      <em>${explanation}</em>
      <br><br>
      <button id="openRedacted" ${!lastRedactedHTML ? "disabled" : ""}>
        Open Redacted HTML
      </button>
    `;

    // Open redacted HTML only on click
    const openBtn = document.getElementById("openRedacted");
    if (openBtn && lastRedactedHTML) {
      openBtn.addEventListener("click", () => {
        const blob = new Blob([lastRedactedHTML], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        chrome.tabs.create({ url });
      });
    }

  } catch (error) {
    console.error(error);
    status.innerText = "Backend connection failed";
  }
}
