# Evaluation of Redactyl

## Objective

The goal of this evaluation is to assess the effectiveness of **Redactyl** as a
preprocessing layer for AI agents by verifying its ability to identify and
remove DOM-based AI risk patterns from web pages.

Redactyl is **not designed to classify websites as malicious or safe**.
Instead, it focuses on sanitizing web content before it is consumed by
downstream AI agents, reducing the risk of prompt injection and hidden
manipulation.

---

## Dataset Description

A small, controlled HTML dataset was created to simulate common AI-risk
patterns observed in real-world web pages. The dataset includes:

- Pages with no risk indicators (baseline)
- Pages containing hidden DOM elements
- Pages containing encoded payloads
- Pages containing a combination of both

All dataset files are located in the `dataset/` directory.

---

## Evaluation Methodology

Each dataset HTML file was opened directly in the browser and analyzed using the
Redactyl Chrome extension. This ensured that the **same end-to-end pipeline**
used in real-world scenarios was applied during evaluation:


For each file, the following were observed:
- Number of hidden DOM elements removed
- Number of encoded payloads detected
- Risk indicators reported by the system
- Verification that redacted HTML no longer contained the identified risk
  elements

This manual evaluation approach was chosen to maintain transparency and to
accurately reflect real usage conditions.

---

## Evaluation Results

| Dataset File        | Hidden Elements Removed | Encoded Payloads Detected | Risk Indicators Identified            |
|---------------------|-------------------------|----------------------------|--------------------------------------|
| safe.html           | 0                       | 0                          | None                                 |
| hidden_only.html    | 2                       | 0                          | Hidden DOM elements                  |
| encoded_only.html   | 0                       | 1                          | Encoded payloads                     |
| mixed_risk.html     | 1                       | 1                          | Hidden DOM + Encoded payloads        |

---

## Observations

- Redactyl consistently removed hidden DOM elements when present.
- Encoded payloads were reliably detected without modifying visible content.
- Pages without AI-risk indicators remained unchanged after processing.
- The redacted HTML output was suitable for consumption by downstream AI agents,
  containing only visible and explicit content.

---

## Conclusion

The evaluation demonstrates that Redactyl effectively identifies and removes
DOM-based AI risk patterns from web pages. By operating as a preprocessing layer,
Redactyl reduces the likelihood of AI agents being influenced by hidden or
encoded instructions, while preserving legitimate visible content.

This validates Redactyl’s role as an AI-agent safety mechanism rather than a
website security or malware detection tool.
