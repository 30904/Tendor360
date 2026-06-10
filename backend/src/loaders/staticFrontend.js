const path = require('path');
const fs = require('fs');
const express = require('express');

/**
 * Serve Vite production build when SERVE_STATIC=true or NODE_ENV=production
 * and frontend/dist exists (single-process deploy without nginx static root).
 */
function setupStaticFrontend(app) {
  const enabled =
    process.env.SERVE_STATIC === 'true' ||
    (process.env.NODE_ENV === 'production' && process.env.SERVE_STATIC !== 'false');

  if (!enabled) {
    return false;
  }

  const distPath = path.resolve(__dirname, '../../../frontend/dist');
  const indexHtml = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexHtml)) {
    console.warn(
      `⚠️  SERVE_STATIC enabled but ${indexHtml} not found. Run: cd frontend && npm run build`
    );
    return false;
  }

  console.log(`📦 Serving frontend from ${distPath}`);
  app.use(express.static(distPath, { maxAge: '1d', index: false }));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(indexHtml);
  });

  return true;
}

module.exports = { setupStaticFrontend };
