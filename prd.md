# Product Requirements Document (PRD)
## SoftMarket — Software Marketplace Platform

| Field | Detail |
|---|---|
| Document Version | 1.0 |
| Status | Draft for Review |
| Author | from team |
| Last Updated | July 14, 2026 |
| Project Type | End-to-End Web Application |

---

## 1. Executive Summary

SoftMarket is a web-based marketplace where **Sellers** (individual developers, agencies, or software vendors) can list software products with detailed descriptions, screenshots, pricing, and licensing information. **Buyers** can browse, search, and filter these listings, view full product details, and either contact the seller directly or purchase the software/license through an integrated **Razorpay** payment gateway. The platform acts as a bridge between software creators and potential buyers, similar in spirit to marketplaces like Flippa, CodeCanyon, or G2, but tailored to direct software sales and lead-based contact.

This document defines the scope, features, architecture, data model, and delivery plan for the first production-ready version (v1.0) of the platform.

---

## 2. Goals & Objectives

### 2.1 Business Goals
- Create a centralized platform where software products can be discovered and purchased.
- Enable sellers to monetize software through both **direct sales (Razorpay checkout)** and **lead generation (contact-to-buy)**.
- Build trust between buyers and sellers through verified listings, ratings, and transaction history.
- Generate revenue through commission on sales, featured listing fees, or subscription-based seller plans (future phase).

### 2.2 Product Goals
- Provide an intuitive, fast, and responsive UI for browsing and listing software.
- Ensure secure, PCI-DSS-aligned payment handling via Razorpay.
- Support scalable backend architecture (Spring Boot + Supabase) to handle growing listings and users.
- Maintain high data integrity for transactions, listings, and user accounts.

### 2.3 Success Metrics (KPIs)
| Metric | Target (First 6 Months) |
|---|---|
| Registered Sellers | 200+ |
| Active Listings | 500+ |
| Registered Buyers | 2,000+ |
| Successful Transactions | 150+ |
| Avg. Page Load Time | < 2 seconds |
| Payment Success Rate | > 97% |
| Platform Uptime | 99.5% |

---

## 3. Target Users & Personas

### 3.1 Seller (Vendor)
- Independent developers, small software agencies, SaaS owners, students selling academic/mini projects.
- Wants to list software with proper documentation, screenshots, demo links, and pricing.
- Wants visibility, buyer inquiries, and secure payment collection.

### 3.2 Buyer
- Businesses or individuals looking to purchase ready-made software, source code, or licenses.
- Wants to compare products, check credibility (ratings/reviews), and either message the seller or pay directly.

### 3.3 Admin
- Platform owner/moderator.
- Approves/rejects listings, manages disputes, monitors transactions, manages users, and oversees commission/revenue.

---

## 4. Scope

### 4.1 In Scope (v1.0)
- User registration/login (Buyer, Seller, Admin roles) with JWT-based authentication.
- Seller dashboard: create, edit, delete, and manage software listings.
- Software listing detail page: title, category, description, tech stack, screenshots, demo link, pricing (one-time/license-based), documentation upload.
- Buyer-facing marketplace: search, filter (by category, price, tech stack, rating), sort, and pagination.
- Contact Seller feature: buyer sends inquiry via in-platform contact form (captures name, email, phone, message) → notification to seller via email.
- Direct Purchase flow: buyer pays via Razorpay checkout for listed price; seller notified of successful payment; buyer receives access/download link or contact unlock.
- Ratings & reviews for purchased/contacted software.
- Admin panel: listing approval workflow, user management, transaction monitoring, commission configuration.
- Notification system (email) for key events: new inquiry, payment success/failure, listing approval/rejection.
- Order history for buyers; sales history for sellers.

### 4.2 Out of Scope (v1.0 — Future Phases)

- In-app real-time chat (initial version uses form-based contact + email).
- Multi-currency support (v1.0 supports INR only via Razorpay).
- Mobile native apps (iOS/Android) — web is responsive only.
- AI-based recommendation engine.
- Subscription/SaaS licensing automation (license key generation) — v1.0 supports manual/document-based delivery.
- Affiliate/referral program.

---

## 5. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | **Java, Spring Boot (REST APIs)** *(Required)* |
| Database | **Supabase (PostgreSQL)** *(Required)* |
| Authentication | Spring Security + JWT + **Two-Factor Authentication (2FA)** |
| Payment Gateway | Razorpay (Orders API, Payment Capture, Webhooks) |
| File/Media Storage | Supabase Storage (for screenshots, documents, demo files) |
| Email Service | **Resend (via Supabase integration)** |
| SMS Service | **Textbee (OTP, notifications)** |
| CDN & Caching | **CloudFlare (CDN, caching, DDoS protection)** |
| CAPTCHA | **Cloudflare Turnstile (bot protection)** |
| KYC Verification | Third-party KYC provider integration (e.g., Aadhaar, PAN verification) |
| AI Integration | **NVIDIA NIM (AI-powered features)** |
| Security | **HaveIBeenPwned API (password breach detection)** |
| Internationalization | i18next (multi-language support) |
| Hosting (suggested) | AWS EC2 / Render / Railway (backend), Vercel/Netlify with CloudFlare CDN (frontend) |
| Version Control & CI/CD | GitHub + GitHub Actions |

---

## 6. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLOUDFLARE CDN & CACHING                        │
│                    (DDoS Protection, Turnstile CAPTCHA)                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────────────────┐
│                     Frontend (React + TypeScript + Vite)                 │
│  - Responsive Mobile UI (optimized hamburger menu)                       │
│  - Skeleton Loading States                                               │
│  - Multi-language Support (i18next)                                      │
│  - Form Validation (React Hook Form + Zod)                               │
└────────────────────────┬────────────────────────────────────────────────┘
                         │ REST APIs
                         ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot - REQUIRED)                      │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Security Layer:                                                    │  │
│  │ - JWT + Refresh Tokens                                             │  │
│  │ - Two-Factor Authentication (2FA via SMS/Email)                    │  │
│  │ - HaveIBeenPwned API (password breach check)                       │  │
│  │ - KYC Verification                                                 │  │
│  │ - Admin Access Control (enable/disable user access)                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Business Logic:                                                    │  │
│  │ - Listing Management                                               │  │
│  │ - Order Processing                                                 │  │
│  │ - Payment Integration (Razorpay)                                   │  │
│  │ - KYC Workflow                                                     │  │
│  │ - NVIDIA NIM AI Integration                                        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────┬───────────────┬──────────────┬──────────────┬──────────────┘
           │               │              │              │
           ▼               ▼              ▼              ▼
    ┌────────────┐  ┌────────────┐ ┌───────────┐ ┌──────────────┐
    │ Supabase   │  │  Razorpay  │ │ Textbee   │ │  Resend      │
    │ (Database  │  │  Payment   │ │ (SMS OTP  │ │  (Email)     │
    │ + Storage) │  │  Gateway   │ │ & Alerts) │ │              │
    └────────────┘  └────────────┘ └───────────┘ └──────────────┘
           │                              │              │
           │                              └──────┬───────┘
           │                                     │
           ▼                                     ▼
    ┌──────────────────────┐         ┌──────────────────────┐
    │ KYC Service Provider │         │   NVIDIA NIM API     │
    │ (Aadhaar/PAN verify) │         │ (AI-powered features)│
    └──────────────────────┘         └──────────────────────┘
```

### 6.1 Architecture Notes
- **Frontend** communicates with backend exclusively via REST APIs (JSON); served through **CloudFlare CDN** for optimal performance, caching, and DDoS protection.
- **Backend** is a modular **Spring Boot** monolith (v1.0 - REQUIRED) structured into layers: Controller → Service → Repository, with clear separation for Auth, Listings, Orders, Payments, KYC, and Admin modules. (Can evolve into microservices post v1.0 if scale demands.)
- **Supabase** (REQUIRED) is used as a managed PostgreSQL database; Supabase Storage handles file uploads (screenshots, docs); **Resend** (available in Supabase) handles transactional emails.
- **Razorpay** handles order creation, payment capture, and webhook-based payment status confirmation (server-to-server) to avoid relying solely on client-side confirmation (security best practice).
- **Textbee** manages SMS delivery for OTP (2FA), payment confirmations, and critical user notifications.
- **Cloudflare Turnstile** provides bot protection and CAPTCHA functionality without user friction.
- **HaveIBeenPwned API** is integrated at registration/password-change to check if passwords have been compromised in known breaches.
- **NVIDIA NIM** provides AI-powered features such as intelligent search, recommendation engine, and content moderation.
- **KYC Verification** integrated for seller verification (Aadhaar/PAN or equivalent) to build trust and prevent fraud.
- **CDN & Caching Strategy**: CloudFlare CDN caches static assets; API responses cached where appropriate (listing browsing, categories); cache invalidation on data updates.

---

## 7. Functional Requirements

### 7.1 Authentication & User Management
- FR-1.1: Users can register as Buyer or Seller with email/password.
- FR-1.2: Passwords stored using BCrypt hashing.
- FR-1.3: **Password breach detection**: Integration with **HaveIBeenPwned API** to warn users if their password has been compromised in known data breaches.
- FR-1.4: **Two-Factor Authentication (2FA)**: Users can enable 2FA via SMS (Textbee) or Email (Resend) for enhanced account security.
- FR-1.5: JWT-based login; refresh token support for session persistence.
- FR-1.6: Email verification on signup (OTP or verification link via Resend).
- FR-1.7: **SMS OTP verification** via Textbee for critical actions (password reset, 2FA login, high-value transactions).
- FR-1.8: **Cloudflare Turnstile CAPTCHA** on registration, login, and contact forms to prevent bot abuse.
- FR-1.9: Role-based access control (Buyer, Seller, Admin) enforced at the API level.
- FR-1.10: **Admin Access Control**: Admins can enable/disable user access to the platform (account suspension/activation).
- FR-1.11: Forgot password / reset password flow with SMS OTP option.
- FR-1.12: Profile management (name, contact info, company details for sellers).
- FR-1.13: **KYC Verification for Sellers**: Sellers must complete KYC (Aadhaar/PAN verification or equivalent) before listings are approved; verified badge displayed on profile.

### 7.2 Software Listing Management (Seller)
- FR-2.1: Seller can create a listing with: title, category, short description, full description, tech stack tags, price, license type (one-time/per-seat), screenshots (multiple), demo URL, documentation file upload.
- FR-2.2: **Form Validation**: All input fields validated using **React Hook Form + Zod** on frontend and Spring Validation on backend; real-time error feedback.
- FR-2.3: Listings go into "Pending Review" status until Admin approves; **KYC-verified sellers** prioritized in approval queue.
- FR-2.4: Seller can edit/update or deactivate their own listings.
- FR-2.5: Seller dashboard shows views, inquiries, and sales count per listing with **skeleton loading states** during data fetch.
- FR-2.6: **AI-Powered Content Moderation**: NVIDIA NIM integration to automatically flag inappropriate content, spam, or policy violations in listing descriptions.

### 7.3 Marketplace Browsing (Buyer)
- FR-3.1: Public marketplace homepage displays approved listings with pagination and **skeleton loading states** during initial load.
- FR-3.2: **AI-Powered Search**: NVIDIA NIM integration for intelligent semantic search by keyword (title/description/tags) with natural language understanding.
- FR-3.3: Filter by category, price range, tech stack, rating, **KYC-verified sellers**.
- FR-3.4: Sort by newest, price (low-high/high-low), rating, popularity.
- FR-3.5: Listing detail page shows full info, seller profile snippet (with KYC badge), reviews, and two CTAs: "Contact Seller" and "Buy Now."
- FR-3.6: **Multi-Language Support**: Entire UI available in multiple languages (English, Hindi, Spanish, etc.) using i18next; user preference saved.
- FR-3.7: **AI Recommendations**: NVIDIA NIM-powered recommendation engine suggests similar or complementary products based on browsing history.
- FR-3.8: **Mobile-Optimized View**: Enhanced mobile navigation with optimized hamburger menu, touch gestures, and mobile-first layout.

### 7.4 Contact-to-Buy Flow & Enquiry Management
- FR-4.1: Buyer submits inquiry form (name, email, phone, message) on a listing page; **form validation** with real-time error feedback; **Cloudflare Turnstile CAPTCHA** to prevent spam.
- FR-4.2: Inquiry stored in DB and emailed to the seller via **Resend**; SMS notification sent via **Textbee** for high-priority inquiries.
- FR-4.3: Seller can view all inquiries in their dashboard and mark as responded.
- FR-4.4: **General Contact Page**: Dedicated contact page for platform-level inquiries (support, partnerships, feedback) with CAPTCHA protection.
- FR-4.5: **Enquiry Page**: Separate enquiry form for business/bulk purchase requests with file upload support (RFQ documents).

### 7.5 Direct Purchase Flow (Razorpay)
- FR-5.1: Buyer clicks "Buy Now" → backend creates a Razorpay Order via Orders API.
- FR-5.2: Frontend opens Razorpay Checkout widget with order details.
- FR-5.3: **2FA Verification**: For high-value transactions (> ₹10,000), buyer must complete 2FA verification (SMS OTP via Textbee) before payment.
- FR-5.4: On payment success, Razorpay returns payment ID + signature to frontend; frontend sends this to backend for **signature verification**.
- FR-5.5: Backend verifies via Razorpay webhook (server-side) as the source of truth for payment status (not just client callback).
- FR-5.6: On verified success: order status updated to "Paid," buyer gets access to download link/documentation (via Supabase Storage signed URL), seller notified via **Email (Resend) + SMS (Textbee)**, commission calculated and recorded.
- FR-5.7: On failure: order marked "Failed," buyer notified with retry option.
- FR-5.8: Refund handling (manual, Admin-triggered in v1.0) via Razorpay Refunds API; notifications sent via Email + SMS.

### 7.6 Reviews & Ratings
- FR-6.1: Only buyers who purchased or had an accepted inquiry can leave a review.
- FR-6.2: Reviews include star rating (1–5) and text comment.
- FR-6.3: Average rating displayed on listing card and detail page.

### 7.7 Admin Panel
- FR-7.1: Approve/reject new listings with a rejection reason; **AI-assisted review** using NVIDIA NIM for automated content policy checks.
- FR-7.2: View/manage all users (activate/deactivate/ban); **Admin Access Control** to enable/disable user access to platform features.
- FR-7.3: **KYC Approval Workflow**: Review and approve/reject seller KYC documents; manual verification override.
- FR-7.4: View all transactions, filter by status/date/seller.
- FR-7.5: Configure platform commission percentage.
- FR-7.6: View platform-wide analytics (total sales, active listings, top sellers, KYC completion rate).
- FR-7.7: Handle refund requests and disputes.
- FR-7.8: **User Access Management**: Granular control to disable/enable specific features per user (e.g., disable selling capability, restrict purchases).
- FR-7.9: **Content Moderation Dashboard**: AI-flagged content review queue powered by NVIDIA NIM.

### 7.8 Notifications & Communication
- FR-8.1: **Email notifications** via **Resend**: signup verification, listing approval/rejection, new inquiry, payment success/failure, review received, KYC status updates.
- FR-8.2: **SMS notifications** via **Textbee**: OTP for 2FA, payment confirmations, high-priority alerts, order status updates.
- FR-8.3: (Optional v1.1) In-app notification bell/dropdown.
- FR-8.4: **Multi-channel notification preferences**: Users can choose preferred notification methods (Email, SMS, or both) per notification type.

### 7.9 UI/UX Enhancements
- FR-9.1: **Skeleton Loading States**: All data-fetching screens (marketplace, dashboards, product details) display skeleton loaders instead of spinners for better perceived performance.
- FR-9.2: **Form Validation**: Real-time client-side validation using **React Hook Form + Zod**; server-side validation using Spring Validation; consistent error messaging.
- FR-9.3: **Mobile-First Navigation**: Optimized hamburger menu with smooth slide-in animation, touch-friendly tap targets (min 44x44px), swipe gestures for navigation.
- FR-9.4: **Multi-Language Support**: Full i18next integration with language switcher in header; supported languages: English (default), Hindi, Spanish, French; RTL support for Arabic (future phase).
- FR-9.5: **Progressive Web App (PWA)**: Service worker for offline capability, app-like experience on mobile devices.
- FR-9.6: **Update Mechanism**: In-app notification for new app versions; prompt users to refresh; version update banner.

### 7.10 Performance & Caching
- FR-10.1: **CloudFlare CDN**: All static assets (images, CSS, JS) served via CloudFlare CDN for global low-latency access.
- FR-10.2: **API Response Caching**: CloudFlare caches frequently accessed endpoints (public listings, categories, top products); cache invalidation on data updates.
- FR-10.3: **Supabase Storage CDN**: Product images, screenshots, and documents served through Supabase Storage with CDN support.
- FR-10.4: **Browser Caching**: Aggressive caching headers for static assets; versioned file names for cache busting.
- FR-10.5: **Lazy Loading**: Images lazy-loaded using Intersection Observer; route-based code splitting for faster initial page load.

### 7.11 Security & Compliance
- FR-11.1: **Cloudflare Turnstile CAPTCHA**: Integrated on all public forms (registration, login, contact, inquiry) to prevent bot abuse; invisible CAPTCHA for better UX.
- FR-11.2: **HaveIBeenPwned Integration**: Password breach check at registration and password change; warn users if password found in breach database; force password change if compromised.
- FR-11.3: **Two-Factor Authentication (2FA)**: Optional 2FA via SMS (Textbee) or Email (Resend); mandatory for sellers with high transaction volume.
- FR-11.4: **KYC Verification**: Sellers must complete KYC (Aadhaar/PAN/equivalent) before selling; document upload, manual admin review, verification badge on profile.
- FR-11.5: **Rate Limiting**: API rate limiting per IP and per user; protection against brute force attacks.
- FR-11.6: **CSRF Protection**: CSRF tokens on all state-changing requests.
- FR-11.7: **Content Security Policy (CSP)**: Strict CSP headers to prevent XSS attacks.

### 7.12 AI-Powered Features (NVIDIA NIM)
- FR-12.1: **Intelligent Search**: Semantic search understanding natural language queries; contextual product recommendations.
- FR-12.2: **Content Moderation**: Automated flagging of inappropriate content, spam, or policy violations in listings and reviews.
- FR-12.3: **Recommendation Engine**: Personalized product recommendations based on browsing history, purchase patterns, and similar user behavior.
- FR-12.4: **Chatbot Assistant**: AI-powered customer support chatbot for common queries, guided product discovery.
- FR-12.5: **Fraud Detection**: AI model to detect suspicious listing patterns, fake reviews, or fraudulent seller behavior.

---

## 8. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Page load < 2s; API response time < 500ms for standard queries; **CloudFlare CDN** for sub-100ms asset delivery globally |
| Scalability | Backend stateless (JWT) to allow horizontal scaling behind a load balancer; **CloudFlare caching** for traffic spike handling |
| Security | HTTPS everywhere, JWT expiry + refresh tokens, input validation, RBAC, Razorpay signature verification, rate limiting on auth endpoints, **2FA**, **HaveIBeenPwned** password checks, **Cloudflare Turnstile CAPTCHA**, **KYC verification** |
| Availability | Target 99.5% uptime; **CloudFlare DDoS protection** |
| Data Privacy | Buyer/seller PII encrypted at rest where applicable; GDPR-aware data handling; **KYC documents encrypted** |
| Maintainability | Modular Spring Boot structure (packages by feature: auth, listing, order, payment, kyc, admin, ai) |
| Responsiveness | Fully responsive UI (mobile, tablet, desktop) using Tailwind breakpoints; **optimized mobile hamburger menu**, touch-friendly UI |
| Internationalization | **Multi-language support** using i18next; language preference persisted per user |
| Accessibility | **Skeleton loaders** for better perceived performance; **form validation** with clear error messages; WCAG 2.1 AA compliance |
| Logging & Monitoring | Centralized logging (e.g., ELK/Grafana-Loki) for backend; audit logs for admin actions and payment events; **AI-powered anomaly detection** |
| Browser Support | Latest 2 versions of Chrome, Firefox, Edge, Safari; **PWA support** for mobile app-like experience |

---

## 9. Database Schema (High-Level)

### Core Tables

**users**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar | |
| email | varchar (unique) | |
| password_hash | varchar | |
| role | enum('BUYER','SELLER','ADMIN') | |
| phone | varchar | |
| is_verified | boolean | Email verified |
| **two_factor_enabled** | **boolean** | **2FA enabled flag** |
| **two_factor_method** | **enum('SMS','EMAIL')** | **2FA delivery method** |
| **kyc_status** | **enum('PENDING','APPROVED','REJECTED','NOT_SUBMITTED')** | **KYC verification status** |
| **kyc_documents** | **jsonb** | **Encrypted KYC document references** |
| **account_status** | **enum('ACTIVE','SUSPENDED','DISABLED')** | **Admin access control** |
| **preferred_language** | **varchar** | **User language preference** |
| created_at | timestamp | |

**listings**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| seller_id | UUID (FK → users.id) | |
| title | varchar | |
| short_description | text | |
| full_description | text | |
| category | varchar | |
| tech_stack | text[] | |
| price | numeric | |
| license_type | enum('ONE_TIME','PER_SEAT') | |
| status | enum('PENDING','APPROVED','REJECTED','INACTIVE') | |
| demo_url | varchar | |
| created_at | timestamp | |

**listing_media**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| listing_id | UUID (FK) | |
| file_url | varchar | Supabase Storage URL |
| file_type | enum('SCREENSHOT','DOCUMENT') | |

**inquiries**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| listing_id | UUID (FK) | |
| buyer_id | UUID (FK, nullable if guest) | |
| name | varchar | |
| email | varchar | |
| phone | varchar | |
| message | text | |
| status | enum('NEW','RESPONDED') | |
| created_at | timestamp | |

**orders**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| listing_id | UUID (FK) | |
| buyer_id | UUID (FK) | |
| razorpay_order_id | varchar | |
| razorpay_payment_id | varchar (nullable) | |
| amount | numeric | |
| commission_amount | numeric | |
| status | enum('CREATED','PAID','FAILED','REFUNDED') | |
| created_at | timestamp | |

**reviews**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| listing_id | UUID (FK) | |
| buyer_id | UUID (FK) | |
| rating | int (1–5) | |
| comment | text | |
| created_at | timestamp | |

**notifications**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK) | |
| type | varchar | |
| **channel** | **enum('EMAIL','SMS','IN_APP')** | **Notification delivery channel** |
| message | text | |
| is_read | boolean | |
| created_at | timestamp | |

**kyc_verifications**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| user_id | UUID (FK → users.id) | |
| document_type | enum('AADHAAR','PAN','PASSPORT','DRIVING_LICENSE') | |
| document_number | varchar (encrypted) | |
| document_url | varchar | Supabase Storage (encrypted) |
| verification_status | enum('PENDING','APPROVED','REJECTED') | |
| admin_notes | text | Rejection reason or notes |
| verified_at | timestamp | |
| created_at | timestamp | |

**contact_enquiries**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | varchar | |
| email | varchar | |
| phone | varchar | |
| subject | varchar | |
| message | text | |
| enquiry_type | enum('SUPPORT','PARTNERSHIP','FEEDBACK','BULK_PURCHASE') | |
| status | enum('NEW','IN_PROGRESS','RESOLVED') | |
| assigned_to | UUID (FK → users.id, nullable) | Admin assigned |
| created_at | timestamp | |

**ai_moderation_logs**
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| content_type | enum('LISTING','REVIEW','INQUIRY') | |
| content_id | UUID | Reference to listing/review/inquiry |
| ai_flag_reason | text | NVIDIA NIM detection reason |
| confidence_score | decimal | AI confidence (0-1) |
| admin_reviewed | boolean | Manual review completed |
| action_taken | enum('APPROVED','REJECTED','FLAGGED') | |
| created_at | timestamp | |

---

## 10. API Design (Representative Endpoints)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh-token`
- `POST /api/auth/verify-email`
- **`POST /api/auth/enable-2fa`** — Enable 2FA for user
- **`POST /api/auth/verify-2fa`** — Verify 2FA code during login
- **`POST /api/auth/disable-2fa`** — Disable 2FA
- **`POST /api/auth/send-otp`** — Send OTP via SMS (Textbee) or Email (Resend)
- **`POST /api/auth/check-password-breach`** — HaveIBeenPwned password check

### Listings
- `GET /api/listings` (query params: search, category, minPrice, maxPrice, sort, page, **kycVerified**, **language**)
- `GET /api/listings/{id}`
- `POST /api/listings` (Seller, auth required, **form validation**)
- `PUT /api/listings/{id}` (Seller, owner-only)
- `DELETE /api/listings/{id}` (Seller, owner-only)
- `PATCH /api/admin/listings/{id}/approve` (Admin)
- `PATCH /api/admin/listings/{id}/reject` (Admin)
- **`POST /api/listings/ai-search`** — NVIDIA NIM-powered semantic search

### Inquiries
- `POST /api/listings/{id}/inquiries` (**with CAPTCHA verification**)
- `GET /api/seller/inquiries`
- **`POST /api/contact`** — General contact form (**with CAPTCHA**)
- **`POST /api/enquiry`** — Business enquiry form (**with CAPTCHA, file upload**)

### Orders/Payments
- `POST /api/orders/create` → creates Razorpay order (**with 2FA for high-value**)
- `POST /api/orders/verify` → verifies payment signature
- `POST /api/webhooks/razorpay` → server-side webhook listener
- `GET /api/buyer/orders`
- `GET /api/seller/sales`

### Reviews
- `POST /api/listings/{id}/reviews` (**with form validation**)
- `GET /api/listings/{id}/reviews`

### Admin
- `GET /api/admin/users`
- `PATCH /api/admin/users/{id}/status` (**enable/disable access**)
- **`GET /api/admin/kyc-pending`** — Get pending KYC verifications
- **`PATCH /api/admin/kyc/{id}/approve`** — Approve KYC
- **`PATCH /api/admin/kyc/{id}/reject`** — Reject KYC with reason
- `GET /api/admin/transactions`
- `GET /api/admin/analytics`
- **`GET /api/admin/ai-moderation-queue`** — AI-flagged content
- **`PATCH /api/admin/content/{id}/moderate`** — Manual moderation action

### KYC
- **`POST /api/kyc/submit`** — Submit KYC documents (Seller)
- **`GET /api/kyc/status`** — Check own KYC status
- **`PUT /api/kyc/resubmit`** — Resubmit after rejection

### AI & Recommendations (NVIDIA NIM)
- **`POST /api/ai/recommend`** — Get personalized recommendations
- **`POST /api/ai/moderate-content`** — AI content moderation check
- **`POST /api/ai/chatbot`** — AI chatbot query

### User Preferences
- **`PATCH /api/user/language`** — Update language preference
- **`PATCH /api/user/notification-preferences`** — Update notification channels

---

## 11. Key User Flows

### 11.1 Buyer Purchase Flow
1. Buyer browses marketplace → opens listing detail page.
2. Clicks "Buy Now" → frontend calls `POST /api/orders/create`.
3. Backend creates Razorpay order, returns `order_id` to frontend.
4. Razorpay Checkout widget opens; buyer completes payment.
5. Frontend receives payment response → calls `POST /api/orders/verify`.
6. Backend verifies signature; Razorpay webhook independently confirms payment.
7. Order marked "PAID"; buyer redirected to success page with access link; seller notified.

### 11.2 Seller Listing Flow
1. Seller logs in → navigates to "Create Listing."
2. Fills details, uploads screenshots/docs → submits.
3. Listing status = "PENDING."
4. Admin reviews → approves/rejects.
5. If approved, listing goes live on marketplace.

### 11.3 Contact-to-Buy Flow
1. Buyer opens listing → clicks "Contact Seller."
2. Fills inquiry form → submitted to backend.
3. Seller receives email + dashboard notification.
4. Seller responds outside platform or updates inquiry status.

---

## 12. UI/UX Guidelines (High-Level)

- **Design system**: Tailwind CSS utility-first approach; consistent spacing scale, a defined color palette (primary/accent/neutral), and reusable components (cards, buttons, badges, modals).
- **Key pages**: Home/Marketplace, Listing Detail, Seller Dashboard, Buyer Dashboard, Admin Dashboard, Login/Register, Checkout confirmation, **Contact Page**, **Enquiry Page**, **KYC Submission**, **2FA Setup**.
- **Responsiveness**: Mobile-first layout; grid-based listing cards that reflow across breakpoints; **optimized mobile hamburger menu** with smooth animations.
- **Loading States**: **Skeleton loaders** on all data-fetching screens (no spinners); progressive loading for better perceived performance.
- **Form Validation**: Real-time validation with **React Hook Form + Zod**; clear error messages; success feedback.
- **Multi-Language**: Language switcher in header; persistent user preference; translated content via i18next.
- **Accessibility**: Semantic HTML, sufficient color contrast, keyboard-navigable forms, ARIA labels, **CAPTCHA accessibility**.
- **Mobile Optimizations**: 
  - Touch-friendly buttons (min 44x44px)
  - Swipe gestures for navigation
  - Optimized hamburger menu with slide-in animation
  - Bottom navigation bar for quick access
  - Pull-to-refresh on lists
  - Thumb-zone optimized CTAs

---

## 13. Security Considerations

- All API endpoints (except public listing browse) require JWT authentication.
- **Two-Factor Authentication (2FA)** available via SMS (Textbee) or Email (Resend); mandatory for high-value transactions and high-volume sellers.
- **Password Breach Detection**: HaveIBeenPwned API integrated at registration and password change to warn users of compromised passwords.
- **CAPTCHA Protection**: Cloudflare Turnstile on all public forms (registration, login, contact, inquiry) to prevent bot abuse.
- Role-based authorization enforced via Spring Security method-level annotations (`@PreAuthorize`).
- Razorpay payment verification must always be confirmed server-side via webhook signature validation — never trust client-side success callbacks alone.
- Input validation & sanitization on all forms (especially listing descriptions to prevent stored XSS); **React Hook Form + Zod** on frontend, Spring Validation on backend.
- File upload validation (type/size restrictions) before storing in Supabase Storage; **KYC documents encrypted at rest**.
- Rate limiting on login/register/contact endpoints to prevent abuse; **CloudFlare rate limiting** at edge for additional protection.
- Sensitive secrets (Razorpay keys, JWT secret, DB credentials, Textbee API key, NVIDIA NIM API key) stored in environment variables, never committed to source control.
- HTTPS enforced across frontend and backend; **CloudFlare SSL/TLS**.
- **Content Security Policy (CSP)** headers to prevent XSS attacks.
- **Admin Access Control**: Granular permissions to enable/disable user access to specific platform features.
- **KYC Verification**: Sellers verified before listing approval; verification badge displayed; documents encrypted.
- **AI-Powered Fraud Detection**: NVIDIA NIM monitors for suspicious patterns in listings, reviews, and user behavior.

---

## 14. Assumptions & Constraints

- Initial launch targets the Indian market (INR currency, Razorpay as sole gateway); **Textbee for SMS** (India coverage); **KYC via Aadhaar/PAN**.
- Software delivery (source code/binaries) is handled via secure download link or document access post-purchase, not automated licensing.
- Admin approval is manual in v1.0; **AI-assisted via NVIDIA NIM** for initial filtering.
- **Multi-language UI** in v1.0: English, Hindi, Spanish, French; more languages in future phases.
- **CloudFlare CDN** required for performance and security targets.
- **Spring Boot backend is mandatory** for this project.
- **Supabase is the required database** provider.

---

## 15. Milestones & Delivery Plan (Suggested)

| Phase | Deliverables | Est. Duration |
|---|---|---|
| Phase 1 | Requirement finalization, DB schema, project setup (frontend/backend/Supabase), **CloudFlare setup** | 1 week |
| Phase 2 | Auth module (register/login/JWT/roles/**2FA**/**HaveIBeenPwned**/**CAPTCHA**) | 2 weeks |
| Phase 3 | Listing module (CRUD, media upload, admin approval, **AI moderation**, **form validation**, **skeleton loaders**) | 2 weeks |
| Phase 4 | Marketplace browse/search/filter (buyer-facing, **AI search**, **multi-language**, **mobile optimization**) | 1.5 weeks |
| Phase 5 | Contact-to-buy (inquiries) module + **Contact Page** + **Enquiry Page** (**with CAPTCHA**) | 1 week |
| Phase 6 | Razorpay integration (order creation, verification, webhook, **2FA for high-value**) | 1.5 weeks |
| Phase 7 | **KYC Verification** system (document upload, admin approval, badges) | 1.5 weeks |
| Phase 8 | Reviews & ratings module (**with form validation**, **AI moderation**) | 1 week |
| Phase 9 | Admin panel (users, transactions, analytics, **KYC approval**, **access control**, **AI moderation queue**) | 2 weeks |
| Phase 10 | Notifications (**Resend email** + **Textbee SMS** integration, multi-channel preferences) | 1 week |
| Phase 11 | **NVIDIA NIM AI integration** (search, recommendations, moderation, chatbot) | 2 weeks |
| Phase 12 | **CDN & Caching** (CloudFlare setup, cache strategy, performance optimization) | 1 week |
| Phase 13 | **Multi-language** (i18next setup, translations for English, Hindi, Spanish, French) | 1 week |
| Phase 14 | **Mobile optimization** (hamburger menu, touch UI, PWA setup, **update mechanism**) | 1 week |
| Phase 15 | QA, security testing (penetration testing, **CAPTCHA testing**, **2FA testing**), deployment (staging → production) | 2 weeks |

**Estimated Total: ~18–20 weeks** for a single full-stack developer; shorter with a small team.

---

## 16. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Payment verification bypass (client-only trust) | Enforce server-side webhook verification as source of truth; **2FA for high-value transactions** |
| Fake/low-quality listings | Admin approval workflow + **AI content moderation (NVIDIA NIM)** + reporting mechanism + **KYC verification** |
| Fraudulent buyers/sellers | Verified email/phone, **KYC for sellers**, admin ban capability, review system, **AI fraud detection** |
| Scalability bottlenecks | Stateless JWT auth, connection pooling, pagination on all list APIs, **CloudFlare CDN & caching** |
| File storage abuse | File type/size validation, virus-scan hook (future), **encrypted KYC documents** |
| Bot attacks | **Cloudflare Turnstile CAPTCHA** on all public forms; rate limiting |
| Password breaches | **HaveIBeenPwned API** integration to warn users; force password change if compromised |
| Account takeover | **Two-Factor Authentication (2FA)** via SMS/Email; security alerts |
| SMS/Email delivery failures | **Multi-channel fallback** (SMS → Email or vice versa); retry logic; monitoring |
| AI model dependency | Fallback to traditional search/moderation if NVIDIA NIM unavailable; caching AI responses |
| KYC document forgery | Manual admin review; third-party KYC provider integration; document verification APIs |
| CDN/CloudFlare outage | Origin server fallback; multi-CDN strategy (future); uptime monitoring |
| Multi-language content quality | Professional translation services; community review; native speaker QA |

---

## 17. Appendix

### 17.1 Glossary
- **Listing**: A software product entry created by a seller.
- **Inquiry**: A buyer's message expressing interest without direct payment.
- **Order**: A payment transaction record tied to a listing and buyer.
- **Commission**: Platform's cut from a successful transaction.
- **2FA**: Two-Factor Authentication for enhanced security.
- **KYC**: Know Your Customer - identity verification process.
- **CAPTCHA**: Challenge-Response test to prevent bots (Cloudflare Turnstile).
- **CDN**: Content Delivery Network for fast global asset delivery (CloudFlare).
- **NIM**: NVIDIA Inference Microservices - AI model API.
- **Skeleton Loader**: Placeholder UI during data loading.
- **i18next**: Internationalization framework for multi-language support.
- **PWA**: Progressive Web App - web app with native app features.

### 17.2 Open Questions (To Be Resolved with Stakeholders)
- Will license/download delivery be automated (e.g., signed URL with expiry) or manual by seller?
- Should guest buyers be allowed to purchase without registration, or is account creation mandatory?
- What is the commission percentage model — flat or tiered by price?
- **Which KYC provider** should be integrated (Aadhaar, PAN, or third-party verification service)?
- **Which languages** should be prioritized after English, Hindi, Spanish, and French?
- **2FA default**: Should 2FA be optional or mandatory for all users vs. only sellers?
- **NVIDIA NIM pricing**: What is the cost structure for AI API usage at scale?
- **CloudFlare plan**: Which CloudFlare tier (Free, Pro, Business, Enterprise) for launch?
- **SMS pricing**: Textbee pricing per SMS; budget for OTP volumes?
- **Email limits**: Resend free tier limits; upgrade timeline?

### 17.3 Technology Integration Details

**Required API Keys & Services:**
1. **Supabase** (Required)
   - Project URL
   - Anon/Public Key
   - Service Role Key (backend only)
   - Storage bucket configuration

2. **Razorpay** (Required)
   - Key ID
   - Key Secret
   - Webhook Secret

3. **Textbee** (Required - SMS)
   - API Key
   - Sender ID
   - Template IDs for OTP

4. **Resend** (Required - Email)
   - API Key
   - Domain verification
   - Email templates

5. **Cloudflare** (Required - CDN & CAPTCHA)
   - Account setup
   - Turnstile site key & secret key
   - DNS configuration
   - SSL/TLS settings

6. **HaveIBeenPwned** (Required - Password Security)
   - API Key (optional for higher rate limits)
   - Integration endpoint

7. **NVIDIA NIM** (Required - AI Features)
   - API Key
   - Model selection
   - Usage quota

8. **KYC Provider** (To Be Determined)
   - API credentials
   - Verification flow setup
   - Webhook configuration

---

*End of Document*

---

## 📊 Feature Summary Checklist

### ✅ Core Platform Features (v1.0)
- [x] User registration/login (Buyer, Seller, Admin roles)
- [x] JWT-based authentication with refresh tokens
- [x] **Two-Factor Authentication (2FA)** via SMS/Email
- [x] **Password breach detection** (HaveIBeenPwned API)
- [x] Seller dashboard: create, edit, delete, manage listings
- [x] Buyer-facing marketplace: search, filter, sort, pagination
- [x] Contact Seller feature with inquiry management
- [x] Direct Purchase flow via Razorpay
- [x] Ratings & reviews system
- [x] Admin panel: listing approval, user management, analytics
- [x] Order history for buyers; sales history for sellers

### ✅ Security Features (v1.0)
- [x] **Cloudflare Turnstile CAPTCHA** (all public forms)
- [x] **KYC Verification** for sellers (Aadhaar/PAN)
- [x] **Admin Access Control** (enable/disable user access)
- [x] **HaveIBeenPwned** password breach checking
- [x] Rate limiting and DDoS protection (CloudFlare)
- [x] CSRF protection and CSP headers
- [x] Encrypted KYC documents at rest
- [x] **AI-powered fraud detection** (NVIDIA NIM)

### ✅ UI/UX Enhancements (v1.0)
- [x] **Skeleton loading states** (no spinners)
- [x] **Form validation** (React Hook Form + Zod + Spring Validation)
- [x] **Multi-language support** (i18next: EN, HI, ES, FR)
- [x] **Mobile-optimized navigation** (hamburger menu, touch-friendly)
- [x] **Progressive Web App (PWA)** support
- [x] **Update mechanism** for app version notifications
- [x] Responsive design across all devices

### ✅ Communication & Notifications (v1.0)
- [x] **Email notifications** (Resend via Supabase)
- [x] **SMS notifications** (Textbee for OTP, alerts)
- [x] Multi-channel notification preferences
- [x] **Contact page** with CAPTCHA
- [x] **Enquiry page** for business/bulk requests

### ✅ Performance & Optimization (v1.0)
- [x] **CloudFlare CDN** for global asset delivery
- [x] **API response caching** (CloudFlare)
- [x] **Browser caching** strategy
- [x] **Lazy loading** (images, routes)
- [x] Code splitting (automatic via Vite)
- [x] Supabase Storage CDN for media

### ✅ AI-Powered Features (v1.0)
- [x] **NVIDIA NIM integration** for:
  - **Intelligent semantic search**
  - **Content moderation** (automated flagging)
  - **Recommendation engine** (personalized)
  - **AI chatbot assistant**
  - **Fraud detection** patterns
- [x] AI-assisted admin review queue

### 📋 Technology Requirements
- **Backend**: Spring Boot (REQUIRED)
- **Database**: Supabase PostgreSQL (REQUIRED)
- **Email**: Resend (via Supabase)
- **SMS**: Textbee (REQUIRED)
- **CDN**: CloudFlare (REQUIRED)
- **CAPTCHA**: Cloudflare Turnstile (REQUIRED)
- **AI**: NVIDIA NIM (REQUIRED)
- **Security**: HaveIBeenPwned API (REQUIRED)
- **Payment**: Razorpay (REQUIRED)

### 🎯 Success Metrics (First 6 Months)
| Metric | Target |
|--------|--------|
| Registered Sellers | 200+ |
| KYC-Verified Sellers | 150+ |
| Active Listings | 500+ |
| Registered Buyers | 2,000+ |
| Successful Transactions | 150+ |
| Avg. Page Load Time | < 2 seconds |
| Payment Success Rate | > 97% |
| Platform Uptime | 99.5% |
| 2FA Adoption Rate | > 40% |
| Mobile Traffic | > 60% |
| Multi-language Usage | > 30% |

### 📱 Mobile Optimizations
- Touch-friendly buttons (min 44x44px)
- Optimized hamburger menu with smooth animations
- Swipe gestures for navigation
- Bottom navigation bar
- Pull-to-refresh
- Thumb-zone optimized CTAs
- Mobile-first responsive design

### 🌍 Supported Languages (v1.0)
- English (default)
- Hindi
- Spanish
- French
- *More languages in future phases*

### 🔐 Enhanced Security Stack
1. JWT + Refresh Tokens
2. Two-Factor Authentication (2FA)
3. Cloudflare Turnstile CAPTCHA
4. HaveIBeenPwned password checks
5. KYC Verification
6. Admin Access Control
7. AI-powered fraud detection
8. CloudFlare DDoS protection
9. Rate limiting (API + Edge)
10. Encrypted KYC documents
11. CSP headers
12. CSRF protection

### 📊 Estimated Development Timeline
**Total: 18–20 weeks** (single full-stack developer)
- With team: 12–14 weeks

---

**Document Version**: 2.0 (Updated with Enhanced Features)
**Last Updated**: July 14, 2026
**Status**: Comprehensive PRD Ready for Implementation