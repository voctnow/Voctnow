# VOCT Healthcare - Product Requirements Document

## Original Problem Statement
Build website from GitHub repo https://github.com/voctnow/Voctnow.git with footer customizations (Instagram, email).

## User Personas
- **Patients**: People seeking home physiotherapy services
- **Physiotherapists**: Healthcare professionals looking to join VOCT
- **Elderly/Caregivers**: People needing geriatric and community care

## Core Requirements
- Home healthcare booking platform
- Service categories (Orthopaedic, Neurological, Geriatric, Women's Health, Lifestyle, Sports)
- Assessment tool for service recommendations
- OTP-based authentication
- Practitioner onboarding (Join Us)

## What's Been Implemented

### Initial Setup (Jan 17, 2026)
- Cloned and deployed VOCT healthcare website from GitHub
- Set up FastAPI backend + React frontend + MongoDB
- Footer: Instagram link (https://www.instagram.com/voctnow), Email (support@voct.in)

### UI/UX Updates (Jan 17, 2026)
1. **Hero Section**: Added physiotherapy illustration image with text on left side
2. **Header**: 3D shadow strip effect with blur, gradient background
3. **Footer Restructure**:
   - Changed tagline to "Healthcare Comes Home"
   - Removed "Clinical Team" link
   - Added Contact Us section with call timings (8 AM - 8 PM, All Days)
   - Stay Connected with Instagram link
4. **Assessment Panel**: Complete 3D redesign with:
   - Animated slide-in panel with perspective effect
   - Blurred overlay background
   - Animated progress bar with shimmer effect
   - Step indicator dots
   - 3D card hover animations for selections
5. **Services Section**: Changed subtitle to "Expert care. Zero travel"

## Technical Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion, Swiper
- **Backend**: FastAPI, Motor (MongoDB async driver)
- **Database**: MongoDB

## Mocked Features (Demo Mode)
- OTP verification (demo OTP shown in response)
- Payment processing (Razorpay integration mocked)
- Physiotherapist assignment (auto-assigned for demo)

## Prioritized Backlog

### P0 (Critical for Production)
- [ ] Integrate real OTP provider (Twilio)
- [ ] Integrate real payment gateway (Razorpay)
- [ ] Admin dashboard for booking management

### P1 (Important)
- [ ] Email notifications for bookings
- [ ] SMS notifications
- [ ] Physiotherapist mobile app/portal

### P2 (Nice to Have)
- [ ] WhatsApp integration for customer support
- [ ] Real-time tracking of physiotherapist
- [ ] Patient feedback/rating system
- [ ] Multi-language support

## Next Tasks
1. Connect real OTP provider for production
2. Integrate actual Razorpay payment gateway
3. Add admin panel for managing bookings and practitioners
