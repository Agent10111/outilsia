from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        
        # Ici, vous pouvez ajouter la logique de traitement du message
        # Pour l'instant, nous renvoyons simplement une réponse de test
        response = {
            "message": "Je suis votre assistant IA. Comment puis-je vous aider ?"
        }
        
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000) 