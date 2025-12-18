from flask import Flask, request, jsonify
from flask_cors import CORS

from hidden_elements import detect_and_redact_hidden_elements
from encoded_payloads import detect_encoded_payloads
from risk_scoring import explain_risk

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Redactyl backend is running"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    if not data or "html" not in data:
        return jsonify({"error": "No HTML provided"}), 400

    raw_html = data["html"]

    #Always redact
    redacted_html, hidden_removed = detect_and_redact_hidden_elements(raw_html)
    encoded_count, encoded_previews = detect_encoded_payloads(redacted_html)

    risk_elements, explanation = explain_risk(
        hidden_removed,
        encoded_count
    )

    response = {
        "redaction_summary": {
            "hidden_elements_removed": hidden_removed,
            "encoded_payloads_removed": encoded_count
        },
        "risk_elements_detected": risk_elements,
        "explanation": explanation,
        "redacted_html": redacted_html
    }

    return jsonify(response), 200


if __name__ == "__main__":
    app.run(debug=True)

