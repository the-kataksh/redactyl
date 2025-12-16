document.getElementById("analyzeBtn").addEventListener("click", () => {
  document.getElementById("status").innerText = "Reading page HTML...";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        func: () => document.documentElement.outerHTML
      },
      (results) => {
        const html = results[0].result;
        document.getElementById("status").innerText = "Sending to backend...";
        sendToBackend(html);
      }
    );
  });
});

async function sendToBackend(html) {
  try {
    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ html: html })
    });

    const data = await response.json();

    document.getElementById("status").innerText =
      `Hidden: ${data.hidden_elements_removed}, Encoded: ${data.encoded_payloads_detected}`;
  } catch (error) {
    console.error(error);
    document.getElementById("status").innerText = "Backend connection failed";
  }
}
