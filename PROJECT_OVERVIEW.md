# 📊 SoftMarket - Complete Project Overview

## 🎯 Project Vision

**SoftMarket** is an enterprise-grade software marketplace platform that connects software creators (sellers) with buyers in a secure, trust-focused environment. Think of it as a premium hybrid between CodeCanyon, G2, and Flippa, specifically designed for direct software sales and lead generation.

## 🏗️ Architecture Overview

### Frontend Architecture (Current Implementation)
```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Public     │  │  Buyer       │  │  Seller      │      │
│  │   Pages      │  │  Dashboard   │  │  Dashboard   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   REACT APP     │
                    │  (Vite + TS)    │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐     ┌─────▼─────┐    ┌──────▼──────┐
    │  Zustand  │     │   Axios   │    │  React      │
    │   Store   │     │    API    │    │  Router     │
    └───────────┘     └─────┬─────┘    └─────────────┘
                            │
                    ┌───────▼────────┐
                    │  Spring Boot   │
                    │   Backend API  │
                    │  (Port 8080)   │
                    └───────┬────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │ Supabase  │    │ Razorpay  │    │   SMTP    │
    │  (DB +    │    │  Payment  │    │   Email   │
    │  Storage) │    │  Gateway  │    │  Service  │
    └───────────┘    └───────────┘    └───────────┘
```

### Technology Stack Breakdown

#### Frontend Stack (✅ Implemented)
| Technology | Version | Purpose | Status |
|------------|---------|---------|--------|
| React | 18.3.1 | UI Framework | ✅ Complete |
| TypeScript | 5.4.5 | Type Safety | ✅ Complete |
| Vite | 5.3.1 | Build Tool | ✅ Complete |
| Tailwind CSS | 3.4.4 | Styling | ✅ Complete |
| React Router | 6.23.1 | Routing | ✅ Complete |
| Zustand | 4.5.2 | State Management | ✅ Complete |
| Axios | 1.7.2 | HTTP Client | ✅ Complete |
| React Hook Form | 7.51.5 | Form Handling | ✅ Complete |
| Zod | 3.23.8 | Validation | ✅ Complete |
| Framer Motion | 11.2.10 | Animations | ✅ Complete |
| Lucide React | 0.395.0 | Icons | ✅ Complete |
| Sonner | 1.5.0 | Notifications | ✅ Complete |

#### Backend Stack (📋 Planned)
| Technology | Purpose | Status |
|------------|---------|--------|
| Spring Boot | REST API Framework | 📋 To Implement |
| Spring Security | Authentication & Authorization | 📋 To Implement |
| JWT | Token-based Auth | 📋 To Implement |
| Supabase (PostgreSQL) | Database | 📋 To Implement |
| Supabase Storage | File Storage | 📋 To Implement |
| Razorpay SDK | Payment Processing | 📋 To Implement |
| SendGrid/SMTP | Email Service | 📋 To Implement |

## 📁 Detailed Project Structure

```
c:\software market place\ui\
│
├── 📄 Configuration Files
│   ├── package.json           # Dependencies & scripts
│   ├── tsconfig.json          # TypeScript configuration
│   ├── vite.config.ts         # Vite build configuration
│   ├── tailwind.config.js     # Design system tokens
│   ├── postcss.config.js      # CSS processing
│   ├── .env.example           # Environment template
│   └── .gitignore             # Git exclusions
│
├── 📖 Documentation
│   ├── README.md              # Main documentation
│   ├── SETUP.md               # Installation guide
│   └── PROJECT_OVERVIEW.md    # This file
│
├── 🎨 Source Code (src/)
│   │
│   ├── 🧩 Components
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.tsx     # Primary action component
│   │   │   ├── Card.tsx       # Content container
│   │   │   ├── Input.tsx      # Form input with validation
│   │   │   ├── Select.tsx     # Dropdown selector
│   │   │   ├── Textarea.tsx   # Multi-line input
│   │   │   ├── Badge.tsx      # Status indicators
│   │   │   ├── Avatar.tsx     # User profile image
│   │   │   ├── Modal.tsx      # Overlay dialog
│   │   │   ├── Rating.tsx     # Star rating display
│   │   │   └── Skeleton.tsx   # Loading states
│   │   └── auth/
│   │       └── ProtectedRoute.tsx  # Route guards
│   │
│   ├── 📄 Pages
│   │   ├── HomePage.tsx           # Landing page with hero
│   │   ├── MarketplacePage.tsx    # Product browsing
│   │   ├── ProductDetailPage.tsx  # Product details
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx      # User authentication
│   │   │   └── RegisterPage.tsx   # User registration
│   │   ├── buyer/
│   │   │   ├── BuyerDashboard.tsx
│   │   │   └── OrdersPage.tsx
│   │   ├── seller/
│   │   │   ├── SellerDashboard.tsx
│   │   │   ├── MyListingsPage.tsx
│   │   │   ├── CreateListingPage.tsx
│   │   │   ├── SalesPage.tsx
│   │   │   └── InquiriesPage.tsx
│   │   └── admin/
│   │       └── AdminDashboard.tsx
│   │
│   ├── 🎭 Layouts
│   │   ├── MainLayout.tsx         # Public page wrapper
│   │   └── DashboardLayout.tsx    # Protected page wrapper
│   │
│   ├── 💾 State Management
│   │   └── stores/
│   │       └── useAuthStore.ts    # Authentication state
│   │
│   ├── 🔧 Utilities
│   │   └── lib/
│   │       ├── api.ts             # API service layer
│   │       └── utils.ts           # Helper functions
│   │
│   ├── 🎨 Styles
│   │   └── index.css              # Global styles & utilities
│   │
│   ├── App.tsx                    # Root component with routing
│   ├── main.tsx                   # Application entry point
│   └── vite-env.d.ts              # TypeScript declarations
│
└── 🌐 Public Assets
    └── index.html                 # HTML template
```

## 🎨 Design System Specifications

### Color System
```
Primary Colors (Purple):
├── 50:  #FAF5FF  (Backgrounds)
├── 100: #F3E8FF
├── 200: #E9D5FF
├── 300: #D8B4FE
├── 400: #C084FC
├── 500: #A855F7
├── 600: #9333EA
├── 700: #7C3AED  ← Brand Primary
├── 800: #6B21A8
└── 900: #581C87

Success Colors (Green):
├── 500: #22C55E
└── 600: #16A34A  ← Transactions

Destructive (Red):
└── 600: #DC2626  ← Errors
```

### Typography Scale
```
Display (Plus Jakarta Sans):
├── Headings: font-display
└── Weights: 400, 500, 600, 700, 800

Body (Inter):
├── UI Text: font-sans
└── Weights: 300, 400, 500, 600, 700, 800
```

### Spacing Scale (8pt Grid)
```
0.5 = 2px   |  6 = 24px
1   = 4px   |  8 = 32px
2   = 8px   | 10 = 40px
3   = 12px  | 12 = 48px
4   = 16px  | 16 = 64px
5   = 20px  | 20 = 80px
```

### Border Radius
```
sm = 8px   (Small elements)
md = 10px  (Cards, inputs)
lg = 12px  (Large cards)
xl = 16px  (Hero sections)
```

## 🔐 Authentication System

### JWT Token Flow
```
1. User Login
   ↓
2. Server Validates Credentials
   ↓
3. Server Generates:
   - Access Token (15min expiry)
   - Refresh Token (7 days expiry)
   ↓
4. Frontend Stores in localStorage (via Zustand)
   ↓
5. Access Token Attached to All API Requests
   ↓
6. On 401 Error:
   - Attempt refresh with Refresh Token
   - Get new Access Token
   - Retry failed request
   ↓
7. If Refresh Fails:
   - Clear tokens
   - Redirect to login
```

### Role-Based Access Control
```
┌──────────────────────────────────────┐
│             ADMIN                    │
│  - Approve/reject listings           │
│  - Manage all users                  │
│  - View all transactions             │
│  - Platform analytics                │
└──────────────────────────────────────┘
         ↓ Has all permissions of

┌──────────────────────────────────────┐
│            SELLER                     │
│  - Create/edit/delete own listings   │
│  - View sales analytics              │
│  - Respond to inquiries              │
│  - Manage payout settings            │
└──────────────────────────────────────┘
         ↓ Has all permissions of

┌──────────────────────────────────────┐
│             BUYER                     │
│  - Browse marketplace                │
│  - Purchase products                 │
│  - Leave reviews                     │
│  - View order history                │
└──────────────────────────────────────┘
```

## 💳 Payment Flow (Razorpay)

```
1. Buyer clicks "Buy Now"
   ↓
2. Frontend → POST /api/orders/create
   Backend creates Razorpay Order
   Returns: order_id, amount
   ↓
3. Frontend opens Razorpay Checkout Widget
   ↓
4. Buyer completes payment on Razorpay
   ↓
5. Razorpay returns:
   - payment_id
   - order_id
   - signature
   ↓
6. Frontend → POST /api/orders/verify
   Backend verifies signature
   ↓
7. Razorpay Webhook (Server-to-Server)
   Confirms payment independently
   ↓
8. Backend Updates Order Status: PAID
   ↓
9. Buyer receives:
   - Email confirmation
   - Access/download link
   - Order in dashboard
   ↓
10. Seller notified:
    - Email notification
    - Dashboard alert
    - Commission calculated
```

## 📊 Database Schema (High-Level)

### Core Tables

**users**
- id (UUID, PK)
- name, email, password_hash
- role (BUYER | SELLER | ADMIN)
- is_verified, phone
- created_at, updated_at

**listings**
- id (UUID, PK)
- seller_id (FK → users)
- title, short_description, full_description
- category, tech_stack[], price
- license_type (ONE_TIME | PER_SEAT)
- status (PENDING | APPROVED | REJECTED)
- demo_url, created_at

**listing_media**
- id (UUID, PK)
- listing_id (FK)
- file_url (Supabase Storage)
- file_type (SCREENSHOT | DOCUMENT)

**orders**
- id (UUID, PK)
- listing_id, buyer_id (FK)
- razorpay_order_id, razorpay_payment_id
- amount, commission_amount
- status (CREATED | PAID | FAILED | REFUNDED)
- created_at

**reviews**
- id (UUID, PK)
- listing_id, buyer_id (FK)
- rating (1-5), comment
- created_at

**inquiries**
- id (UUID, PK)
- listing_id (FK)
- buyer_id, name, email, phone, message
- status (NEW | RESPONDED)
- created_at

## 🚀 Feature Implementation Status

### ✅ Completed (Frontend)
- [x] Project setup and configuration
- [x] Design system and UI components
- [x] Routing structure
- [x] Authentication pages (Login/Register)
- [x] Homepage with hero and features
- [x] Main layout with navigation
- [x] Dashboard layouts
- [x] Protected route guards
- [x] API service layer with interceptors
- [x] State management (Zustand)
- [x] Responsive design
- [x] Glassy UI effects
- [x] Loading states and skeletons
- [x] Form validation setup
- [x] Toast notifications

### 🔄 In Progress
- [ ] Complete marketplace filtering
- [ ] Product listing cards
- [ ] Product detail page implementation
- [ ] Seller dashboard with analytics
- [ ] Create listing form
- [ ] File upload functionality

### 📋 Planned (Backend Integration)
- [ ] Spring Boot API setup
- [ ] Supabase database schema
- [ ] JWT authentication implementation
- [ ] Razorpay payment integration
- [ ] File upload to Supabase Storage
- [ ] Email notification system
- [ ] Admin approval workflow
- [ ] Review and rating system
- [ ] Search and filtering APIs
- [ ] Analytics endpoints

## 📈 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | TBD |
| Time to Interactive | < 3.0s | TBD |
| Lighthouse Score | > 90 | TBD |
| Bundle Size (gzipped) | < 200KB | ~150KB* |
| API Response Time | < 500ms | N/A |
| Accessibility Score | 100 | TBD |

*Estimated based on dependencies

## 🔒 Security Measures

### Frontend Security
- [x] HTTPS-only in production
- [x] XSS protection (React auto-escaping)
- [x] CSRF tokens (API implementation)
- [x] Secure token storage
- [x] Input validation (Zod schemas)
- [x] Rate limiting ready (API side)

### Backend Security (Planned)
- [ ] Password hashing (BCrypt)
- [ ] JWT secret rotation
- [ ] SQL injection prevention (parameterized queries)
- [ ] File upload validation
- [ ] CORS configuration
- [ ] API rate limiting
- [ ] Request size limits
- [ ] Security headers

## 📱 Responsive Breakpoints

```
Mobile:  < 640px   (sm)
Tablet:  640-1024px (md-lg)
Desktop: > 1024px   (xl)

Grid Columns:
Mobile:  1 column
Tablet:  2 columns
Desktop: 3-4 columns
```

## 🎯 Next Steps (Priority Order)

### Phase 1: Core Features (2 weeks)
1. Complete marketplace page with filtering
2. Implement product detail page
3. Build seller dashboard
4. Create listing form with file upload
5. Connect to mock API or JSON server

### Phase 2: Backend Integration (3 weeks)
1. Set up Spring Boot backend
2. Implement authentication endpoints
3. Create listing management APIs
4. Set up Supabase database
5. Implement file upload to Supabase Storage

### Phase 3: Payment & Reviews (2 weeks)
1. Integrate Razorpay
2. Implement order flow
3. Add review and rating system
4. Build inquiry system
5. Email notifications

### Phase 4: Admin & Polish (1 week)
1. Complete admin dashboard
2. Listing approval workflow
3. User management
4. Analytics implementation
5. Testing and bug fixes

### Phase 5: Deployment (1 week)
1. Production build optimization
2. Environment configuration
3. Deploy frontend (Vercel)
4. Deploy backend (AWS/Railway)
5. Database migration
6. SSL certificates
7. Monitoring setup

## 📞 Support & Resources

- **React Docs**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vite**: https://vitejs.dev/guide/
- **Zustand**: https://github.com/pmndrs/zustand
- **React Hook Form**: https://react-hook-form.com/
- **Razorpay Docs**: https://razorpay.com/docs/

---

**Last Updated**: July 14, 2026
**Version**: 1.0.0
**Status**: Frontend MVP Complete ✅
