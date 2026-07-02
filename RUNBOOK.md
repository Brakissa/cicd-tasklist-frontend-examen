# Runbook - Frontend Tasklist

## Objectif

Ce runbook décrit les opérations à réaliser pour faire fonctionner, tester et déployer le frontend de l’application Tasklist.

## 1. Prérequis

- Node.js 20+
- npm
- Docker
- Accès au dépôt Git
- Accès à Jenkins et à SonarQube si vous souhaitez exécuter la pipeline complète

## 2. Installation locale

```bash
cd cicd-tasklist-frontend-examen
npm ci
```

## 3. Démarrer l’application

```bash
npm run dev
```

Vérifier que l’application répond correctement sur l’URL fournie par Vite.

## 4. Exécuter les tests

Tests unitaires :

```bash
npm run test
```

Tests avec couverture :

```bash
npm run test:coverage
```

## 5. Construire la version de production

```bash
npm run build
```

## 6. Vérifier l’image Docker

```bash
docker build -t tasklist-frontend:latest .
docker run -p 8080:80 tasklist-frontend:latest
```

## 7. Dépannage courant

- Si les dépendances ne s’installent pas : supprimer `node_modules` puis relancer `npm ci`
- Si les tests échouent : vérifier les logs Vitest et les erreurs de rendu React
- Si le build échoue : vérifier les erreurs TypeScript et les imports invalides
- Si l’image Docker ne démarre pas : vérifier la configuration du port et les logs du conteneur

### Erreur rencontrée : tests Vitest qui échouent avec des warnings `act(...)`

Pendant l’ajout des tests unitaires, un problème courant rencontré était l’affichage de warnings React du type `An update to ... was not wrapped in act(...)`.

#### Cause
Cette erreur apparaît généralement lorsque des mises à jour d’état React sont déclenchées dans un test sans attendre qu’elles soient complètement finalisées.

#### Solution
- Utiliser `await waitFor(...)` après un appel asynchrone ou une mise à jour d’état.
- Vérifier que les interactions utilisateur comme `fireEvent.click(...)` sont suivies d’une assertion ou d’un `waitFor`.
- Si nécessaire, utiliser `renderHook` avec `waitFor` pour les hooks comme `useTasks`.

Exemple :

```ts
await result.current.addTask({ title: 'B' });
await waitFor(() => expect(result.current.tasks[0].title).toBe('B'));
```

## 8. Pipeline CI/CD

La pipeline Jenkins exécute automatiquement :
1. installation des dépendances
2. tests unitaires avec couverture
3. build du frontend
4. analyse SonarQube
5. scan Docker avec Trivy
6. publication de l’image Docker sur `main`

En cas d’échec, consulter les logs Jenkins ainsi que les rapports de couverture et SonarQube.
