from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response  # Ensure this is the correct import

app = Flask(__name__)
CORS(app)

@app.route("/")
def index_get():
    return render_template("base.html")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        text = request.get_json().get("message")
        response = get_response(text)  # Corrected function name
        message = {"answer": response}
        return jsonify(message)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"answer": "Error occurred"}), 500

if __name__ == "__main__":
    app.run(host="192.168.0.187", port=8080)  # Use the host machine's IP address
