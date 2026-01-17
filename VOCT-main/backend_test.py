import requests
import sys
import json
from datetime import datetime

class VOCTAPITester:
    def __init__(self, base_url="https://github-website-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.demo_otp = None
        self.user_id = None
        self.booking_id = None
        self.assessment_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED - {name}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ FAILED - {name}")
                print(f"   Expected: {expected_status}, Got: {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text[:200]}")
                self.failed_tests.append({
                    'test': name,
                    'expected': expected_status,
                    'actual': response.status_code,
                    'endpoint': endpoint
                })
                return False, {}

        except Exception as e:
            print(f"❌ FAILED - {name}")
            print(f"   Error: {str(e)}")
            self.failed_tests.append({
                'test': name,
                'error': str(e),
                'endpoint': endpoint
            })
            return False, {}

    def test_health_check(self):
        """Test API health check"""
        return self.run_test("Health Check", "GET", "", 200)

    def test_get_services(self):
        """Test getting all services - should return 6 services"""
        success, response = self.run_test("Get Services", "GET", "services", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} services")
            if len(response) == 6:
                print("✅ Correct number of services (6)")
                # Check service structure
                required_fields = ['id', 'name', 'description', 'sub_services', 'icon', 'price_per_session']
                for service in response:
                    missing_fields = [field for field in required_fields if field not in service]
                    if missing_fields:
                        print(f"⚠️  Service {service.get('id', 'unknown')} missing fields: {missing_fields}")
                return True, response
            else:
                print(f"❌ Expected 6 services, got {len(response)}")
                return False, response
        return success, response

    def test_get_pricing(self):
        """Test getting pricing - should return session pricing"""
        success, response = self.run_test("Get Pricing", "GET", "pricing", 200)
        if success and isinstance(response, dict):
            print(f"   Pricing options: {list(response.keys())}")
            expected_sessions = [1, 3, 7, 15, 30]
            missing_sessions = [str(s) for s in expected_sessions if str(s) not in response]
            if missing_sessions:
                print(f"⚠️  Missing pricing for sessions: {missing_sessions}")
            else:
                print("✅ All expected session pricing available")
        return success, response

    def test_send_otp(self):
        """Test sending OTP (MOCKED)"""
        phone = "+919876543210"
        success, response = self.run_test(
            "Send OTP", 
            "POST", 
            "auth/send-otp", 
            200,
            {"phone": phone}
        )
        if success and 'message' in response:
            # Extract demo OTP from message
            import re
            match = re.search(r'Use OTP (\d+)', response['message'])
            if match:
                self.demo_otp = match.group(1)
                print(f"   Demo OTP extracted: {self.demo_otp}")
            else:
                print("⚠️  Could not extract demo OTP from response")
        return success, response

    def test_verify_otp(self):
        """Test verifying OTP"""
        if not self.demo_otp:
            print("❌ No demo OTP available, skipping verify test")
            return False, {}
        
        phone = "+919876543210"
        success, response = self.run_test(
            "Verify OTP",
            "POST",
            "auth/verify-otp",
            200,
            {"phone": phone, "otp": self.demo_otp}
        )
        if success and response.get('success'):
            if response.get('user_id'):
                self.user_id = response['user_id']
                print(f"   Existing user logged in: {self.user_id}")
            else:
                print("   New user - needs signup")
        return success, response

    def test_signup(self):
        """Test user signup"""
        if self.user_id:
            print("ℹ️  User already exists, skipping signup")
            return True, {"user_id": self.user_id}
        
        phone = "+919876543210"
        success, response = self.run_test(
            "User Signup",
            "POST",
            "auth/signup",
            200,
            {
                "name": "Test User",
                "age": 30,
                "gender": "male",
                "phone": phone,
                "email": "test@example.com"
            }
        )
        if success and 'id' in response:
            self.user_id = response['id']
            print(f"   New user created: {self.user_id}")
        return success, response

    def test_create_assessment(self):
        """Test creating assessment"""
        success, response = self.run_test(
            "Create Assessment",
            "POST",
            "assessment",
            200,
            {
                "basic_details": {
                    "name": "Test User",
                    "age": 30,
                    "gender": "male",
                    "city_area": "Mumbai",
                    "contact_number": "9876543210"
                },
                "chief_complaint": "joint_muscle",
                "conditional_answers": {
                    "pain_location": "Knee",
                    "pain_duration": "2-6 weeks",
                    "pain_severity": 7,
                    "pain_with_movement": True
                }
            }
        )
        if success and 'id' in response:
            self.assessment_id = response['id']
            print(f"   Assessment created: {self.assessment_id}")
            print(f"   Recommended service: {response.get('recommended_service')}")
        return success, response

    def test_create_booking(self):
        """Test creating booking"""
        if not self.user_id:
            print("❌ No user ID available, skipping booking test")
            return False, {}
        
        success, response = self.run_test(
            "Create Booking",
            "POST",
            "booking",
            200,
            {
                "user_id": self.user_id,
                "service_type": "orthopaedic",
                "session_count": 3,
                "amount": 2499,
                "customer_name": "Test User",
                "customer_phone": "+919876543210",
                "customer_email": "test@example.com",
                "address": "123 Test Street, Test Area",
                "city": "Mumbai",
                "pincode": "400001",
                "preferred_date": "2025-01-20",
                "preferred_time": "10:00",
                "assessment_id": self.assessment_id
            }
        )
        if success and 'id' in response:
            self.booking_id = response['id']
            print(f"   Booking created: {self.booking_id}")
        return success, response

    def test_mock_payment(self):
        """Test mock payment success"""
        if not self.booking_id:
            print("❌ No booking ID available, skipping payment test")
            return False, {}
        
        success, response = self.run_test(
            "Mock Payment Success",
            "POST",
            f"payment/mock-success/{self.booking_id}",
            200
        )
        return success, response

    def test_practitioner_application(self):
        """Test practitioner application submission"""
        # Use unique email to avoid duplicate application error
        import time
        unique_email = f"physio{int(time.time())}@test.com"
        
        success, response = self.run_test(
            "Practitioner Application",
            "POST",
            "practitioner/apply",
            200,
            {
                "personal_details": {
                    "full_name": "Dr. Test Physio",
                    "age": 35,
                    "gender": "female",
                    "contact_number": "9876543211",
                    "email": unique_email,
                    "mothers_name": "Test Mother",
                    "permanent_address": "123 Physio Street",
                    "pin_code": "400001",
                    "city": "Mumbai"
                },
                "education": {
                    "institution_name": "Test Medical College",
                    "location": "Mumbai",
                    "degree": "BPT",
                    "bpth": True,
                    "mpth": False,
                    "aggregate_percentage": 85.5,
                    "year_of_graduation": 2015,
                    "registration_no": "REG123456"
                },
                "bank_details": {
                    "bank_name": "Test Bank",
                    "branch_name": "Test Branch",
                    "branch_address": "Test Address",
                    "account_number": "1234567890",
                    "ifsc_code": "TEST0001234",
                    "pan_card_number": "ABCDE1234F",
                    "aadhar_number": "123456789012"
                },
                "joining_details": {
                    "years_of_experience": 8,
                    "has_electrotherapy_equipment": True,
                    "travel_distance": "15km",
                    "emergency_availability": "yes",
                    "unique_practice": "Specialized in sports rehabilitation",
                    "standout_quality": "Patient-centered approach"
                }
            }
        )
        return success, response

    def test_contact_submission(self):
        """Test contact form submission"""
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "contact",
            200,
            {
                "name": "Test Contact",
                "email": "contact@test.com",
                "phone": "9876543212",
                "message": "This is a test contact message"
            }
        )
        return success, response

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting VOCT Healthcare API Tests")
        print("=" * 50)
        
        # Basic API tests
        self.test_health_check()
        self.test_get_services()
        self.test_get_pricing()
        
        # Auth flow tests
        self.test_send_otp()
        self.test_verify_otp()
        self.test_signup()
        
        # Assessment and booking flow
        self.test_create_assessment()
        self.test_create_booking()
        self.test_mock_payment()
        
        # Other features
        self.test_practitioner_application()
        self.test_contact_submission()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {self.tests_run}")
        print(f"   Passed: {self.tests_passed}")
        print(f"   Failed: {len(self.failed_tests)}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                error_msg = test.get('error', f"Status {test.get('actual')} != {test.get('expected')}")
                print(f"   - {test['test']}: {error_msg}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = VOCTAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())