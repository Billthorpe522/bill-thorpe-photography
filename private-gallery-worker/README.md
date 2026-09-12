# LW vs Andrew private gallery

Live route: https://billthorpephotography.com/galleries/lw-vs-andrew/
Cloudflare Worker: btp-lw-andrew-gallery

The gallery contains 100 selected photographs from 284 source exports. The public asset files in assets/private-lw-andrew are AES-256-GCM ciphertext encrypted with a cryptographically random key. Plaintext photographs, passwords, signing keys, and decryption keys must never be committed.

The Worker verifies a shared gallery password on the server, applies login rate limiting, and serves images only after validating a signed, expiring, HttpOnly session cookie. Password verification uses HMAC-SHA256 with a secret server key and the Web Crypto verification API. The gallery and all image responses use private/no-store and noindex headers.

Deployment uses Cloudflare multipart script upload, with these bindings:
- SESSION_SECRET: secret base64 signing key
- PASSWORD_MAC: secret base64 HMAC of password:<gallery password>
- IMAGE_KEY: secret base64 AES key
- ASSET_REF: immutable Git commit holding the encrypted images
- LOGIN_LIMIT: rate limit namespace 2026091201, 10 attempts per 60 seconds per IP and Cloudflare location

Compatibility date: 2026-09-12. Only billthorpephotography.com/galleries/lw-vs-andrew* is routed to this Worker. The main GitHub Pages website remains on its existing deployment flow. Changing the gallery password should also rotate SESSION_SECRET and PASSWORD_MAC to invalidate existing sessions. Image keys are independent of the shared password.

The browser gallery shows 1600px watermarked previews, with a full-screen viewer, keyboard controls, swipe gestures and a lock button. Original full-resolution files remain in the source folder.
