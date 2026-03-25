# BeautyFreelas MVP - PRD & Architecture

## 1. Product Vision & Understanding
*   **Concept:** A multi-tenant Web App (PWA) serving as a scheduling portfolio for independent beauty professionals (hairdressers, manicurists, estheticians).
*   **Core Value Proposition:** Professionals get a centralized, sharable link to their services and an automated schedule. Clients get a zero-friction, login-free booking experience.
*   **Discovery Model:** "Link in Bio" strategy. The primary entry point is the professional's unique URL (e.g., `beautyfreelas.com/ana-nails`).
*   **Non-Goals (MVP):** In-app payments, SaaS subscription billing, native app store distribution, global search/marketplace maps, complex omnichannel notifications.

## 2. Technical Architecture Definition

We selected a fast, scalable, and SEO-friendly stack suitable for a rapid MVP validation, ensuring a smooth "Link in Bio" user experience.

### Component Stack
*   **Frontend Framework:** Next.js (App Router) with React.
*   **Styling:** Tailwind CSS + shadcn/ui.
*   **Backend / BaaS:** Firebase (Authentication + Firestore Database).
*   **Hosting:** Vercel (or Firebase Hosting).

### ADR-001: Next.js vs SPA (Vite)
*   **Problem:** We need a fast web application where professionals can share their profile links on social media.
*   **Options:** 
    *   *Next.js (SSR/SSG):* Offers dynamic Open Graph (OG) tags for social media link previews and good out-of-the-box SEO.
    *   *Vite (SPA):* Simpler to host, but poor social media link previews without complex workarounds.
*   **Decision:** **Next.js (App Router)**.
*   **Rationale:** The "Link in Bio" sharing is the core acquisition loop. When a professional shares their link on WhatsApp or Instagram, seeing a rich preview (their name/photo) increases click-through rates.
*   **Trade-offs:** Slightly more complex mental model (Server vs. Client components) than a pure SPA.

### ADR-002: Firebase as Backend-as-a-Service
*   **Problem:** We need a backend to manage users, authentication, and a database for appointments without spending weeks building custom APIs.
*   **Options:** Firebase, Supabase, Custom Node.js/PostgreSQL.
*   **Decision:** **Firebase (Firestore & Auth)**.
*   **Rationale:** Extremely fast time-to-market. Simple authentication (Google/Email) and real-time database capabilities that fit the scheduling domain well. Free tier is generous enough for MVP validation.

## 3. Data Modeling (Firestore Schema)

The database is designed to be NoSQL-friendly, keeping data flat where possible to reduce read costs and improve speed.

### Collection: `professionals`
Stores the data for the multi-tenant system.
*   `uid` (string) - Firebase Auth UID (Document ID).
*   `slug` (string) - Unique identifier for the URL (e.g., "ana-nails").
*   `name` (string) - Display name.
*   `description` (string) - Professional bio.
*   `photoUrl` (string) - URL to profile picture.
*   `phone` (string) - Contact number.
*   `createdAt` (timestamp).

### Collection: `services` 
*(Can be a subcollection of `professionals` or top-level with a reference)*
Stores the catalog of services offered by the professional.
*   `id` (string) - Document ID.
*   `professionalId` (string) - Reference to `professionals.uid`.
*   `name` (string) - e.g., "Corte Feminino".
*   `price` (number) - e.g., 85.00.
*   `durationMinutes` (number) - Duration chunk, e.g., 45.

### Collection: `appointments`
Stores the actual bookings made by guests.
*   `id` (string) - Document ID.
*   `professionalId` (string) - Reference to `professionals.uid`.
*   `serviceId` (string) - Reference to `services.id`.
*   `date` (string) - Format 'YYYY-MM-DD' for easy querying.
*   `startTime` (string) - Format 'HH:MM'.
*   `endTime` (string) - Format 'HH:MM' (Calculated based on duration).
*   `guestClient` (map):
    *   `name` (string)
    *   `phone` (string)
    *   `email` (string, optional)
*   `status` (string) - "CONFIRMED", "CANCELLED", "COMPLETED".
*   `createdAt` (timestamp).

## 4. User Flows

### Flow 1: Professional Onboarding
1. Professional signs up via Google or Email/Password.
2. Fills out profile details (Name, Bio, Photo, and defines their custom `slug`).
3. Adds their initial services (Name, Price, Duration).
4. System provides them their unique link (`beautyfreelas.com/slug`).

### Flow 2: Guest Client Booking (Frictionless)
1. Client clicks the professional's link on Instagram.
2. Views professional profile and list of services.
3. Selects a service.
4. UI presents a calendar. Client picks a date.
5. System queries `appointments` to block out already taken times and presents available time slots.
6. Client selects a time slot.
7. Client enters Name and Phone number (no password creation).
8. Clicks "Confirm". Appointment is saved as "CONFIRMED".
9. UI shows a success screen.

### Flow 3: Professional Dashboard Management
1. Professional logs in.
2. Views a dashboard with today's/this week's appointments.
3. Can click an appointment to see Guest Client details (Phone number to contact via WhatsApp).
4. Can cancel an appointment (changes status to CANCELLED, freeing the slot).
