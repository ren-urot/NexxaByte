# Nexxabyte Website

Static marketing website for Nexxabyte — Software Development & Technology Outsourcing.

## Running locally

No build step required. Either:

- Open `index.html` directly in a browser, or
- Serve the folder with a local static server (recommended, avoids any
  browser file:// quirks):

  ```bash
  python3 -m http.server 8000
  ```

  Then visit `http://localhost:8000`.

## Project structure

```
index.html, about.html, services.html, contact.html   Pages
assets/css/variables.css                               Brand colors, type scale, spacing tokens
assets/css/base.css                                     Reset, typography, layout primitives
assets/css/components.css                                Header, footer, buttons, cards, forms
assets/css/pages.css                                      Page-specific section styles
assets/js/main.js                                          Mobile nav toggle, scroll-reveal, form validation
assets/images/logo.svg                                      Nexxabyte logo
```

## Before going live — required setup

1. **Contact form (Formspree):**
   - Create a free account at formspree.io and create a new form.
   - In `contact.html`, find the `<form>` tag and replace
     `YOUR_FORMSPREE_ID` in `action="https://formspree.io/f/YOUR_FORMSPREE_ID"`
     with your real Formspree form ID.
   - Submit a test message from the live site to confirm delivery.

2. **Contact email:** The placeholder email `inquiry@nexxabyte.com` appears
   in `contact.html`'s info card and in every page's footer. Replace it with
   your real company email (find-and-replace across all 4 HTML files).

3. **Social links:** Commented-out social link placeholders are not yet
   present in the footer. Add a `<ul class="social-links">` with real
   LinkedIn/social URLs in the footer's "Get in Touch" column on all 4 pages
   when available.

4. **Photography:** Hero (`index.html`) and About (`about.html`) currently
   use placeholder photos from picsum.photos. Replace the `src` attributes
   on `.hero-photo` and `.rounded-photo` with real company photography when
   available, and update the `alt` text accordingly.

## Deployment

This is a static site — deploy by pointing any static host (Vercel,
Netlify, GitHub Pages, S3 + CloudFront, etc.) at this folder. No build
command is needed.
