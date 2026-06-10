const jwt = require('jsonwebtoken');

// Generate access token (organizationKind: buyer | supplier — default buyer)
const generateAccessToken = (userId, companyId, organizationKind = 'buyer') => {
  console.log('🎫 Generating access token for user:', userId, 'company:', companyId);
  console.log('🔑 JWT_ACCESS_SECRET available:', !!process.env.JWT_ACCESS_SECRET);
  
  try {
    const token = jwt.sign(
      { id: userId, companyId: companyId, organizationKind },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m' }
    );
    console.log('✅ Access token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ Error generating access token:', error);
    throw error;
  }
};

// Generate refresh token
const generateRefreshToken = (userId, companyId, organizationKind = 'buyer') => {
  console.log('🔄 Generating refresh token for user:', userId, 'company:', companyId);
  console.log('🔑 JWT_REFRESH_SECRET available:', !!process.env.JWT_REFRESH_SECRET);
  
  try {
    const token = jwt.sign(
      { id: userId, companyId: companyId, organizationKind },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || '7d' }
    );
    console.log('✅ Refresh token generated successfully');
    return token;
  } catch (error) {
    console.error('❌ Error generating refresh token:', error);
    throw error;
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    return { valid: true, userId: decoded.id, companyId: decoded.companyId };
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

// Set refresh token as httpOnly cookie
const setRefreshTokenCookie = (res, token) => {
  console.log('🍪 Setting refresh token cookie');
  console.log('🍪 Cookie options:', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth/refresh'
  });
  
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh'
  });
  
  console.log('✅ Refresh token cookie set successfully');
};

// Clear refresh token cookie
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth/refresh'
  });
};

// Get token from authorization header
const getTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getTokenFromHeader
};
