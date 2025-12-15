from flask import Flask, request, jsonify
from hidden_elements import detect_and_redact_hidden_elements
from encoded_payloads import detect_encoded_payloads


app = Flask(__name__)

@app.route("/")
def home():
    return "Redactyl backend is running"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()

    if not data or "html" not in data:
        return jsonify({"error": "No HTML provided"}), 400

    raw_html = data["html"]

    # Part 1: Hidden DOM redaction
    redacted_html, hidden_removed = detect_and_redact_hidden_elements(raw_html)

    # Part 2: Encoded payload detection
    encoded_count, encoded_previews = detect_encoded_payloads(redacted_html)

    response = {
        "hidden_elements_removed": hidden_removed,
        "encoded_payloads_detected": encoded_count,
        "encoded_payload_previews": encoded_previews,
        "redacted_html": redacted_html
    }

    return jsonify(response), 200



if __name__ == "__main__":
    app.run(debug=True)
