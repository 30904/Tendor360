const bcrypt = require('bcryptjs');

async function testPasswordHashing() {
  console.log('🧪 Testing password hashing and comparison...\n');
  
  const testPassword = 'Admin@123';
  console.log('🔑 Test password:', testPassword);
  console.log('🔑 Test password length:', testPassword.length);
  
  try {
    // Hash the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    console.log('🔐 Hashed password:', hashedPassword);
    console.log('🔐 Hash length:', hashedPassword.length);
    console.log('🔐 Hash starts with:', hashedPassword.substring(0, 20));
    
    // Test comparison with correct password
    const correctComparison = await bcrypt.compare(testPassword, hashedPassword);
    console.log('✅ Correct password comparison:', correctComparison);
    
    // Test comparison with wrong password
    const wrongComparison = await bcrypt.compare('WrongPassword', hashedPassword);
    console.log('❌ Wrong password comparison:', wrongComparison);
    
    // Test comparison with empty password
    const emptyComparison = await bcrypt.compare('', hashedPassword);
    console.log('🚫 Empty password comparison:', emptyComparison);
    
    // Test comparison with null password
    const nullComparison = await bcrypt.compare(null, hashedPassword);
    console.log('🚫 Null password comparison:', nullComparison);
    
    console.log('\n🎉 Password test completed successfully!');
    
  } catch (error) {
    console.error('❌ Password test failed:', error);
  }
}

testPasswordHashing();
