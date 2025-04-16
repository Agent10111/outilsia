# Chatbot d'Investigation IA

Un chatbot spécialisé dans l'investigation des crimes assistés par l'IA, utilisant l'API OpenAI pour fournir des réponses précises et professionnelles en français.

## Fonctionnalités

- Interface utilisateur intuitive
- Réponses en français
- Intégration avec l'API OpenAI
- Gestion des erreurs robuste
- Support pour les requêtes asynchrones

## Configuration requise

- Node.js
- Clé API OpenAI

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd [NOM_DU_REPO]
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
- Créer un fichier `.env` à la racine du projet
- Ajouter votre clé API OpenAI :
```
API_HOST=http://localhost:3001
PORT=3001
OPENAI_API_KEY=votre_clé_api_ici
```

4. Démarrer le serveur :
```bash
node server.js
```

5. Accéder à l'application :
- Ouvrir un navigateur
- Aller à `http://localhost:3000`

## Structure du projet

```
├── public/
│   ├── images/
│   ├── chatbot.js
│   ├── network.js
│   ├── qr-generator.js
│   ├── styles.css
│   └── index.html
├── server.js
├── .env
└── package.json
```

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## Licence

Ce projet est sous licence MIT.
