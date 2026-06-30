# Nexxabyte Company Website — Design Spec

Date: 2026-07-01

## Purpose

Build a marketing/brochure website for Nexxabyte, a software development and
technology outsourcing company, to present the company's services, value
proposition, and mission/vision to prospective clients, and to capture leads
via a contact form.

## Tech Stack

Static HTML/CSS/JS — no framework, no build step. Easy to host on any static
host (Vercel, Netlify, GitHub Pages, S3, etc.) with zero configuration.

## Scope: Multi-page site

Four pages, linked via a shared nav/footer:

- `index.html` — Home
- `about.html` — About
- `services.html` — Services
- `contact.html` — Contact

## File Structure

```
NexxaByte/
├── index.html
├── about.html
├── services.html
├── contact.html
├── assets/
│   ├── css/
│   │   ├── variables.css   (brand colors, type scale, spacing)
│   │   ├── base.css        (reset, typography, layout primitives)
│   │   ├── components.css  (nav, buttons, cards, footer)
│   │   └── pages.css       (page-specific sections)
│   ├── js/
│   │   └── main.js         (mobile nav toggle, scroll-reveal, form validation)
│   └── images/
│       └── logo.svg        (cleaned-up version of the provided logo)
└── README.md                (local dev instructions + Formspree setup)
```

No templating layer — header/footer markup is duplicated across the 4 HTML
files and kept in sync manually. Acceptable at this scale (4 pages).

## Page Content

### Home (`index.html`)
- Hero: headline ("Transform Ideas Into Scalable Digital Products"), subhead
  describing Nexxabyte's positioning, two CTAs ("Get a Free Consultation" →
  Contact, "View Services" → Services), abstract gradient visual echoing the
  logo's interlocking shapes.
- Services preview: 6 of the 12 services as icon cards, "View All Services"
  link to Services page.
- Why Choose Us: 6 bullet points (from provided copy) as a feature grid.
- Mission/Vision teaser band: dark section, orange accent, short excerpt
  linking to About.
- CTA banner before footer, linking to Contact.

### About (`about.html`)
- Company intro paragraph (from provided copy).
- Mission and Vision as two distinct callout cards (full text from provided
  copy).
- Why Choose Nexxabyte — full list, expanded from Home's teaser.
- "How We Work" — brief process blurb derived from the existing copy
  (strategy → design → development → cloud deployment → maintenance).

### Services (`services.html`)
All 12 services as detailed cards, each with an icon, name, and a 1-2
sentence description (written to match each service, since the source copy
only lists names). Grouped into four categories:
- **Development**: Custom Software Development, Web Application Development,
  Mobile App Development (iOS & Android), SaaS Product Development, AI &
  Automation Solutions
- **Design & Quality**: UI/UX Design, Quality Assurance & Testing
- **Operations**: Cloud & DevOps Services, Software Maintenance & Support
- **Team & Consulting**: Dedicated Development Teams, IT Staff Augmentation,
  Technology Consulting

CTA to Contact at the bottom of the page.

### Contact (`contact.html`)
- Contact form: Name, Email, Company, Service interest (dropdown of the 12
  services), Message. Submits to Formspree (form action left as a clearly
  marked placeholder `YOUR_FORMSPREE_ID` for the user to fill in after
  creating a free Formspree account).
- Contact info block: placeholder email `inquiry@nexxabyte.com`.
- Social/LinkedIn links: omitted (commented out in HTML) until real handles
  are provided.
- Client-side validation (required fields, email format) before submit.

## Design System

- **Colors**: `--color-primary: #FF4E00` (orange, from logo), `--color-dark:
  #484848` (charcoal), plus a near-black for hero/dark-band backgrounds, an
  off-white page background, and a light-gray alternate section background.
- **Typography**: A bold geometric sans for headings (Space Grotesk, via
  Google Fonts) + Inter for body text.
- **Imagery**: Stock-style photography placeholders (stable, fixed Unsplash
  photo URLs — not randomized) for hero/about sections (team/office/coding
  imagery), combined with SVG icons for services/features and abstract
  gradient shapes for backgrounds.
- **Components**: sticky header with mobile hamburger menu; rounded
  service/feature cards with hover lift; gradient hero shapes echoing the
  logo's interlocking forms; dark mission/vision band; consistent footer
  with nav links, logo, and contact info.
- **Interactivity** (`main.js`): mobile nav toggle; scroll-reveal fade-ins
  via IntersectionObserver (no external libraries); contact form client-side
  validation prior to Formspree submission.

## Logo

The provided SVG (`Nex 2 logo copy.svg`) contains multiple hidden layers
(`display:none` groups for unused design iterations). Only the
`Layer_1_copy_2` group is visible. The implementation will extract just that
visible group into a clean, minimal `assets/images/logo.svg` for use in the
nav and footer.

## Out of Scope

- No CMS or backend — content is hand-coded into HTML.
- No blog, portfolio/case studies, or testimonials sections (no source
  content provided for these; not fabricated).
- No real photography — placeholder stock images only, swappable later.
- No analytics/tracking integration (can be added later if requested).
- No automated test suite — this is a static marketing site; verification is
  manual (visual review + link/form checks).

## Open Items for User (post-build)

- Create a Formspree account and supply the real form ID.
- Confirm or replace the placeholder contact email
  (`inquiry@nexxabyte.com`).
- Supply real social/LinkedIn links if desired.
- Supply real photography to replace stock placeholders, when available.
