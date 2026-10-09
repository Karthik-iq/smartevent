# Smart Event — Phase 2

## Description
Smart Event is a comprehensive, frontend-only event management platform. It features a complete role-based UI (User, Organizer, Admin) with dummy data and state-driven functionality. Users can browse events, book tickets, and manage their bookings. Organizers have a full suite of tools to create, edit, cancel events, and view event metrics. Admins can oversee the entire platform via a high-level dashboard and detailed data tables.

## Technologies
- React
- JavaScript (ES6+)
- Tailwind CSS
- React Router
- Lucide React (Icons)
- Vite

## Features
- **Role-based UI:** Distinct interfaces and functionality for Users, Organizers, and Admins.
- **Event Management:** Create, read, update, and cancel events.
- **Booking System:** Complete ticket booking flow with calculations and validation.
- **Dashboards:** Metrics and analytics for organizers and admins.
- **Responsive Design:** Mobile, tablet, and desktop optimized using Tailwind CSS.
- **Reusable Components:** Modular UI blocks (Cards, Buttons, Modals, Tables, etc.).
- **State Management:** All data flows seamlessly across the app using React Context and LocalStorage for persistence.

## Roles
- **User:** Can discover events, view details, book tickets, and see their digital tickets.
- **Organizer:** Can create events, manage existing events, view bookings, and access performance metrics.
- **Admin:** Oversees all users, events, and bookings on the platform with comprehensive analytics.

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Available Routes

- `/login` - Role selection dummy login
- `/events` - Event discovery (USER)
- `/events/:id` - Event details and booking (USER)
- `/my-bookings` - User's booking history (USER)
- `/my-tickets` - User's digital tickets (USER)
- `/organizer` - Organizer dashboard (ORGANIZER)
- `/organizer/create-event` - Event creation form (ORGANIZER)
- `/organizer/events` - Manage organizer's events (ORGANIZER)
- `/organizer/events/:id/edit` - Edit an event (ORGANIZER)
- `/organizer/bookings` - View event bookings (ORGANIZER)
- `/admin` - Platform overview (ADMIN)
- `/admin/users` - All users table (ADMIN)
- `/admin/events` - All events table (ADMIN)
- `/admin/bookings` - All bookings table (ADMIN)
- `/admin/analytics` - Platform analytics (ADMIN)

## Frontend-only Notice
> This project uses dummy/mock data and React state. No backend or database integration is implemented. All state changes are persisted locally using `localStorage` for demonstration purposes.
