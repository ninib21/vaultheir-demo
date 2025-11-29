# VaultHeir Docker Deployment

Deploy VaultHeir as a containerized application.

## Quick Start

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Available Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services |
| `docker-compose up -d --build` | Rebuild and start |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View live logs |
| `docker-compose ps` | List running containers |

## Services

- **Frontend**: http://localhost:3000 (Next.js)
- **Backend**: http://localhost:3001 (NestJS API)
- **Nginx**: http://localhost:80 (optional, production profile)

## Production Deployment

For production with Nginx reverse proxy:

```bash
docker-compose --profile production up -d
```

## Environment Variables

Create a `.env` file in this directory:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Building Individual Images

```bash
# Frontend only
docker build -t vaultheir-frontend -f Dockerfile.simple ..

# Backend only
docker build -t vaultheir-backend -f Dockerfile.backend ../backend
```
