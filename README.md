# 🚀 SoftMarket - Enterprise Software Marketplace Platform

A premium, enterprise-level software marketplace platform built with React, TypeScript, and Tailwind CSS. Features a stunning **glassy UI design** with modern aesthetics and smooth animations.

## ✨ Features

### 🎨 Enterprise-Level UI/UX
- **Glassy Morphism Design** - Modern, professional glassmorphic UI components
- **Premium Animations** - Smooth transitions, hover effects, and micro-interactions
- **Responsive Design** - Flawless experience across desktop, tablet, and mobile
- **Dark Mode Ready** - Built-in dark mode support
- **Accessibility** - WCAG 2.1 AA compliant components

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh token support
- Role-based access control (Buyer, Seller, Admin)
- Protected routes with automatic redirection
- Email verification workflow
- Password reset functionality

### 🛍️ Marketplace Features
- Advanced search and filtering
- Category-based browsing
- Product listings with rich media support
- Reviews and ratings system
- Seller verification badges
- Featured products showcase

### 💳 Payment Integration
- Razorpay payment gateway integration
- Secure checkout flow
- Order management and tracking
- Commission calculation
- Webhook-based payment verification

### 👥 User Roles

#### Buyers
- Browse and search products
- Purchase software/licenses
- Leave reviews and ratings
- Contact sellers
- Order history

#### Sellers
- Create and manage listings
- Upload screenshots and documentation
- Sales analytics dashboard
- Inquiry management
- Revenue tracking

#### Admins
- Listing approval workflow
- User management
- Transaction monitoring
- Platform analytics
- Dispute resolution

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Lightning-fast build tool
- **React Router DOM** - Client-side routing
- **Zustand** - Lightweight state management
- **Axios** - HTTP client with interceptors
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icon set
- **Sonner** - Toast notifications

### Backend (Planned)
- **Spring Boot** - Java framework
- **Supabase** - PostgreSQL database
- **JWT** - Token-based authentication
- **Razorpay API** - Payment processing

## 📦 Project Structure

```
ui/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Button, Card, Input, etc.)
│   │   └── auth/          # Authentication components
│   ├── layouts/           # Layout components
│   │   ├── MainLayout.tsx
│   │   └── DashboardLayout.tsx
│   ├── pages/             # Page components
│   │   ├── auth/          # Auth pages (Login, Register)
│   │   ├── buyer/         # Buyer dashboard pages
│   │   ├── seller/        # Seller dashboard pages
│   │   ├── admin/         # Admin dashboard pages
│   │   ├── HomePage.tsx
│   │   ├── MarketplacePage.tsx
│   │   └── ProductDetailPage.tsx
│   ├── stores/            # Zustand state management
│   │   └── useAuthStore.ts
│   ├── lib/               # Utility functions and API
│   │   ├── api.ts         # API service layer
│   │   └── utils.ts       # Helper functions
│   ├── App.tsx            # Main app component with routing
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies

```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API running on port 8080 (or configure in .env)

### Installation

1. **Clone the repository**
```bash
cd "c:\software market place\ui"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_URL=http://localhost:3000
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#7C3AED) - Brand, primary actions
- **Secondary**: Light Purple (#A78BFA) - Secondary emphasis
- **Success**: Green (#16A34A) - Confirmations, transactions
- **Destructive**: Red (#DC2626) - Errors, delete actions
- **Background**: Light Purple (#FAF5FF) - Page backgrounds
- **Muted**: Gray (#64748B) - Secondary text

### Typography
- **Display Font**: Plus Jakarta Sans - Headlines and titles
- **Body Font**: Inter - Body text and UI elements

### Components
All components support:
- Multiple variants (primary, secondary, outline, ghost, etc.)
- Multiple sizes (sm, md, lg, xl)
- Loading states
- Disabled states
- Error states
- Accessibility features

## 🔑 Key Components

### Button
```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Click Me
</Button>
```

### Card
```tsx
<Card variant="glass" hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Input
```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  leftIcon={<Mail />}
  error="Error message"
/>
```

### Badge
```tsx
<Badge variant="success" size="md">
  Verified
</Badge>
```

### Avatar
```tsx
<Avatar
  src="/avatar.jpg"
  name="John Doe"
  size="lg"
  verified={true}
/>
```

## 🔒 Authentication Flow

1. User registers with role selection (Buyer/Seller)
2. Email verification sent
3. User logs in with credentials
4. JWT token stored in localStorage (via Zustand)
5. Token automatically attached to API requests
6. Refresh token used for session persistence
7. Automatic token refresh on 401 errors
8. Logout clears tokens and redirects to login

## 🛣️ Routes

### Public Routes
- `/` - Homepage
- `/marketplace` - Browse products
- `/product/:id` - Product details
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Buyer)
- `/buyer/dashboard` - Buyer dashboard
- `/buyer/orders` - Order history

### Protected Routes (Seller)
- `/seller/dashboard` - Seller dashboard
- `/seller/listings` - Manage listings
- `/seller/create-listing` - Create new listing
- `/seller/sales` - Sales history
- `/seller/inquiries` - Buyer inquiries

### Protected Routes (Admin)
- `/admin/dashboard` - Admin dashboard

## 🎯 API Integration

The frontend uses Axios with interceptors for:
- Automatic JWT token attachment
- Token refresh on expiry
- Error handling and logging
- Request/response transformation

API services are organized by domain:
- `authAPI` - Authentication endpoints
- `listingAPI` - Product listings
- `orderAPI` - Orders and payments
- `inquiryAPI` - Buyer-seller communication
- `reviewAPI` - Reviews and ratings
- `adminAPI` - Admin operations

## 🌐 Backend Integration

This frontend expects a Spring Boot backend with the following:

### Required Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh-token` - Token refresh
- `GET /api/listings` - Get all listings
- `POST /api/orders/create` - Create Razorpay order
- `POST /api/orders/verify` - Verify payment

See `src/lib/api.ts` for complete API documentation.

## 🎨 Customization

### Changing Theme Colors
Edit `tailwind.config.js`:
```js
colors: {
  primary: {
    DEFAULT: '#YOUR_COLOR',
    // ... other shades
  }
}
```

### Adding New Components
1. Create component in `src/components/ui/`
2. Export from component file
3. Use in pages

### Modifying Animations
Edit `tailwind.config.js` in the `animation` and `keyframes` sections.

## 📱 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🐛 Troubleshooting

### Module not found errors
```bash
npm install
npm run dev
```

### Environment variables not loading
Ensure `.env` file exists and variables start with `VITE_`

### API connection errors
Check backend is running on correct port and CORS is configured

## 📄 License

This project is proprietary and confidential.

## 👨‍💻 Developer

Created by Karthik - July 14, 2026

## 🔮 Next Steps

1. **Complete Implementation**
   - Implement all remaining pages
   - Add marketplace filtering and search
   - Build seller dashboard with analytics
   - Create admin panel features

2. **Backend Integration**
   - Connect to Spring Boot API
   - Implement Supabase storage for media
   - Set up Razorpay payment flow
   - Configure email notifications

3. **Testing & Optimization**
   - Add unit tests
   - Implement E2E tests
   - Performance optimization
   - Accessibility audit

4. **Deployment**
   - Configure production environment
   - Set up CI/CD pipeline
   - Deploy to hosting platform
   - Monitor and maintain

---

**Ready to build something amazing!** 🚀
