# Tasklist Frontend

Application React + Vite pour la gestion de tâches.

## Prérequis

- Node.js 20+
- npm
- Docker (optionnel pour l’exécution en conteneur)

## Installation

```bash
npm ci
```

## Développement local

Lancer l’application en mode développement :

```bash
npm run dev
```

L’application sera disponible sur l’URL fournie par Vite.

## Tests

Exécuter les tests unitaires :

```bash
npm run test
```

Exécuter les tests avec couverture :

```bash
npm run test:coverage
```

## Build

Construire l’application pour la production :

```bash
npm run build
```

Le résultat sera généré dans le dossier `dist/`.

## Conteneur Docker

Construire l’image Docker :

```bash
docker build -t tasklist-frontend:latest .
```

Lancer le conteneur :

```bash
docker run -p 8080:80 tasklist-frontend:latest
```

## Structure du projet

- `src/components` : composants React
- `src/hooks` : hooks métier
- `src/api` : appels API
- `src/__tests__` : tests unitaires
- `public` : fichiers statiques

## CI/CD

Le projet intègre un pipeline Jenkins qui exécute :
- installation des dépendances
- tests unitaires avec couverture
- build
- analyse SonarQube
- scan Docker avec Trivy
- publication Docker sur la branche `main`
