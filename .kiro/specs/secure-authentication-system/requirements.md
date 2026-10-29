# Requirements Document

## Introduction

This document defines the requirements for a comprehensive, production-ready authentication system for the SoftMarket platform. The system addresses critical security gaps in the current implementation and implements all PRD requirements for user registration, secure login with 2FA, password security, session management, CAPTCHA protection, KYC verification, and admin access control.

The authentication system serves as the foundation for all user interactions on the platform, enabling secure access for Buyers, Sellers, and Admins while protecting against common attack vectors including brute force attacks, bot abuse, credential stuffing, and session hijacking.

## Glossary

- **Auth_System**: The complete authentication and authorization subsystem responsible for user identity verification and access control
- **Supabase_Auth**: Supabase's built-in authentication service providing JWT-based session management
- **User**: Any person interacting with the platform (Buyer, Seller, or Admin)
- **Session**: A period of authenticated access represented by a valid JWT token
- **JWT**: JSON Web Token used for stateless authentication
- **Refresh_Token**: Long-lived token used to obtain new JWT access tokens without re-authentication
- **2FA**: Two-Factor Authentication requiring a second verification step beyond password
- **OTP**: One-Time Password sent via SMS or email for verification
- **Textbee**: SMS delivery service for OTP and notifications
- **Resend**: Email delivery service integrated with Supabase
- **HIBP_API**: HaveIBeenPwned API for checking password breaches
- **Turnstile**: Cloudflare's CAPTCHA solution for bot protection
- **KYC**: Know Your Customer verification process requiring identity document submission
- **Password_Hash**: BCrypt-hashed representation of user passwords stored in database
- **Rate_Limiter**: Component that restricts the number of requests from an IP or user within a time window
- **Verification_Token**: Time-limited token sent via email or SMS for account verification
- **Account_Status**: Current state of a user account (ACTIVE, SUSPENDED, DISABLED)
- **Security_Event**: Suspicious activity requiring logging or user notification

## Requirements

### Requirement 1: User Registration with Email Verification

**User Story:** As a new user, I want to register for an account with email verification, so that I can securely access the platform with a verified identity.

#### Acceptance Criteria

1. WHEN a user submits the registration form with valid data, THE Auth_System SHALL create a new user account with role (BUYER or SELLER) and send a verification email via Resend
2. WHEN creating a new account, THE Auth_System SHALL hash the password using BCrypt with a cost factor of 12
3. WHEN a user submits a registration form, THE Turnstile SHALL validate the CAPTCHA token before processing the registration
4. IF the CAPTCHA token is invalid, THEN THE Auth_System SHALL reject the registration with error message "CAPTCHA verification failed"
5. WHEN a user attempts to register with an email that already exists, THE Auth_System SHALL return error "Email already registered" without revealing account existence timing
6. WHEN a verification email is sent, THE Auth_System SHALL include a time-limited token valid for 24 hours
7. WHEN a user clicks the verification link with a valid token, THE Auth_System SHALL mark the account as verified and enable full access
8. IF a verification token has expired, THEN THE Auth_System SHALL prompt the user to request a new verification email
9. FOR ALL registration form fields, THE Auth_System SHALL validate input format and length constraints before database insertion
10. WHEN a user completes email verification, THE Auth_System SHALL log the verification event with timestamp and IP address

### Requirement 2: Password Security with Breach Detection

**User Story:** As a user, I want my password checked against known breaches, so that I don't use a compromised password that could expose my account.

#### Acceptance Criteria

1. WHEN a user enters a password during registration or password change, THE Auth_System SHALL check the password against HIBP_API using k-anonymity protocol
2. IF the password is found in HIBP_API breach database, THEN THE Auth_System SHALL warn the user with message "This password has been found in a data breach and should not be used"
3. WHEN a breached password is detected, THE Auth_System SHALL prevent account creation or password change until a non-breached password is provided
4. WHEN checking password breach status, THE Auth_System SHALL send only the first 5 characters of the SHA-1 hash to HIBP_API to preserve privacy
5. THE Auth_System SHALL enforce password requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
6. WHEN a user enters a password, THE Password_Strength_Indicator SHALL display real-time strength feedback (weak, fair, good, strong)
7. IF HIBP_API is unreachable, THEN THE Auth_System SHALL allow password setting with a warning "Unable to verify password breach status" and log the incident
8. WHEN a user's current password is found in a new breach, THE Auth_System SHALL send notification via Email and SMS requiring password change within 7 days
9. FOR ALL password storage operations, THE Auth_System SHALL use BCrypt hashing with salt and never store plaintext passwords
10. WHEN a password change is forced due to breach detection, THE Auth_System SHALL prevent old password reuse for the last 5 passwords

### Requirement 3: Secure Login with JWT and Refresh Tokens

**User Story:** As a registered user, I want to securely log in with persistent sessions, so that I can access my account without repeated authentication while maintaining security.

#### Acceptance Criteria

1. WHEN a user submits valid login credentials, THE Supabase_Auth SHALL issue a JWT access token with 1-hour expiration and a Refresh_Token with 30-day expiration
2. WHEN a login attempt is made, THE Turnstile SHALL validate the CAPTCHA token before credential verification
3. WHEN login succeeds, THE Auth_System SHALL sync the Supabase session with the Zustand auth store containing user, token, and refreshToken
4. WHEN an access token expires, THE Auth_System SHALL automatically request a new access token using the Refresh_Token without user interaction
5. IF the Refresh_Token is expired or invalid, THEN THE Auth_System SHALL log the user out and redirect to the login page
6. WHEN a user logs in successfully, THE Auth_System SHALL record the login event with timestamp, IP address, device information, and geolocation
7. IF 5 consecutive login failures occur from the same IP address within 15 minutes, THEN THE Rate_Limiter SHALL block further login attempts for 30 minutes
8. WHEN a user logs in from a new device or location, THE Auth_System SHALL send a security alert notification via Email and SMS
9. THE Auth_System SHALL include the user's role (BUYER, SELLER, ADMIN) in the JWT claims for authorization decisions
10. WHEN a user logs out, THE Auth_System SHALL invalidate the current Refresh_Token in Supabase and clear all client-side session data

### Requirement 4: Two-Factor Authentication (2FA)

**User Story:** As a user, I want to enable 2FA via SMS or email, so that my account has an additional layer of security beyond passwords.

#### Acceptance Criteria

1. WHEN a user enables 2FA, THE Auth_System SHALL allow selection of delivery method (SMS via Textbee or Email via Resend) and store the preference
2. WHEN 2FA is enabled, THE Auth_System SHALL generate a 6-digit OTP valid for 5 minutes on each login attempt
3. WHEN a user with 2FA enabled logs in with correct password, THE Auth_System SHALL send the OTP via the chosen method and prompt for OTP entry
4. WHEN a user enters a valid OTP within 5 minutes, THE Auth_System SHALL complete authentication and issue session tokens
5. IF a user enters an invalid OTP 3 consecutive times, THEN THE Auth_System SHALL lock the login attempt and require password re-entry
6. WHERE a user is a SELLER with transaction volume exceeding ₹50,000 in the last 30 days, THE Auth_System SHALL require mandatory 2FA enrollment
7. WHEN a transaction amount exceeds ₹10,000, THE Auth_System SHALL require 2FA verification before processing payment regardless of user settings
8. WHEN a user disables 2FA, THE Auth_System SHALL send confirmation notifications via both Email and SMS to prevent unauthorized changes
9. THE Auth_System SHALL provide backup codes (10 single-use codes) during 2FA setup for account recovery if OTP delivery fails
10. WHEN a backup code is used, THE Auth_System SHALL mark it as consumed and notify the user of remaining backup codes

### Requirement 5: Forgot Password and Password Reset

**User Story:** As a user who forgot my password, I want to securely reset it via email or SMS, so that I can regain access to my account.

#### Acceptance Criteria

1. WHEN a user requests password reset, THE Auth_System SHALL send a verification token via Email (Resend) with option to send OTP via SMS (Textbee)
2. WHEN a reset token is generated, THE Auth_System SHALL make it valid for 1 hour and single-use only
3. WHEN a user clicks the password reset link with valid token, THE Auth_System SHALL present a password reset form with breach detection
4. WHEN a user completes password reset, THE Auth_System SHALL invalidate all existing sessions and Refresh_Tokens for that account
5. IF a user requests password reset for non-existent email, THEN THE Auth_System SHALL respond with generic message "If that email exists, a reset link has been sent" to prevent email enumeration
6. WHEN password reset is completed, THE Auth_System SHALL send confirmation notification via Email and SMS
7. WHEN a user chooses SMS OTP option, THE Auth_System SHALL send a 6-digit OTP valid for 10 minutes via Textbee
8. IF 3 invalid password reset attempts occur within 1 hour from the same IP, THEN THE Rate_Limiter SHALL temporarily block reset requests for 1 hour
9. WHEN a password reset token is used, THE Auth_System SHALL immediately invalidate it to prevent reuse
10. FOR ALL password reset operations, THE Auth_System SHALL log the event with IP address and device information for security audit

### Requirement 6: Session Management and Multi-Device Support

**User Story:** As a user, I want to manage my active sessions across devices, so that I can monitor account access and revoke unauthorized sessions.

#### Acceptance Criteria

1. WHEN a user logs in, THE Auth_System SHALL create a session record in Supabase containing device type, browser, IP address, and login timestamp
2. THE Auth_System SHALL display all active sessions in the user profile with option to view session details
3. WHEN a user clicks "Revoke Session" on a session, THE Auth_System SHALL invalidate that session's Refresh_Token and force logout on that device
4. WHEN a user clicks "Revoke All Sessions," THE Auth_System SHALL invalidate all Refresh_Tokens except the current session
5. WHILE a user is actively using the platform, THE Auth_System SHALL automatically refresh the JWT before expiration to maintain seamless access
6. WHEN a JWT refresh fails due to invalid Refresh_Token, THE Auth_System SHALL log the security event and redirect to login page
7. WHEN a session is created from a suspicious location, THE Auth_System SHALL flag the session and send security alert via Email and SMS
8. THE Auth_System SHALL limit concurrent active sessions to 5 per user account to prevent credential sharing
9. WHEN session limit is reached, THE Auth_System SHALL automatically revoke the oldest session when a new login occurs
10. FOR ALL session management actions, THE Auth_System SHALL log events for security audit trail

### Requirement 7: CAPTCHA Protection Against Bots

**User Story:** As a platform, I want CAPTCHA protection on authentication forms, so that automated bots cannot abuse registration, login, or password reset flows.

#### Acceptance Criteria

1. THE Turnstile SHALL be integrated on registration, login, password reset, and contact forms using invisible CAPTCHA mode
2. WHEN a user submits an authentication form, THE Auth_System SHALL verify the Turnstile token server-side before processing the request
3. IF Turnstile verification fails, THEN THE Auth_System SHALL reject the request with error "Verification failed. Please try again."
4. WHEN Turnstile detects suspicious behavior, THE Turnstile SHALL present an interactive challenge to the user
5. THE Auth_System SHALL not display CAPTCHA errors in development mode to facilitate testing
6. WHEN Turnstile API is unreachable, THE Auth_System SHALL fallback to rate limiting only and log the CAPTCHA service failure
7. THE Turnstile SHALL be configured with "managed" challenge mode to automatically adjust difficulty based on threat level
8. WHEN a CAPTCHA token is verified, THE Auth_System SHALL accept it only once and reject reuse attempts
9. THE Auth_System SHALL include the CAPTCHA verification result in security logs for abuse pattern analysis
10. FOR ALL public-facing forms, THE Turnstile SHALL render with appropriate language based on user's preferred language setting

### Requirement 8: Rate Limiting and Brute Force Protection

**User Story:** As a platform, I want rate limiting on authentication endpoints, so that brute force attacks and credential stuffing are prevented.

#### Acceptance Criteria

1. THE Rate_Limiter SHALL enforce a limit of 5 login attempts per IP address within 15 minutes
2. WHEN the login rate limit is exceeded, THE Rate_Limiter SHALL block further attempts for 30 minutes and return error "Too many login attempts. Please try again later."
3. THE Rate_Limiter SHALL enforce a limit of 3 password reset requests per email address within 1 hour
4. THE Rate_Limiter SHALL enforce a limit of 10 OTP requests per user per hour across all 2FA flows
5. WHEN rate limits are exceeded, THE Auth_System SHALL log the Security_Event with IP address, user agent, and timestamp
6. THE Rate_Limiter SHALL track both IP-based and user-based rate limits independently
7. WHEN suspicious activity patterns are detected (rapid requests from multiple IPs for same user), THE Auth_System SHALL temporarily suspend the account and notify the user
8. THE Rate_Limiter SHALL use sliding window algorithm to prevent burst attacks at window boundaries
9. WHERE a user is authenticated with valid session, THE Rate_Limiter SHALL apply less restrictive limits (10 requests per minute)
10. THE Rate_Limiter SHALL expose metrics for monitoring and alerting on abnormal traffic patterns

### Requirement 9: KYC Verification for Sellers

**User Story:** As a seller, I want to complete KYC verification by uploading identity documents, so that my seller account is verified and trusted by buyers.

#### Acceptance Criteria

1. WHEN a user registers as SELLER, THE Auth_System SHALL set initial KYC status to "NOT_SUBMITTED"
2. WHEN a seller accesses the KYC verification page, THE Auth_System SHALL present a form to upload identity document (Aadhaar, PAN, Passport, or Driving License)
3. WHEN a seller submits KYC documents, THE Auth_System SHALL upload files to Supabase Storage with encryption and create a verification request with status "PENDING"
4. WHEN KYC documents are submitted, THE Auth_System SHALL send notification to admins for manual review
5. WHEN an admin approves KYC, THE Auth_System SHALL update user KYC status to "APPROVED" and display verification badge on seller profile
6. IF an admin rejects KYC, THEN THE Auth_System SHALL update status to "REJECTED," store rejection reason, and notify seller via Email and SMS
7. WHEN a seller with "NOT_SUBMITTED" or "REJECTED" KYC attempts to create a listing, THE Auth_System SHALL prevent listing creation and prompt KYC completion
8. THE Auth_System SHALL encrypt KYC document numbers and store document URLs in encrypted format in the kyc_verifications table
9. WHERE a seller is KYC-verified, THE Auth_System SHALL display a verification badge on all listings and seller profile pages
10. WHEN KYC documents are accessed for admin review, THE Auth_System SHALL generate time-limited signed URLs (valid 1 hour) from Supabase Storage

### Requirement 10: Admin Access Control

**User Story:** As an admin, I want to enable or disable user access to the platform, so that I can manage user accounts and handle policy violations.

#### Acceptance Criteria

1. WHEN an admin views the user management page, THE Auth_System SHALL display all users with current Account_Status (ACTIVE, SUSPENDED, DISABLED)
2. WHEN an admin clicks "Suspend Account," THE Auth_System SHALL set Account_Status to "SUSPENDED" and invalidate all active sessions
3. WHEN a suspended user attempts to login, THE Auth_System SHALL reject authentication with message "Your account has been suspended. Please contact support."
4. WHEN an admin clicks "Activate Account," THE Auth_System SHALL set Account_Status to "ACTIVE" and allow normal login
5. WHEN an admin clicks "Disable Account," THE Auth_System SHALL set Account_Status to "DISABLED," invalidate sessions, and prevent all future logins
6. WHEN an account status changes, THE Auth_System SHALL send notification to the user via Email and SMS with reason if provided
7. THE Auth_System SHALL log all admin access control actions with admin ID, action type, target user, reason, and timestamp
8. WHERE an account is DISABLED, THE Auth_System SHALL hide the user's listings from marketplace but preserve data for audit
9. WHEN an admin enables a previously disabled account, THE Auth_System SHALL restore listing visibility and send reactivation notification
10. THE Auth_System SHALL provide admin dashboard with statistics on account status distribution and recent access control actions

### Requirement 11: User Profile Management

**User Story:** As a user, I want to update my profile information and password, so that I can keep my account details current and secure.

#### Acceptance Criteria

1. WHEN a user accesses the profile page, THE Auth_System SHALL display current profile information (name, email, phone, company details for sellers, avatar)
2. WHEN a user updates profile information, THE Auth_System SHALL validate all fields and sync changes to Supabase database
3. WHEN a user changes email address, THE Auth_System SHALL send verification email to new address and require confirmation before updating
4. WHEN a user uploads an avatar image, THE Auth_System SHALL resize to 200x200 pixels, upload to Supabase Storage, and update user profile URL
5. WHEN a user changes password, THE Auth_System SHALL require current password verification before allowing new password entry
6. WHEN changing password, THE Auth_System SHALL check the new password against HIBP_API and enforce password strength requirements
7. WHEN password change succeeds, THE Auth_System SHALL invalidate all sessions except current and send confirmation via Email and SMS
8. WHEN a user updates phone number, THE Auth_System SHALL send OTP via Textbee to new number for verification before updating
9. FOR ALL profile updates, THE Auth_System SHALL log the change with field name, old value, new value, and timestamp for audit trail
10. WHEN a SELLER updates company details, THE Auth_System SHALL sync the updated information to all active listings

### Requirement 12: Security Alerts and Notifications

**User Story:** As a user, I want to receive security alerts for suspicious activity, so that I can take action if my account is compromised.

#### Acceptance Criteria

1. WHEN a login occurs from a new device or location, THE Auth_System SHALL send security alert via Email (Resend) and optionally SMS (Textbee)
2. WHEN 5 failed login attempts occur within 15 minutes, THE Auth_System SHALL send alert "Multiple failed login attempts detected on your account"
3. WHEN a password is changed, THE Auth_System SHALL immediately notify via Email and SMS
4. WHEN 2FA settings are modified, THE Auth_System SHALL send confirmation notification via both Email and SMS
5. WHEN a session is revoked by another session, THE Auth_System SHALL notify the affected device
6. WHEN a password is found in a new breach database update, THE Auth_System SHALL send urgent notification requiring password change
7. THE Auth_System SHALL provide notification preferences page where users can choose Email-only, SMS-only, or both for security alerts
8. WHEN account status changes (suspended, disabled, reactivated), THE Auth_System SHALL send notification with reason and next steps
9. WHEN KYC status changes, THE Auth_System SHALL send notification to seller with status update and action items if rejected
10. FOR ALL security-related notifications, THE Auth_System SHALL include timestamp, IP address, location, and device information

### Requirement 13: Email Verification Flow

**User Story:** As a new user, I want to verify my email address, so that I can confirm my identity and access full platform features.

#### Acceptance Criteria

1. WHEN a user completes registration, THE Auth_System SHALL send verification email via Resend containing a unique verification link
2. THE verification email SHALL include the verification link valid for 24 hours and a "Resend Verification Email" option
3. WHEN a user clicks the verification link, THE Auth_System SHALL validate the token and mark the user account as verified
4. WHEN email verification succeeds, THE Auth_System SHALL redirect to login page with success message "Email verified successfully. Please log in."
5. IF a verification token has expired, THEN THE Auth_System SHALL display message "Verification link expired" with option to resend
6. WHEN an unverified user attempts to login, THE Auth_System SHALL allow login but display banner "Please verify your email address" and restrict certain features
7. WHILE a user account is unverified, THE Auth_System SHALL prevent sellers from creating listings and buyers from making purchases
8. WHEN a user clicks "Resend Verification Email," THE Rate_Limiter SHALL limit to 3 resend requests per hour per email address
9. THE Auth_System SHALL log all email verification events (sent, clicked, verified, expired) for monitoring and analytics
10. WHEN verification email sending fails, THE Auth_System SHALL log the error and provide user option to request verification via SMS OTP as fallback

### Requirement 14: Authentication State Persistence

**User Story:** As a user, I want my login state preserved across browser sessions, so that I don't have to log in repeatedly.

#### Acceptance Criteria

1. WHEN a user logs in with "Remember Me" checked, THE Auth_System SHALL store the Refresh_Token in browser localStorage with 30-day expiration
2. WHEN a user returns to the platform, THE Auth_System SHALL automatically restore session from stored Refresh_Token if valid
3. WHEN a user logs in without "Remember Me," THE Auth_System SHALL use sessionStorage for tokens, clearing on browser close
4. THE Auth_System SHALL sync authentication state between Supabase session and Zustand store on app initialization
5. WHEN a token refresh fails due to invalid Refresh_Token, THE Auth_System SHALL clear stored state and redirect to login
6. WHEN a user explicitly logs out, THE Auth_System SHALL clear all stored tokens from both localStorage and sessionStorage
7. THE Auth_System SHALL implement automatic token refresh 5 minutes before JWT expiration to prevent session interruption
8. WHEN multiple browser tabs are open, THE Auth_System SHALL sync authentication state across tabs using localStorage events
9. IF a logout occurs in one tab, THEN THE Auth_System SHALL immediately log out all other tabs for the same user
10. WHEN the browser detects the app is offline, THE Auth_System SHALL queue authentication state changes and sync when connection restores

### Requirement 15: Authentication Error Handling

**User Story:** As a user, I want clear error messages when authentication fails, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

1. WHEN invalid credentials are provided, THE Auth_System SHALL return generic error "Invalid email or password" without indicating which is wrong
2. WHEN account is suspended, THE Auth_System SHALL return "Your account has been suspended. Contact support at support@softmarket.com"
3. WHEN account is disabled, THE Auth_System SHALL return "Account disabled. Please contact support."
4. WHEN email is not verified, THE Auth_System SHALL return "Please verify your email address" with resend option
5. WHEN rate limit is exceeded, THE Auth_System SHALL return "Too many attempts. Try again in X minutes" with countdown
6. WHEN CAPTCHA fails, THE Auth_System SHALL return "Verification failed. Please try again."
7. WHEN OTP is invalid or expired, THE Auth_System SHALL return "Invalid or expired code. Please try again" with resend option
8. WHEN token refresh fails, THE Auth_System SHALL return "Session expired. Please log in again."
9. WHEN KYC is required but not completed, THE Auth_System SHALL return "Please complete KYC verification to access this feature"
10. FOR ALL authentication errors, THE Auth_System SHALL log the error with context but never expose sensitive details (password, tokens) in logs or responses

### Requirement 16: Authentication Hooks and Utilities

**User Story:** As a developer, I want reusable authentication hooks and utilities, so that authentication logic is consistent across the application.

#### Acceptance Criteria

1. THE Auth_System SHALL provide a useAuth() hook that exposes user, login, logout, register, and loading state
2. THE useAuth() hook SHALL provide isAuthenticated, hasRole(role), and requireAuth() helper functions
3. THE Auth_System SHALL provide a ProtectedRoute component that redirects unauthenticated users to login page
4. THE ProtectedRoute component SHALL support role-based access control via allowedRoles prop
5. THE Auth_System SHALL provide useSession() hook that returns current session details including device, IP, and login time
6. THE Auth_System SHALL provide a withAuth() higher-order component for class-based components requiring authentication
7. THE Auth_System SHALL provide passwordStrength(password) utility function returning strength score (0-4) and feedback
8. THE Auth_System SHALL provide checkPasswordBreach(password) async function that queries HIBP_API and returns boolean
9. THE Auth_System SHALL provide formatSessionDevice(session) utility that returns human-readable device description
10. THE Auth_System SHALL provide auth state change listeners for components to react to login/logout events

### Requirement 17: Password Strength Indicator Component

**User Story:** As a user creating a password, I want real-time visual feedback on password strength, so that I can create a secure password.

#### Acceptance Criteria

1. WHEN a user types in a password field, THE Password_Strength_Indicator SHALL display in real-time below the field
2. THE Password_Strength_Indicator SHALL calculate strength score (0-4) based on length, character variety, and common patterns
3. WHEN strength is 0-1, THE Password_Strength_Indicator SHALL display "Weak" in red color
4. WHEN strength is 2, THE Password_Strength_Indicator SHALL display "Fair" in orange color
5. WHEN strength is 3, THE Password_Strength_Indicator SHALL display "Good" in yellow color
6. WHEN strength is 4, THE Password_Strength_Indicator SHALL display "Strong" in green color
7. THE Password_Strength_Indicator SHALL display visual progress bar colored according to strength level
8. WHEN password fails requirements, THE Password_Strength_Indicator SHALL list missing requirements (e.g., "Add uppercase letter")
9. WHEN password is found in HIBP_API breach database, THE Password_Strength_Indicator SHALL display "⚠️ Found in data breach" warning in red
10. THE Password_Strength_Indicator SHALL provide suggestions like "Add more characters" or "Mix uppercase and lowercase" for weak passwords

### Requirement 18: Form Validation and Error Display

**User Story:** As a user filling authentication forms, I want immediate validation feedback, so that I can correct errors before submission.

#### Acceptance Criteria

1. THE Auth_System SHALL validate all form fields using React Hook Form with Zod schemas
2. WHEN a user leaves a required field empty, THE Auth_System SHALL display "This field is required" error below the field
3. WHEN a user enters invalid email format, THE Auth_System SHALL display "Please enter a valid email address"
4. WHEN passwords don't match in registration form, THE Auth_System SHALL display "Passwords do not match" below confirm password field
5. WHEN a user enters a password shorter than 8 characters, THE Auth_System SHALL display "Password must be at least 8 characters"
6. THE Auth_System SHALL display validation errors only after field loses focus (onBlur) or form submission attempt
7. WHEN form validation passes, THE Auth_System SHALL display green checkmark icon next to valid fields
8. WHEN server-side validation fails, THE Auth_System SHALL display server errors above the form in a dismissible alert
9. THE Auth_System SHALL disable submit button while form has validation errors with tooltip explaining why
10. WHEN form is submitting, THE Auth_System SHALL disable all fields and show loading spinner on submit button

### Requirement 19: Authentication API Integration

**User Story:** As the frontend application, I want to integrate with Supabase Auth APIs, so that authentication operations are handled securely.

#### Acceptance Criteria

1. THE Auth_System SHALL use Supabase JavaScript client for all authentication operations (signUp, signInWithPassword, signOut)
2. WHEN calling Supabase Auth APIs, THE Auth_System SHALL handle network errors gracefully with retry logic (max 3 retries)
3. WHEN authentication succeeds, THE Auth_System SHALL extract user and session from Supabase response and update Zustand store
4. WHEN Supabase returns error, THE Auth_System SHALL map error codes to user-friendly messages
5. THE Auth_System SHALL configure Supabase client with autoRefreshToken: true and persistSession: true
6. WHEN session state changes in Supabase, THE Auth_System SHALL listen to onAuthStateChange events and sync with Zustand
7. THE Auth_System SHALL include custom API interceptors in lib/api.ts that attach JWT to all authenticated requests
8. WHEN API request receives 401 Unauthorized, THE interceptor SHALL attempt token refresh before retrying original request
9. IF token refresh fails, THEN THE interceptor SHALL log user out and redirect to login page
10. THE Auth_System SHALL provide Supabase storage integration for uploading KYC documents and avatars with progress tracking

### Requirement 20: Mobile Responsiveness and Accessibility

**User Story:** As a mobile user, I want authentication pages optimized for mobile devices, so that I can easily register and login on my phone.

#### Acceptance Criteria

1. THE Auth_System SHALL render all authentication pages with mobile-first responsive design using Tailwind breakpoints
2. WHEN viewed on mobile devices, THE Auth_System SHALL display single-column layouts with minimum 44x44px touch targets
3. THE Auth_System SHALL implement proper keyboard navigation with visible focus indicators on all form elements
4. WHEN a form validation error occurs, THE Auth_System SHALL announce errors to screen readers using ARIA live regions
5. THE Auth_System SHALL provide proper ARIA labels for all form inputs, buttons, and interactive elements
6. THE Auth_System SHALL support browser autofill and password managers with proper autocomplete attributes
7. WHEN keyboard is visible on mobile, THE Auth_System SHALL ensure submit button remains accessible without scrolling
8. THE Auth_System SHALL use semantic HTML elements (form, label, input, button) for proper screen reader support
9. THE Auth_System SHALL provide skip links to main content for keyboard-only users
10. THE Auth_System SHALL meet WCAG 2.1 AA standards for color contrast, text sizing, and interactive element spacing
