const axios = require('axios');

const API_BASE_URL = 'http://localhost:5025/api';

// Test user management API endpoints
async function testUserAPI() {
  console.log('🧪 Testing User Management API...\n');

  try {
    // Test 1: Get available roles
    console.log('1. Testing GET /users/roles...');
    try {
      const rolesResponse = await axios.get(`${API_BASE_URL}/users/roles`);
      console.log('✅ Roles endpoint working:', rolesResponse.data);
    } catch (error) {
      console.log('❌ Roles endpoint failed:', error.response?.data || error.message);
    }

    // Test 2: Get user statistics
    console.log('\n2. Testing GET /users/stats/overview...');
    try {
      const statsResponse = await axios.get(`${API_BASE_URL}/users/stats/overview`);
      console.log('✅ Stats endpoint working:', statsResponse.data);
    } catch (error) {
      console.log('❌ Stats endpoint failed:', error.response?.data || error.message);
    }

    // Test 3: Get users (requires authentication)
    console.log('\n3. Testing GET /users (requires auth)...');
    try {
      const usersResponse = await axios.get(`${API_BASE_URL}/users`);
      console.log('✅ Users endpoint working:', usersResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Users endpoint properly requires authentication');
      } else {
        console.log('❌ Users endpoint failed:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 User Management API test completed!');
    console.log('\n📝 Note: Some endpoints require authentication.');
    console.log('   To test authenticated endpoints, you need to:');
    console.log('   1. Start the backend server');
    console.log('   2. Login through the frontend to get a token');
    console.log('   3. Use the token in Authorization header');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testUserAPI();
