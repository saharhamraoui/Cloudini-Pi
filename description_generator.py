from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline
import logging
import re

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    logger.info("Chargement du modèle AI...")
    generator = pipeline('text-generation', model='gpt2')  # Consider switching to 'EleutherAI/gpt-neo-125M'
    logger.info("Modèle chargé!")
except Exception as e:
    logger.error("Erreur de chargement: %s", e)
    raise

@app.route('/generate', methods=['POST'])
def generate_description():
    try:
        data = request.get_json()
        keywords = data.get('keywords', '')
        role = data.get('role', 'utilisateur')

        # Validate keywords
        if not keywords or not re.match(r'^[\w\s,éèàçùôîûêâäöüëï,.-]+$', keywords):
            return jsonify({
                "error": "Mots-clés invalides. Utilisez des mots-clés pertinents séparés par des virgules.",
                "status": "error"
            }), 400

        # Refine the prompt for professional output
        prompt = (
            f"Génère une description professionnelle concise en français pour un {role}. "
            f"Utilise ces mots-clés : {keywords}. "
            "La description doit être claire, pertinente, et adaptée au rôle. "
            "Évite les phrases vagues ou répétitives."
        )

        result = generator(
            prompt,
            max_length=150,  # Reduced to ensure concise output
            num_return_sequences=1,
            temperature=0.7,
            truncation=True,
            top_p=0.9  # Add top-p sampling for better quality
        )

        generated_text = result[0]['generated_text'].replace(prompt, '').strip()
        generated_text = generated_text[:500]  # Truncate to 500 characters to avoid DB issues

        # Basic cleanup to remove gibberish
        if len(generated_text.split()) < 5 or not re.search(r'[a-zA-Zéèàçùôîûêâäöüëï]', generated_text):
            return jsonify({
                "error": "La description générée est invalide. Essayez d'autres mots-clés.",
                "status": "error"
            }), 400

        return jsonify({
            "description": generated_text,
            "status": "success"
        })

    except Exception as e:
        logger.error("Erreur: %s", e)
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)