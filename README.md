# MOTUS Enterprise Mobility Platform

MOTUS is an enterprise mobility orchestration platform for corporate transportation, workforce mobility, bulk transportation booking, fleet coordination, and transport operations.

This repository is structured as a production-ready full-stack foundation:

- `frontend/` - Angular, TypeScript, Angular Material, Tailwind-ready enterprise UI.
- `backend/` - ASP.NET Core Web API using Clean Architecture boundaries.

## Experience

Public visitors can view company information, request demos, contact sales, and log in. Operational workflows are private and protected by JWT/RBAC route guards.

Authenticated modules include:

- Enterprise Dashboard
- Bulk Booking
- Fleet Tracking
- Reports & Analytics
- User Management
- Vehicle Management

## Backend Modules

- Authentication
- Users and RBAC
- Enterprises
- Bookings
- Fleet and Vehicles
- Drivers and Vendors
- Reports
- Notifications
- Billing

## Local Development

Frontend:

```bash
cd frontend
npm install
npm start
```

Backend:

```bash
cd backend/src/Motus.Api
dotnet run
```

The frontend uses an enterprise visual system built around deep navy, midnight blue, dark slate, electric blue, cyan, emerald, and neutral gray.
