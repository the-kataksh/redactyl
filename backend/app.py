from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Redactyl backend is running"


@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    html = data.get("html", "")

    response = {
        "status": "success",
        "message": "HTML analysed successfully",
        "html_length": len(html)
    }

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
