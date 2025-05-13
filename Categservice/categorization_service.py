import base64
import cv2
import numpy as np
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import logging
from textblob import TextBlob
from fer import FER
from typing import Dict, Tuple

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Flask app
app = Flask(__name__)
CORS(app)

emotion_detector = FER()
MIN_TEXT_LENGTH = 10

CATEGORIES = {
    "billing": [
        "billing", "charge", "payment", "invoice", "refunded", "overcharged",
        "fee", "price", "cost", "unauthorized", "transaction", "credit card"
    ],
    "doctor_complaint": [
        "doctor", "physician", "nurse", "rude", "unprofessional", "ignored",
        "diagnosis", "treatment", "exam", "consultation", "attitude", "behavior"
    ],
    "waiting_time": [
        "waiting", "delay", "hours", "long wait", "queue", "late", "appointment time",
        "took too long", "delayed", "reschedule", "crowded", "slow"
    ],
    "general_feedback": [
        "feedback", "thank", "appreciate", "grateful", "satisfied", "recommend",
        "great service", "helpful", "professional", "excellent", "experience", "positive"
    ]
}

def calculate_category_scores(text: str) -> Dict[str, int]:
    scores = {}
    processed_text = text.lower()
    for category, keywords in CATEGORIES.items():
        scores[category] = sum(1 for keyword in keywords if keyword in processed_text)
    return scores

def determine_category(scores: Dict[str, int]) -> Tuple[str, float]:
    max_score = max(scores.values(), default=0)
    if max_score == 0:
        return "uncategorized", 0.0
    total_score = sum(scores.values())
    max_category = max(scores, key=scores.get)
    confidence = scores[max_category] / total_score
    return max_category, round(confidence, 2)

def analyze_sentiment(text: str) -> Tuple[str, float]:
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    sentiment = "positive" if polarity > 0.1 else "negative" if polarity < -0.1 else "neutral"
    return sentiment, round(polarity, 2)

def validate_input_text(text: str) -> None:
    if not text:
        raise ValueError("No text provided")
    if len(text.strip()) < MIN_TEXT_LENGTH:
        raise ValueError(f"Text too short (minimum {MIN_TEXT_LENGTH} characters)")

def detect_facial_emotion(image_data: str) -> Tuple[str, float]:
    try:
        # Support both raw base64 and data URL formats
        if "," in image_data:
            image_data = image_data.split(",")[1]
        img_data = base64.b64decode(image_data)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        emotion, score = emotion_detector.top_emotion(img)
        return emotion or "unknown", round(score or 0.0, 2)
    except Exception as e:
        logger.error("Emotion detection failed: %s", e, exc_info=True)
        return "error", 0.0

@app.route("/categorize", methods=["POST"])
def categorize():
    try:
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be JSON"}), 400)

        data = request.get_json()
        text = data.get("text", "").strip()

        validate_input_text(text)
        scores = calculate_category_scores(text)
        category, confidence = determine_category(scores)
        sentiment, sentiment_score = analyze_sentiment(text)

        return jsonify({
            "category": category,
            "confidence": confidence,
            "sentiment": sentiment,
            "sentiment_score": sentiment_score,
            "scores": scores
        })

    except ValueError as e:
        return make_response(jsonify({"error": str(e)}), 400)
    except Exception as e:
        logger.error("Server error: %s", e, exc_info=True)
        return make_response(jsonify({"error": "Internal server error"}), 500)

@app.route("/detect-emotion", methods=["POST"])
def detect_emotion():
    try:
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be in JSON format."}), 400)

        data = request.get_json()
        image_data = data.get("image", "").strip()
        if not image_data:
            return make_response(jsonify({"error": "No image data provided."}), 400)

        emotion, confidence = detect_facial_emotion(image_data)
        return jsonify({
            "facial_emotion": emotion,
            "confidence": confidence
        })

    except Exception as e:
        logger.error("Error in /detect-emotion: %s", e, exc_info=True)
        return make_response(jsonify({"error": "Internal server error"}), 500)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
