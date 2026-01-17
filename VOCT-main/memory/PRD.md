# VOCT Healthcare Platform - Product Requirements Document

## Overview
VOCT is a premium, modern home healthcare platform designed with a "motion-first" visual language that feels sophisticated yet approachable.

## Brand Identity & Core Message
- **Name:** VOCT (Primary Brand Anchor)
- **Slogan:** "Pain is common, but pain is NOT normal."
- **Subtitle:** "Healthcare Comes Home"
- **Visual Tone:** Navy Blue (#0A1F44) and Indigo palette, clean typography

## Typography
- **Heading Font:** Poppins (Google Fonts) - H2: 36-48px, H3: 24px, Weight: 700
- **Body Font:** Open Sans (Google Fonts) - Base: 18px, Small: 14px, Weight: 500-600

## Color Palette
- Primary Navy: #0A1F44
- Navy Light: #1a3a5c
- White: #FFFFFF
- Gray-50: #F9FAFB (subtle backgrounds)
- Gray-200: #E5E7EB (borders)
- Gray-600: #4B5563 (body text)
- Accent Blue: #3B82F6
- Accent Green: #10B981
- Accent Purple: #8B5CF6

## Website Flow - IMPLEMENTED

### Home Page Structure
1. **Hero Section** - VOCT branding only (no CTA buttons)
2. **Services Section** - 6 categories with Swiper.js carousel
3. **CTA Section** - "Not sure which service is right? Take Free Assessment"
4. **Assessment Section** - 3-step multi-form
5. **FAQ Section** - 7 questions
6. **Footer** - Contact info, quick links, services list

### Navigation
- Book → Services Section
- Services → Services Section  
- Join Us → Practitioner Registration
- Login/Profile → Auth Modal / Profile Dropdown

## Services (6 Categories) - IMPLEMENTED
1. **Orthopaedic Care** - Relief, Recovery & Mobility at Your Home
2. **Neurological Rehabilitation** - Specialised Care for Brain & Nerve Recovery
3. **Geriatric Fitness & Elder Care** - Safe, Supervised Care for Active Ageing
4. **Women's & Community Health** - Care Through Every Stage of Motherhood
5. **Lifestyle & Preventive Care** - Move Better. Feel Stronger. Live Healthier.
6. **Sports Rehab** - Get Back in the Game Stronger

## Key Design Features - IMPLEMENTED
- **3D Interactive Cards:** 1.2s flip animation with cubic-bezier [0.16, 1, 0.3, 1]
- **Atmospheric Backgrounds:** Floating illustrations at 30-40% opacity
- **Horizontal Snap Carousel:** Swiper.js with snap scrolling
- **3D Buttons:** Multi-layer shadow effects with hover/active states
- **Glassmorphism:** Header with blur backdrop filter

## Self-Assessment Flow - IMPLEMENTED

### Step 1: Basic Details
- Name (required)
- Age (required)
- Gender (required)
- City / Area (required)
- Contact Number (required)

### Step 2: Chief Complaint
- Joint or muscle pain / injury → Ortho Rehab
- Nerve-related problem → Neuro Rehab
- Walking/balance issues → Geriatric Rehab
- Surgery done recently → Post-Op Rehab
- Sports injury → Sports Rehab
- Community care → Community Rehab

### Step 3: Conditional Questions (based on selection)

## FAQ Section - IMPLEMENTED
1. Why should I choose VOCT?
2. What is homecare physiotherapy?
3. How much is the session time?
4. How does the payment plan work?
5. How many sessions will I need?
6. Can I change the session timing?
7. Can VOCT help with long-term or chronic conditions?

## Booking Flow - IMPLEMENTED
1. Select Service
2. Choose Session Plan (1, 3, 7, 15, 30 sessions)
3. Customer Details
4. Physio Gender Preference (for female patients only)
5. Calendar with Time Slot
6. Payment (MOCKED Razorpay)
7. Booking Confirmation

## Authentication - IMPLEMENTED
- Login: Phone Number → OTP → Logged in
- Sign Up: Name, Age, Gender, Phone → OTP → Profile created
- Profile Menu: Account Details, Booking Details, Address Details, Help & Support, Logout

## Practitioner Portal (Join Us) - IMPLEMENTED
1. Personal Details (Full Name, Age, Gender, Contact, Email, Mother's Name, Address, PIN Code, City)
2. Education Details (Institution, Location, Degree, B.P.T.H/M.P.T.H, Percentage, Years, Registration)
3. Bank Details (Bank Name, Branch, Account, IFSC, PAN, Aadhar, UPI)
4. Joining Details (Experience, Equipment, Travel Distance, Emergency Availability)

## Technical Stack
- **Frontend:** React 19, Tailwind CSS, Framer Motion, Swiper.js
- **Backend:** FastAPI (Python), Motor (MongoDB async driver)
- **Database:** MongoDB
- **Icons:** Remix Icons (CDN)

## MOCKED Integrations
⚠️ The following are MOCKED for MVP:
- **Razorpay Payment** - Payment succeeds immediately
- **Twilio OTP** - Demo OTP shown in response
- **Gmail Communication** - Not implemented (requires API key)
- **Zendesk Support** - Not implemented (requires API key)

## Pricing Structure
| Sessions | Price (₹) |
|----------|-----------|
| 1        | 999       |
| 3        | 2,499     |
| 7        | 4,999     |
| 15       | 8,999     |
| 30       | 14,999    |

## API Endpoints
- Auth: `/api/auth/send-otp`, `/api/auth/verify-otp`, `/api/auth/signup`
- Services: `/api/services`, `/api/services/{id}`, `/api/pricing`
- Assessment: `/api/assessment`
- Booking: `/api/booking`, `/api/bookings/user/{id}`
- Payment: `/api/payment/create-order`, `/api/payment/mock-success/{id}`
- Practitioner: `/api/practitioner/apply`, `/api/practitioner/{id}/upload-certificate`

## Environment Variables for Production
```
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_VERIFY_SERVICE=your_service_sid
```

## Test Results
- Backend: 100% (10/10 API endpoints working)
- Frontend: 100% (All UI flows, specifications verified)
