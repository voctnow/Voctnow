# VOCT Healthcare - Product Requirements Document

## Original Problem Statement
Build website from GitHub repo https://github.com/voctnow/Voctnow.git with customizations.

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

### UI/UX Updates (Jan 17, 2026)
1. **Hero Section**:
   - Added physiotherapy illustration image (cleaned background for seamless blend)
   - VOCT logo with 3D reveal animation
   - "HEALTHCARE COMES HOME" subtitle centered under VOCT
   - "Pain is common, but pain is NOT normal." slogan - centered, single line, with reveal animation

2. **Header**: 
   - 3D shadow strip effect with blur and gradient
   - Navigation: Home, Services, Join Us, About Us, Login

3. **Footer Restructure**:
   - VOCT with "Healthcare Comes Home" tagline
   - About Us section (Our Story, Mission & Vision)
   - Services section (Physiotherapy, Neuro Rehab, Elderly Care)
   - Contact Us (8 AM - 8 PM All Days, support@voct.in)
   - Stay Connected with Instagram link (https://www.instagram.com/voctnow)
   - Removed Clinical Team link

4. **Assessment Panel**: 
   - 3D slide-in animation with perspective effect
   - Blurred overlay background
   - Animated progress bar with shimmer effect
   - Step indicator dots
   - 3D card hover animations

5. **Services Section**: 
   - Subtitle: "Expert care. Zero travel"

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
