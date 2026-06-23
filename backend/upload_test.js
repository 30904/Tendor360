const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5025/api';

async function main() {
  console.log('🚀 Starting Automated AI Extraction Verification Script...');
  
  // 1. Log in to get accessToken
  let token;
  try {
    console.log('🔐 Logging in as manager@techcorp.com...');
    const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
      email: 'manager@techcorp.com',
      password: 'Manager@123'
    });
    
    token = loginResponse.data.data.accessToken;
    console.log('✅ Logged in successfully!');
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    console.log('⚠️ Make sure the backend server is running on port 5025.');
    return;
  }

  // 2. Read the test file
  const filePath = path.join(__dirname, '../test_metro_tender.txt');
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Test file not found at: ${filePath}`);
    console.log('Please create the test_metro_tender.txt file first.');
    return;
  }

  // 3. Upload the file to the documents endpoint
  let documentId;
  try {
    console.log('📤 Uploading test_metro_tender.txt...');
    
    // We construct the multipart form data using form-data
    const FormData = require('form-data');
    const form = new FormData();
    form.append('document', fs.createReadStream(filePath), {
      filename: 'test_metro_tender.txt',
      contentType: 'text/plain'
    });
    form.append('name', 'test_metro_tender.txt');
    form.append('type', 'TENDER_DOCUMENT');
    form.append('category', 'Healthcare');
    form.append('priority', 'MEDIUM');
    form.append('tags', 'tender, healthcare');

    const uploadResponse = await axios.post(`${BACKEND_URL}/documents/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });

    documentId = uploadResponse.data.data.document._id;
    console.log(`✅ Document uploaded successfully! Document ID: ${documentId}`);
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
    return;
  }

  // 4. Wait for processing to complete
  console.log('⏳ Waiting 4 seconds for AI processing to finish...');
  await new Promise(resolve => setTimeout(resolve, 4000));

  // 5. Fetch document details to verify extraction
  try {
    console.log('🔍 Fetching document details & AI extraction results...');
    const docResponse = await axios.get(`${BACKEND_URL}/documents/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const doc = docResponse.data.data.document;
    console.log('\n==================================================');
    console.log('📊 VERIFICATION RESULT');
    console.log('==================================================');
    console.log(`Status:        ${doc.status}`);
    console.log(`Is Processed:  ${doc.aiExtraction?.isProcessed}`);
    console.log(`Confidence:    ${doc.aiExtraction?.confidence}%`);
    console.log('--------------------------------------------------');
    console.log('Extracted Data:');
    console.log(`  Title:            ${doc.aiExtraction?.extractedData?.tenderTitle}`);
    console.log(`  Organization:     ${doc.aiExtraction?.extractedData?.organization}`);
    console.log(`  Estimated Value:  $${doc.aiExtraction?.extractedData?.estimatedValue?.amount}`);
    console.log(`  Location:         ${doc.aiExtraction?.extractedData?.location}`);
    console.log(`  Contact Email:    ${doc.aiExtraction?.extractedData?.contactInfo?.email}`);
    console.log(`  Deadline:         ${doc.aiExtraction?.extractedData?.deadline}`);
    console.log('==================================================\n');

    if (doc.aiExtraction?.extractedData?.organization === 'Metropolitan Transport Authority') {
      console.log('🎉 SUCCESS: Real AI extraction verified! The data matches the document content.');
    } else {
      console.log('⚠️ WARNING: Extracted organization is: ' + doc.aiExtraction?.extractedData?.organization);
    }
  } catch (error) {
    console.error('❌ Failed to fetch document details:', error.response?.data || error.message);
  }
}

main();
