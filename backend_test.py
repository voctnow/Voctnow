import requests
import sys
import json
from datetime import datetime

class VoctAPITester:
    def __init__(self, base_url="https://1c9979aa-49b9-4496-aa3c-801a65899aa0.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.passed_tests.append(name)
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                self.failed_tests.append({
                    "test": name,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            self.failed_tests.append({
                "test": name,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test basic API health check"""
        return self.run_test(
            "API Health Check",
            "GET",
            "api/",
            200
        )

    def test_services_api(self):
        """Test services API endpoint"""
        return self.run_test(
            "Services API",
            "GET", 
            "api/services",
            200
        )

    def test_pricing_api(self):
        """Test pricing API endpoint"""
        return self.run_test(
            "Pricing API",
            "GET",
            "api/pricing", 
            200
        )

    def test_send_otp(self):
        """Test OTP sending"""
        return self.run_test(
            "Send OTP",
            "POST",
            "api/auth/send-otp",
            200,
            data={"phone": "+919876543210"}
        )

    def test_verify_otp(self):
        """Test OTP verification with demo OTP"""
        # First send OTP to get the demo OTP
        success, response = self.test_send_otp()
        if not success:
            return False, {}
        
        # Extract demo OTP from response message
        demo_otp = "123456"  # Default fallback
        if "Use OTP" in response.get("message", ""):
            try:
                # Extract OTP from message like "Use OTP 123456"
                message = response["message"]
                otp_part = message.split("Use OTP ")[1].split("]")[0]
                demo_otp = otp_part.strip()
            except:
                pass
        
        return self.run_test(
            "Verify OTP",
            "POST", 
            "api/auth/verify-otp",
            200,
            data={"phone": "+919876543210", "otp": demo_otp}
        )

    def test_contact_api(self):
        """Test contact form submission"""
        return self.run_test(
            "Contact Form",
            "POST",
            "api/contact",
            200,
            data={
                "name": "Test User",
                "email": "test@example.com", 
                "phone": "+919876543210",
                "message": "Test message from API testing"
            }
        )

    def test_assessment_api(self):
        """Test assessment creation"""
        return self.run_test(
            "Create Assessment",
            "POST",
            "api/assessment",
            200,
            data={
                "basic_details": {
                    "name": "Test Patient",
                    "age": 30,
                    "gender": "Male",
                    "city_area": "Mumbai",
                    "contact_number": "+919876543210"
                },
                "chief_complaint": "joint_muscle",
                "conditional_answers": {
                    "pain_level": "moderate",
                    "duration": "2_weeks"
                }
            }
        )

def main():
    print("🚀 Starting VOCT Healthcare API Testing...")
    print("=" * 60)
    
    # Setup
    tester = VoctAPITester()
    
    # Run core API tests
    print("\n📋 Testing Core API Endpoints...")
    tester.test_health_check()
    tester.test_services_api()
    tester.test_pricing_api()
    
    # Test authentication flow
    print("\n🔐 Testing Authentication Flow...")
    tester.test_send_otp()
    tester.test_verify_otp()
    
    # Test other endpoints
    print("\n📝 Testing Additional Endpoints...")
    tester.test_contact_api()
    tester.test_assessment_api()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {len(tester.failed_tests)}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"  - {failure.get('test', 'Unknown')}: {failure.get('error', failure.get('response', 'Unknown error'))}")
    
    if tester.passed_tests:
        print(f"\n✅ Passed Tests:")
        for test in tester.passed_tests:
            print(f"  - {test}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())