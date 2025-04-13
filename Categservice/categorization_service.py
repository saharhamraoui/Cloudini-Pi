import spacy
from flask import Flask, request, jsonify, make_response
import logging
from typing import Tuple, Dict

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MIN_TEXT_LENGTH = 10
CATEGORIES = {
    "billing": ["billing", "charge", "payment", "invoice"],
    "doctor_complaint": ["doctor", "staff", "treatment", "service"],
    "waiting_time": ["waiting", "delay", "time", "hours"],
    "general_feedback": ["feedback", "thank", "good", "recommend"]
}

app = Flask(__name__)

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except IOError as e:
    logger.error("Failed to load spaCy model: %s", e)
    raise SystemExit("Missing spaCy model. Install with: python -m spacy download en_core_web_sm")

def calculate_category_scores(text: str) -> Dict[str, int]:
    """Calculate category scores based on keyword presence."""
    scores = {}
    processed_text = text.lower()
    
    for category, keywords in CATEGORIES.items():
        scores[category] = sum(1 for keyword in keywords if keyword in processed_text)
    
    return scores

def determine_category(scores: Dict[str, int]) -> Tuple[str, float]:
    """Determine the best category and confidence score."""
    max_score = max(scores.values(), default=0)
    
    if max_score == 0:
        return "uncategorized", 0.0
        
    total_score = sum(scores.values())
    max_category = max(scores, key=scores.get)
    confidence = scores[max_category] / total_score
    
    return max_category, round(confidence, 2)

def validate_input_text(text: str) -> None:
    """Validate input text meets requirements."""
    if not text:
        raise ValueError("No text provided")
    if len(text.strip()) < MIN_TEXT_LENGTH:
        raise ValueError(f"Text too short (minimum {MIN_TEXT_LENGTH} characters)")

@app.route("/categorize", methods=["POST"])
def categorize():
    """Endpoint for text categorization with confidence scoring."""
    try:
        # Validate request format
        if not request.is_json:
            return make_response(jsonify({"error": "Request must be JSON"}), 400)
            
        data = request.get_json()
        text = data.get("text", "").strip()
        
        # Validate input
        validate_input_text(text)
        
        # Process text
        scores = calculate_category_scores(text)
        category, confidence = determine_category(scores)
        
        return jsonify({
            "category": category,
            "confidence": confidence,
            "scores": scores  # Optional: Include for debugging
        })
        
    except ValueError as e:
        logger.warning("Validation error: %s", e)
        return make_response(jsonify({"error": str(e)}), 400)
    except Exception as e:
        logger.error("Server error: %s", e, exc_info=True)
        return make_response(jsonify({"error": "Internal server error"}), 500)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)