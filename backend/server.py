from fastapi import FastAPI, APIRouter, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timedelta
import json
import asyncio
import aiofiles
import random
import string

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'voct_database')]

# Create the main app
app = FastAPI(title="VOCT Healthcare API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Upload directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# ==================== MODELS ====================

# User Models
class UserBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    email: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    addresses: List[Dict[str, Any]] = []
    is_verified: bool = False

# OTP Models
class OTPRequest(BaseModel):
    phone: str

class OTPVerify(BaseModel):
    phone: str
    otp: str

class OTPResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[str] = None

# Assessment Models
class BasicDetails(BaseModel):
    name: str
    age: int
    gender: str
    city_area: str
    contact_number: str

class AssessmentCreate(BaseModel):
    basic_details: BasicDetails
    chief_complaint: str
    conditional_answers: Dict[str, Any]

class Assessment(AssessmentCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    recommended_service: str
    status: str = "completed"

# Booking Models
class BookingCreate(BaseModel):
    user_id: str
    service_type: str
    session_count: int
    amount: int
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    address: str
    city: str
    pincode: str
    preferred_date: str
    preferred_time: str
    physio_gender_preference: Optional[str] = None
    assessment_id: Optional[str] = None

class Booking(BookingCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending_payment"
    payment_id: Optional[str] = None
    payment_status: str = "pending"
    assigned_physio_id: Optional[str] = None
    assignment_status: str = "unassigned"

# Payment Models
class PaymentOrderCreate(BaseModel):
    booking_id: str
    amount: int

class PaymentOrder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    booking_id: str
    order_id: str
    amount: int
    currency: str = "INR"
    status: str = "created"
    created_at: datetime = Field(default_factory=datetime.utcnow)

class PaymentVerify(BaseModel):
    order_id: str
    payment_id: str
    signature: str

# Practitioner Models
class PractitionerPersonalDetails(BaseModel):
    full_name: str
    age: int
    gender: str
    contact_number: str
    email: str
    mothers_name: str
    permanent_address: str
    temporary_address: Optional[str] = None
    pin_code: str
    city: str

class PractitionerEducation(BaseModel):
    institution_name: str
    location: str
    degree: str
    bpth: bool = False
    mpth: bool = False
    mpth_specialization: Optional[str] = None
    aggregate_percentage: float
    year_of_graduation: int
    year_of_post_graduation: Optional[int] = None
    research_title: Optional[str] = None
    other_courses: Optional[str] = None
    registration_no: str

class PractitionerBankDetails(BaseModel):
    bank_name: str
    branch_name: str
    branch_address: str
    account_number: str
    ifsc_code: str
    pan_card_number: str
    aadhar_number: str
    upi_id: Optional[str] = None

class PractitionerJoiningDetails(BaseModel):
    years_of_experience: int
    has_electrotherapy_equipment: bool
    travel_distance: str
    emergency_availability: str
    unique_practice: str
    standout_quality: str

class PractitionerCreate(BaseModel):
    personal_details: PractitionerPersonalDetails
    education: PractitionerEducation
    bank_details: PractitionerBankDetails
    joining_details: PractitionerJoiningDetails

class Practitioner(PractitionerCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "pending_review"
    is_verified: bool = False
    is_available: bool = True
    certifications: List[str] = []
    degree_certificate: Optional[str] = None

# Service Models
class Service(BaseModel):
    id: str
    name: str
    description: str
    sub_services: List[str]
    icon: str
    price_per_session: int = 999

# ==================== SERVICES DATA ====================
SERVICES = [
    {
        "id": "orthopaedic",
        "name": "Orthopaedic Care",
        "description": "Relief, Recovery & Mobility at Your Home",
        "sub_services": [
            "Chronic & Acute Pain Management",
            "Post-Surgery Rehabilitation",
            "Fracture Rehabilitation",
            "Nerve Pain & Disc Issues"
        ],
        "icon": "heart-pulse",
        "price_per_session": 999
    },
    {
        "id": "neurological",
        "name": "Neurological Rehabilitation",
        "description": "Specialised Care for Brain & Nerve Recovery",
        "sub_services": [
            "Stroke Rehabilitation",
            "Spinal Cord Injury Rehab",
            "Traumatic Brain Injury Rehab",
            "Paediatric Neuro Care",
            "Parkinson's Disease Management"
        ],
        "icon": "brain",
        "price_per_session": 999
    },
    {
        "id": "geriatric",
        "name": "Geriatric Fitness & Elder Care",
        "description": "Safe, Supervised Care for Active Ageing",
        "sub_services": [
            "Strength & Balance Training",
            "Osteoarthritis (OA) Management",
            "Fall Prevention Programs",
            "Mobility & Flexibility Improvement"
        ],
        "icon": "walk",
        "price_per_session": 999
    },
    {
        "id": "womens_health",
        "name": "Women's & Community Health",
        "description": "Care Through Every Stage of Motherhood",
        "sub_services": [
            "Antenatal Physiotherapy",
            "Postnatal Recovery & Strengthening",
            "Pelvic Floor Rehabilitation",
            "Post-Delivery Pain Management"
        ],
        "icon": "heart",
        "price_per_session": 999
    },
    {
        "id": "lifestyle",
        "name": "Lifestyle & Preventive Care",
        "description": "Move Better. Feel Stronger. Live Healthier.",
        "sub_services": [
            "Posture Correction",
            "General Strength & Conditioning",
            "Fitness & Movement Screening",
            "Injury Prevention Programs"
        ],
        "icon": "fitness",
        "price_per_session": 999
    },
    {
        "id": "sports",
        "name": "Sports Rehab",
        "description": "Get Back in the Game Stronger",
        "sub_services": [
            "Sports Injury Management",
            "Performance Enhancement",
            "Injury Prevention Program",
            "Recovery and Pain Relief",
            "Post-surgery Sports Rehab"
        ],
        "icon": "football",
        "price_per_session": 999
    }
]

# Pricing structure
PRICING = {
    1: 999,
    3: 2899,
    7: 6299,
    15: 12735,
    30: 23970
}

# ==================== WEBSOCKET MANAGER ====================
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.physio_connections: Dict[str, WebSocket] = {}
    
    async def connect_user(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
    
    async def connect_physio(self, physio_id: str, websocket: WebSocket):
        await websocket.accept()
        self.physio_connections[physio_id] = websocket
    
    def disconnect_user(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
    
    def disconnect_physio(self, physio_id: str):
        if physio_id in self.physio_connections:
            del self.physio_connections[physio_id]
    
    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(message)
    
    async def send_to_physio(self, physio_id: str, message: dict):
        if physio_id in self.physio_connections:
            await self.physio_connections[physio_id].send_json(message)

manager = ConnectionManager()

# OTP Storage (in-memory for demo, use Redis in production)
otp_storage: Dict[str, Dict[str, Any]] = {}

# ==================== API ENDPOINTS ====================

# Health Check
@api_router.get("/")
async def root():
    return {"message": "VOCT Healthcare API", "status": "running"}

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/send-otp", response_model=OTPResponse)
async def send_otp(request: OTPRequest):
    """Send OTP to phone number (MOCKED for demo)"""
    phone = request.phone
    
    # Generate 6-digit OTP
    otp = ''.join(random.choices(string.digits, k=6))
    
    # Store OTP with expiry (5 minutes)
    otp_storage[phone] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=5),
        "attempts": 0
    }
    
    # In production, send via Twilio:
    # from twilio.rest import Client
    # client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
    # client.verify.services(os.getenv("TWILIO_VERIFY_SERVICE")).verifications.create(to=phone, channel="sms")
    
    logger.info(f"MOCKED OTP for {phone}: {otp}")
    
    return OTPResponse(
        success=True,
        message=f"OTP sent successfully. [DEMO MODE: Use OTP {otp}]"
    )

@api_router.post("/auth/verify-otp", response_model=OTPResponse)
async def verify_otp(request: OTPVerify):
    """Verify OTP and login/signup user"""
    phone = request.phone
    
    if phone not in otp_storage:
        raise HTTPException(status_code=400, detail="OTP not found. Please request a new one.")
    
    stored = otp_storage[phone]
    
    if datetime.utcnow() > stored["expires_at"]:
        del otp_storage[phone]
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
    
    if stored["attempts"] >= 3:
        del otp_storage[phone]
        raise HTTPException(status_code=400, detail="Too many attempts. Please request a new OTP.")
    
    if request.otp != stored["otp"]:
        stored["attempts"] += 1
        raise HTTPException(status_code=400, detail="Invalid OTP")
    
    # OTP verified - cleanup
    del otp_storage[phone]
    
    # Check if user exists
    existing_user = await db.users.find_one({"phone": phone})
    
    if existing_user:
        return OTPResponse(
            success=True,
            message="Login successful",
            user_id=existing_user["id"]
        )
    else:
        # Return success but no user_id - frontend will show signup form
        return OTPResponse(
            success=True,
            message="OTP verified. Please complete registration.",
            user_id=None
        )

@api_router.post("/auth/signup", response_model=User)
async def signup(user: UserCreate):
    """Complete user registration after OTP verification"""
    # Check if user already exists
    existing = await db.users.find_one({"phone": user.phone})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    new_user = User(**user.dict())
    new_user.is_verified = True
    
    await db.users.insert_one(new_user.dict())
    return new_user

@api_router.get("/auth/user/{user_id}", response_model=User)
async def get_user(user_id: str):
    """Get user by ID"""
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@api_router.put("/auth/user/{user_id}", response_model=User)
async def update_user(user_id: str, updates: Dict[str, Any]):
    """Update user details"""
    result = await db.users.update_one(
        {"id": user_id},
        {"$set": updates}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    user = await db.users.find_one({"id": user_id})
    return User(**user)

# ==================== SERVICES ENDPOINTS ====================

@api_router.get("/services", response_model=List[Service])
async def get_services():
    """Get all available services"""
    return SERVICES

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get service by ID"""
    for service in SERVICES:
        if service["id"] == service_id:
            return service
    raise HTTPException(status_code=404, detail="Service not found")

@api_router.get("/pricing")
async def get_pricing():
    """Get session pricing"""
    return PRICING

# ==================== ASSESSMENT ENDPOINTS ====================

@api_router.post("/assessment", response_model=Assessment)
async def create_assessment(assessment: AssessmentCreate):
    """Create a new assessment"""
    # Determine recommended service based on chief complaint
    complaint_to_service = {
        "joint_muscle": "orthopaedic",
        "nerve_related": "neurological",
        "walking_balance": "geriatric",
        "post_surgery": "orthopaedic",
        "sports_injury": "sports",
        "community_care": "womens_health"
    }
    
    recommended = complaint_to_service.get(assessment.chief_complaint, "orthopaedic")
    
    new_assessment = Assessment(
        **assessment.dict(),
        recommended_service=recommended
    )
    
    await db.assessments.insert_one(new_assessment.dict())
    return new_assessment

@api_router.get("/assessment/{assessment_id}", response_model=Assessment)
async def get_assessment(assessment_id: str):
    """Get assessment by ID"""
    assessment = await db.assessments.find_one({"id": assessment_id})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return Assessment(**assessment)

# ==================== BOOKING ENDPOINTS ====================

@api_router.post("/booking", response_model=Booking)
async def create_booking(booking: BookingCreate):
    """Create a new booking"""
    # Calculate amount based on session count
    calculated_amount = PRICING.get(booking.session_count, booking.session_count * 999)
    
    # Update the booking data with calculated amount
    booking_data = booking.dict()
    booking_data['amount'] = calculated_amount
    
    new_booking = Booking(**booking_data)
    
    await db.bookings.insert_one(new_booking.dict())
    return new_booking

@api_router.get("/booking/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    """Get booking by ID"""
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return Booking(**booking)

@api_router.get("/bookings/user/{user_id}", response_model=List[Booking])
async def get_user_bookings(user_id: str):
    """Get all bookings for a user"""
    bookings = await db.bookings.find({"user_id": user_id}).to_list(100)
    return [Booking(**b) for b in bookings]

@api_router.put("/booking/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str):
    """Update booking status"""
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"success": True}

# ==================== PAYMENT ENDPOINTS ====================

@api_router.post("/payment/create-order")
async def create_payment_order(order: PaymentOrderCreate):
    """Create Razorpay order (MOCKED for demo)"""
    # Generate mock order ID
    order_id = f"order_{uuid.uuid4().hex[:16]}"
    
    # In production, use Razorpay:
    # import razorpay
    # client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET')))
    # razor_order = client.order.create({
    #     "amount": order.amount * 100,  # Amount in paise
    #     "currency": "INR",
    #     "payment_capture": 1
    # })
    
    payment_order = PaymentOrder(
        booking_id=order.booking_id,
        order_id=order_id,
        amount=order.amount
    )
    
    await db.payments.insert_one(payment_order.dict())
    
    # Update booking with payment order
    await db.bookings.update_one(
        {"id": order.booking_id},
        {"$set": {"payment_id": payment_order.id}}
    )
    
    return {
        "id": order_id,
        "amount": order.amount * 100,  # Return in paise for Razorpay
        "currency": "INR",
        "key": os.getenv("RAZORPAY_KEY_ID", "rzp_test_demo_key")
    }

@api_router.post("/payment/verify")
async def verify_payment(payment: PaymentVerify):
    """Verify Razorpay payment (MOCKED for demo)"""
    # In production, verify signature:
    # import razorpay
    # client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET')))
    # client.utility.verify_payment_signature({
    #     'razorpay_order_id': payment.order_id,
    #     'razorpay_payment_id': payment.payment_id,
    #     'razorpay_signature': payment.signature
    # })
    
    # Update payment status
    await db.payments.update_one(
        {"order_id": payment.order_id},
        {"$set": {"status": "paid", "razorpay_payment_id": payment.payment_id}}
    )
    
    # Get payment to find booking
    payment_doc = await db.payments.find_one({"order_id": payment.order_id})
    
    if payment_doc:
        # Update booking status
        await db.bookings.update_one(
            {"id": payment_doc["booking_id"]},
            {"$set": {"status": "confirmed", "payment_status": "paid"}}
        )
        
        # Trigger physio assignment
        asyncio.create_task(assign_physio(payment_doc["booking_id"]))
    
    return {"success": True, "message": "Payment verified successfully"}

@api_router.post("/payment/mock-success/{booking_id}")
async def mock_payment_success(booking_id: str):
    """Mock payment success for demo"""
    # Update booking status
    await db.bookings.update_one(
        {"id": booking_id},
        {"$set": {"status": "confirmed", "payment_status": "paid"}}
    )
    
    # Trigger physio assignment
    asyncio.create_task(assign_physio(booking_id))
    
    return {"success": True, "message": "Payment marked as successful (DEMO)"}

# ==================== PHYSIO ASSIGNMENT ====================

async def assign_physio(booking_id: str):
    """Assign physiotherapist to booking with 5-minute acceptance window"""
    booking = await db.bookings.find_one({"id": booking_id})
    if not booking:
        return
    
    # Get available physios matching criteria
    query = {"is_available": True, "is_verified": True}
    
    # Filter by gender preference if specified
    if booking.get("physio_gender_preference"):
        query["personal_details.gender"] = booking["physio_gender_preference"]
    
    physios = await db.practitioners.find(query).to_list(10)
    
    if not physios:
        # No physios available - notify admin
        logger.warning(f"No physios available for booking {booking_id}")
        await db.bookings.update_one(
            {"id": booking_id},
            {"$set": {"assignment_status": "no_physio_available"}}
        )
        return
    
    # For demo: auto-assign first available physio
    assigned_physio = physios[0]
    
    await db.bookings.update_one(
        {"id": booking_id},
        {
            "$set": {
                "assigned_physio_id": assigned_physio["id"],
                "assignment_status": "assigned"
            }
        }
    )
    
    # Notify user via WebSocket
    if booking.get("user_id") and booking["user_id"] in manager.active_connections:
        await manager.send_to_user(booking["user_id"], {
            "type": "physio_assigned",
            "booking_id": booking_id,
            "physio_name": assigned_physio["personal_details"]["full_name"]
        })
    
    logger.info(f"Physio {assigned_physio['id']} assigned to booking {booking_id}")

# ==================== PRACTITIONER ENDPOINTS ====================

@api_router.post("/practitioner/apply")
async def apply_as_practitioner(practitioner: PractitionerCreate):
    """Submit practitioner application"""
    # Check if already applied
    existing = await db.practitioners.find_one({
        "personal_details.email": practitioner.personal_details.email
    })
    if existing:
        raise HTTPException(status_code=400, detail="Application already submitted with this email")
    
    new_practitioner = Practitioner(**practitioner.dict())
    await db.practitioners.insert_one(new_practitioner.dict())
    
    return {"success": True, "id": new_practitioner.id, "message": "Application submitted successfully"}

@api_router.post("/practitioner/{practitioner_id}/upload-certificate")
async def upload_certificate(
    practitioner_id: str,
    file: UploadFile = File(...),
    certificate_type: str = Form(...)
):
    """Upload practitioner certificates"""
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Check file size (5MB max)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit")
    
    # Save file
    filename = f"{practitioner_id}_{certificate_type}_{uuid.uuid4().hex[:8]}.pdf"
    file_path = UPLOAD_DIR / filename
    
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(contents)
    
    # Update practitioner record
    update_field = "degree_certificate" if certificate_type == "degree" else "certifications"
    
    if certificate_type == "degree":
        await db.practitioners.update_one(
            {"id": practitioner_id},
            {"$set": {"degree_certificate": str(filename)}}
        )
    else:
        await db.practitioners.update_one(
            {"id": practitioner_id},
            {"$push": {"certifications": str(filename)}}
        )
    
    return {"success": True, "filename": filename}

@api_router.get("/practitioner/{practitioner_id}")
async def get_practitioner(practitioner_id: str):
    """Get practitioner details"""
    practitioner = await db.practitioners.find_one({"id": practitioner_id})
    if not practitioner:
        raise HTTPException(status_code=404, detail="Practitioner not found")
    return practitioner

# ==================== WEBSOCKET ENDPOINTS ====================

@app.websocket("/ws/user/{user_id}")
async def websocket_user(websocket: WebSocket, user_id: str):
    """WebSocket connection for user notifications"""
    await manager.connect_user(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming messages if needed
    except WebSocketDisconnect:
        manager.disconnect_user(user_id)

@app.websocket("/ws/physio/{physio_id}")
async def websocket_physio(websocket: WebSocket, physio_id: str):
    """WebSocket connection for physio notifications"""
    await manager.connect_physio(physio_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            
            # Handle booking acceptance/rejection
            if data.get("type") == "booking_response":
                booking_id = data.get("booking_id")
                accepted = data.get("accepted", False)
                
                if accepted:
                    await db.bookings.update_one(
                        {"id": booking_id},
                        {
                            "$set": {
                                "assigned_physio_id": physio_id,
                                "assignment_status": "accepted"
                            }
                        }
                    )
                    # Notify user
                    booking = await db.bookings.find_one({"id": booking_id})
                    if booking and booking.get("user_id"):
                        await manager.send_to_user(booking["user_id"], {
                            "type": "physio_confirmed",
                            "booking_id": booking_id
                        })
                else:
                    # Rejected - try next physio
                    asyncio.create_task(assign_physio(booking_id))
                    
    except WebSocketDisconnect:
        manager.disconnect_physio(physio_id)

# ==================== CONTACT/SUPPORT ENDPOINTS ====================

class ContactMessage(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

@api_router.post("/contact")
async def submit_contact(message: ContactMessage):
    """Submit contact/support message"""
    msg_doc = {
        "id": str(uuid.uuid4()),
        **message.dict(),
        "created_at": datetime.utcnow(),
        "status": "new"
    }
    await db.contact_messages.insert_one(msg_doc)
    return {"success": True, "message": "Message received. We'll get back to you soon!"}

# Include the router
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
