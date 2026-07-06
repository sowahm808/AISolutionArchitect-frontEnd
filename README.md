# AI Solution Architect Frontend

Production-oriented Angular 20+ standalone application for an enterprise architecture generation platform.

## Features

- JWT-ready authentication, auth interceptor, unauthenticated redirect, role-based route guards.
- Enterprise shell with left navigation, dashboard, projects, discovery interview, model viewer, artifact workspace, diagrams, ADRs, infrastructure, Kubernetes, CI/CD, security, risks, cost, presentation, exports and settings routes.
- Strongly typed domain models and services for auth, projects, discovery, architecture model, artifacts, exports, organization, users and audit logs.
- Reusable components for page headers, project cards, status badges, artifact viewing, Mermaid source, code editing, risk table, security findings, cost breakdown, empty/loading/error states and generation progress.
- Environment-based API URL configuration with no hardcoded secrets.

## Setup

```bash
npm install
npm start
```

## Build and test

```bash
npm run build
npm test
```

## Environment

Set API URLs in `src/environments/environment.ts` and `src/environments/environment.prod.ts`.
