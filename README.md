# Vaultheir™ Demo - Noir & Silver Edition

A sophisticated demo version of the Vaultheir™ IP Management Platform featuring a **Noir and Silver color scheme** with complete frontend-backend integration.

## 🎨 Design

This demo showcases a **monochrome aesthetic** with:
- **Noir (Black)**: Deep black backgrounds and dark tones
- **Silver**: Elegant silver accents and highlights
- Modern glass morphism effects
- Smooth animations and transitions

## 🚀 Features

- **Full-Stack Integration**: Connected frontend to NestJS and FastAPI backends
- **IP Asset Management**: Create and notarize IP assets on Hedera blockchain
- **ROI Calculator**: Real-time pricing calculations with API integration
- **Interactive Demo**: Upload and notarize files with blockchain verification
- **Toast Notifications**: User-friendly feedback system
- **Error Handling**: Comprehensive error boundaries and validation
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundles

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: TailwindCSS with custom Noir/Silver theme
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion, GSAP
- **Backend**: NestJS, FastAPI
- **Blockchain**: Hedera Hashgraph SDK

## 📦 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🐳 Docker Setup

```bash
# Copy env template if you haven't already
cp .env.example .env

# Build containers
npm run docker:build

# Start the full stack (frontend, backend, pricing service, dbs)
npm run docker:up
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:4000/api  
- Pricing Service: http://localhost:8000  

Use `npm run docker:logs` to tail container logs and `npm run docker:down` to stop
everything. The frontend is wired to the internal services through
`NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_PRICING_SERVICE_URL`, so requests resolve
correctly inside Docker.

## 🌐 Demo

Visit http://localhost:3000 to see the demo in action.

## 📝 Notes

- This is the **Noir and Silver** demo version
- All API integrations are functional
- Backend services should be running for full functionality
- See `INTEGRATION_SUMMARY.md` for detailed integration documentation

## 📄 License

Copyright © BidayaX LLC
