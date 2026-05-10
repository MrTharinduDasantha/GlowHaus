# GlowHaus: Women-Only Luxury Salon Management System

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/State-Redux_Toolkit-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Framer Motion](https://img.shields.io/badge/Motion-Framer_Motion-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mongoose](https://img.shields.io/badge/ODM-Mongoose-880000?logo=mongoose&logoColor=white)](https://mongoosejs.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-22B573?logo=minutemailer&logoColor=white)](https://nodemailer.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-FF6B6B?logo=react&logoColor=white)](https://recharts.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
 
GlowHaus is a production-grade, full-stack salon management system designed exclusively for women-only luxury salons. The platform delivers a complete end-to-end booking experience — from a richly animated landing page and curated service catalog to a dynamic time-slot engine, secure Stripe-powered checkout, automated branded email confirmations, and post-appointment review and rating workflows. A dedicated admin panel offers full operational control over services, categories, stylists, working hours, appointments, customers, gallery albums, promo codes, payments, and revenue reporting — all wrapped in a refined dark-mode interface accented with rose-gold and champagne tones.

---

## 🚀 Demo
 
Click the link below to see a demonstration of the GlowHaus platform.
 
Link 👉 https://drive.google.com/file/d/1k02JDIUn6bsrSQ3zNOC0hhGNExF3yt1J/view?usp=sharing 👈
 
---

## ✨ Features

| Category | Features |
|---|---|
| Public Discovery | Animated landing page with a Framer-Motion hero slider, featured service highlights, testimonials carousel, and a fully filterable services catalog spanning seven categories (Hair, Makeup, Skincare, Nails, Waxing & Threading, Spa & Massage, Bridal Packages). |
| Authentication & Profiles | Secure JWT-based auth with HTTP-only cookies. Separate customer and admin login flows. Customer registration with optional Cloudinary-hosted profile photo upload. Profile management for name, email, phone, photo, and password. Forgot-password flow with 6-digit OTP delivered via email and TTL-indexed in MongoDB. |
| Service Browsing | Live search by service name, multi-pill category filtering, four sort modes (newest, price ascending/descending, top rated), and clean numbered pagination. |
| Service Detail | Full image gallery with thumbnail navigation and click-to-zoom lightbox, benefits list, average rating, customer reviews, optional preferred-stylist selection, and a sticky "Add to Bag" CTA. |
| Stylists Directory | Profile cards with photos, expertise, and aggregated star ratings. Each stylist's detail page shows their bio, contact info, and the full list of services they are qualified to perform. |
| Service Bag & Booking Flow | Multi-service cart that persists across sessions in localStorage. Three-step animated booking flow: bag → date & stylist → confirmation. Stylist eligibility is computed as a set intersection across every service in the bag. |
| Dynamic Time-Slot Engine | Available booking slots are calculated server-side from the intersection of salon business hours, the stylist's per-day working hours and breaks, the stylist's days off, existing bookings on that date, total service duration, and the configured cleaning gap between appointments. Slots are bucketed into Morning / Afternoon / Evening for cleaner UX. |
| Promo Codes | Customers can apply percentage or fixed-amount promo codes with optional caps, minimum booking values, expiry dates, and usage limits. Codes are validated server-side before checkout and the `usedCount` only increments after a successful Stripe webhook — abandoned checkouts never deplete quotas. |
| Stripe Checkout | Hosted Stripe Checkout integration with success and cancel redirect pages. The Stripe webhook (raw-body verified) confirms bookings, increments promo usage, and triggers the confirmation email — all with idempotent re-run safety. |
| Branded Email Notifications | Automated dark-themed HTML emails for OTP delivery, booking confirmation (with full itinerary and cancellation policy), 24-hour reminders, and status-change notifications (confirmed, cancelled, rescheduled, completed). |
| My Bookings | Customer dashboard split into Upcoming, Completed, and Cancelled tabs. Cancel within the configured notice window, reschedule into a new available slot (with automatic conflict re-checking), and write reviews for completed services. Add-to-Google-Calendar link on the success page. |
| Reviews & Ratings | Customers rate completed appointments 1–5 stars with optional comments. Admin moderates each review (approve / reject / delete). Service and stylist average ratings are recomputed from the source of truth — eliminating drift bugs. |
| Favorites | Saved services per customer with idempotent add/remove and a real-time heart toggle synced to Redux. |
| Admin Dashboard | Live KPIs (today's appointments, revenue today/week/month, new customers this month, active stylists) plus three Recharts visualizations: 7-day revenue area chart, booking status donut chart, and top-5-services horizontal bar chart. |
| Services & Categories | Full CRUD for services with multi-image Cloudinary upload, benefits list, featured-on-homepage toggle, active/inactive toggle, and stylist assignment matrix. Categories support image upload, auto-slug generation, and deletion-protection when services still reference them. |
| Stylist Management | Add, edit, and remove stylists with profile photo, bio, expertise, and contact info. Per-day working-hours editor with optional break windows, plus a multi-date days-off picker for vacation and special closures. Per-stylist 14-day appointment schedule view. |
| Appointment Management | Toggle between table view (with status-pill filters) and calendar view (day-driven list). Click any appointment to open the detail modal: confirm, mark completed, cancel with reason, send reminder email, or open the reschedule tool. Walk-in / phone booking creation reuses the same time-slot engine. |
| Customer Management | Searchable customer list with avatar previews. Click into a customer to see lifetime stats (total spend, total visits, last visit), full booking history, and a one-click block/unblock toggle. |
| Gallery Management | Album CRUD with bulk image upload (up to 20 per request), drag-and-drop drop zone, per-image title and description, and automatic cover-image fallback when the original cover is deleted. |
| Promo Code Management | Full CRUD with discount type selector, percentage caps, minimum booking values, expiry dates, and visual usage-tracking progress bars. |
| Reports & Analytics | Filterable revenue report by date range with booking-level detail. Top-services report. Per-customer stats endpoint. Server-side PDF revenue report generation via pdfkit, streamed directly to the browser. |
| Salon Settings | Five-tab settings panel: general info (name, address, phone, email, social links), logo upload, per-day business hours, booking rules (advance booking limit, cancellation notice hours, slot interval, cleaning gap), and notification toggles. Stored as a singleton document. |
| Notifications | Real-time success and error feedback powered by React Toastify across the entire app. |

---

## 🛠️ Technologies Used

### Frontend (Client)
* **React 19:** Frontend library for building dynamic user interfaces.
* **Vite:** Lightning-fast dev server and bundler.
* **Tailwind CSS v4:** CSS-first utility framework with custom design tokens defined in `index.css` via the `@theme` directive — rose-gold, champagne, and charcoal palette.
* **Framer Motion:** Production-grade animation library powering page transitions, hero parallax, scroll reveals, modal entrances, and micro-interactions.
* **Redux Toolkit & React-Redux:** Predictable state management for auth, services, stylists, service bag, booking flow, and favorites.
* **React Router v7:** Client-side routing with lazy-loaded pages and code splitting.
* **Axios:** HTTP client with global interceptors for cookie-based auth and friendly error messaging.
* **Recharts:** Interactive charts on the admin dashboard (revenue area, status donut, top-services bar).
* **React Hook Form + Yup:** Form state management with schema validation.
* **React Datepicker:** Branded calendar widget for booking date selection.
* **Stripe.js:** Browser-side Stripe primitives.
* **React Icons & React Toastify:** Icon library and toast notifications.
* **date-fns:** Date formatting and manipulation throughout the booking engine.

### Backend (Server) & Database
* **Node.js & Express.js:** Scalable backend runtime and web framework (ES modules).
* **MongoDB & Mongoose:** Document database with rich modeling, populated queries, compound indexes, and TTL indexes for forgot-password OTPs.
* **Bcrypt:** Secure password hashing.
* **JSON Web Token (JWT):** HTTP-only cookie-based authentication with admin role guards.
* **Multer:** Middleware for handling multipart/form-data file uploads (memory storage).
* **pdfkit:** Server-side PDF generation for revenue reports.
* **Helmet, CORS, Morgan, Cookie-parser:** Security and middleware essentials.

### Third-Party Services
* **Stripe:** Hosted Checkout for payments with webhook-verified booking confirmation and idempotent event handling.
* **Cloudinary:** Cloud storage for user profile photos, service images, stylist photos, gallery albums, and category images.
* **Nodemailer (SMTP):** Transactional emails for OTP delivery, booking confirmations, 24-hour reminders, and status-change notifications, all wrapped in a branded dark-theme HTML template.

---

## ⚙️ Installation & Setup

Clone the repository and navigate to the project folder to install dependencies.
```bash
  git clone https://github.com/MrTharinduDasantha/GlowHaus.git
  cd GlowHaus
```

**1. MongoDB Setup**

Before running the backend, set up your database:
* Sign in to [MongoDB Atlas](https://www.mongodb.com/).
* Create a new cluster and database named `glowhaus_db`.
* Whitelist your IP address and create a database user.
* Copy the connection string — you will use it for the `MONGO_URI` environment variable in the next step.

> ℹ️ All required collections and indexes are created automatically by Mongoose on first connection. The admin account is **not** auto-provisioned — you'll seed one manually after the server is running (see Run the Application step).

**2. Cloudinary Setup**
 
* Sign up at [Cloudinary](https://cloudinary.com/) and grab your account's `CLOUDINARY_URL` from the dashboard.
* This single URL is used by the server for every image upload — profile photos, services, stylists, categories, and gallery albums.

**3. Server Deployment to Vercel & Stripe Webhook Setup**
 
GlowHaus's Stripe webhook requires a publicly reachable HTTPS endpoint. The simplest way to obtain one during development is to deploy the server to Vercel for free.
 
1. Push the project to your GitHub account.
2. Sign in to [Vercel](https://vercel.com/) and import the repository.
3. Set the **Root Directory** to `server` and deploy. You will receive a live URL like `https://your-project.vercel.app`.
4. Open the [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/test/webhooks) and click **Add destination**.
5. Select to the following three events:
   * `checkout.session.completed`
   * `checkout.session.expired`
   * `payment_intent.payment_failed`
6. Select destination type as **Webhook endpoint**
7. Add the **Endpoint URL** `https://your-project.vercel.app/api/stripe-webhook` and **Create destination**.
8. Then copy the **Signing secret** — this is your `STRIPE_WEBHOOK_SECRET`.
9. From [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/test/apikeys), copy your **Secret key** — this is your `STRIPE_SECRET_KEY`.

> ⚠️ Both keys must come from the **same Stripe environment** (test or live). Mixing them will cause webhook verification to fail.

**4. Server Setup (Backend)**
 
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```
 
**Environment Variables (Server)**
 
Create a `.env` file in the `server` folder and add the following configuration:
```bash
# ----- Server -----
PORT = 5000
NODE_ENV = development
CLIENT_URL = http://localhost:5173
 
# ----- MongoDB -----
MONGO_URI = "Enter your MongoDB connection string"
 
# ----- JWT / Auth -----
JWT_SECRET = glowhaus_website_secret_key
 
# ----- Cloudinary -----
CLOUDINARY_URL = "Enter your Cloudinary URL"
 
# ----- Stripe -----
STRIPE_SECRET_KEY = "Enter your Stripe secret key"
STRIPE_WEBHOOK_SECRET = "Enter your Stripe webhook signing secret"
 
# ----- Email (SMTP via Nodemailer) -----
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = "Enter your SMTP email"
SMTP_PASS = "Enter your SMTP app password"
SMTP_FROM = "Enter your SMTP email"
```

> 📧 For Gmail SMTP, generate an [App Password](https://myaccount.google.com/apppasswords).

**5. Client Setup (Frontend)**
 
Open a new terminal window, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```
 
**Environment Variables (Client)**
 
Create a `.env` file in the `client` folder and add the following configuration:
```bash
VITE_API_URL = "https://your-project.vercel.app/api"
```

> 💡 Use the live Vercel server URL for `VITE_API_URL` so Stripe webhooks can reach your backend in real time.

**6. Run the Application**
 
Start the backend server:
```bash
cd server
npm run dev
```
 
Start the frontend development server:
```bash
cd client
npm run dev
```
 
Open `http://localhost:5173` in your browser.

**Seed an admin account**
 
First, you register with the system through the register page. Then, you go to glowhaus_db in Mongodb and open the users collection. Then, change the role of the document related to the account for which you need admin access to "admin". Now, you can log in to the admin panel through the credentials of that account.
 
---

## 💻 Usage
 
**Admin Workflow:**
 
1. Visit `/admin/login` and sign in with the admin credentials you seeded above.

2. Open the **Dashboard** to view live KPIs (today's appointments, revenue, new customers, active stylists) and 7-day analytics.

3. Visit **Settings** and configure the salon's general info (name, address, phone, email, social links), upload a logo, set business hours per day, and tune booking rules (advance limit, cancellation notice, slot interval, cleaning gap).

4. Add **Categories** (Hair, Makeup, Skincare, Nails, Waxing & Threading, Spa & Massage, Bridal Packages) — each with an image, name, and description.

5. Add **Stylists** with their photo, expertise, bio, contact info, per-day working hours (with optional breaks), and any days off.

6. Create **Services** with full description, benefits, price, duration, and multi-image gallery uploads. After creating each service, click the **Assign Stylists** icon and tick the qualified stylists.

7. Optionally create **Promo Codes** (percentage or fixed) with min booking value, max discount cap, expiry, and usage limit.

8. Use **Appointments** to view, filter, and manage every booking — table view or calendar view. Confirm pending bookings, mark completed appointments, send manual reminders, reschedule, or create walk-in bookings on the spot.

9. Manage **Customers**, moderate **Reviews** (approve/reject/delete), curate **Gallery** albums, track **Payments**, and export filterable revenue **Reports** as PDF.

**User Workflow:**
 
1. **Register** an account with name, email, password, and an optional profile photo.

2. From the home page, browse featured services or visit **Services** and filter by category, search by name, and sort by newest, price, or rating.

3. Open a **Service** to view its full description, benefits, image gallery, and customer reviews. Optionally pick a preferred stylist, then tap **Add to Bag**.

4. Add additional services to your **Bag** as needed. The total price and combined duration update live.

5. Continue to **Date & Stylist** — pick a stylist who can perform every service in your bag, choose a date on the calendar, and select an available time slot from the visual grid.

6. Review your **Booking Summary** — services, stylist, date/time, fare breakdown including any applied promo code — and tap **Pay & Confirm Booking**.

7. Complete payment on Stripe's hosted checkout page. On success, you'll be returned to GlowHaus with a **confirmed booking** displayed on screen, an **Add to Google Calendar** link, and an automated email containing your full booking details and cancellation policy.

8. Access **My Bookings** anytime to view upcoming, completed, and cancelled appointments. **Cancel** or **reschedule** within the allowed window. After an appointment is marked completed, write a **review and rating** for each service.

9. Save services to **Favorites** for quick access later, edit your profile photo and contact details, or change your password from the **Profile** page.

---

## 📸 Screenshots

### User Authentication (Login, Register, Forgot Password)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%201.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%202.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%203.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%204.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%205.png)

### Public Pages (Home, Services, Service Detail)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%206.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%207.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%208.png)

### Stylists Directory & Stylist Detail
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%209.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2010.png)

### Gallery & About / Contact
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2011.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2012.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2013.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2014.png)

### Booking Flow (Bag → Date & Stylist → Summary → Payment)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2015.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2016.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2017.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2018.png)

### Booking Confirmation & My Bookings
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2019.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2020.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2021.png)

### Customer Profile (with Change Password) & Favorites
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2022.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2023.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2024.png)

### Admin Login & Dashboard
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2025.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2026.png)

### Admin — Appointments 
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2027.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2028.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2029.png)

### Admin - Services
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2030.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2031.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2032.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2033.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2034.png)

### Admin - Categories
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2035.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2036.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2037.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2038.png)

### Admin - Stylists
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2039.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2040.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2041.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2042.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2043.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2044.png)

### Admin - Customers
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2045.png)

### Admin - Payments
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2046.png)

### Admin - Promo Codes
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2047.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2048.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2049.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2050.png)

### Admin - Gallery
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2050.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2051.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2052.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2053.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2054.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2055.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2056.png)

### Admin - Reviews
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2057.png)

### Admin - Reports
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2058.png)

### Admin - Settings
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2059.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2060.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2061.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2062.png)
![image alt](https://github.com/MrTharinduDasantha/GlowHaus/blob/da6f03cf937dc68b19b2880b2d3ac65b4634e664/client/src/assets/website-images/Img%20-%2063.png)

<h4 align="center"> Don't forget to leave a star ⭐️ </h4>
