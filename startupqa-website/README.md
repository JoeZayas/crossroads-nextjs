# StartupQA Website

A modern, responsive website for a QA consultancy built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

- **Modern SaaS Design**: Clean, professional styling with gradient backgrounds and smooth transitions
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **App Router**: Built with Next.js 16 App Router for optimal performance
- **6 Complete Pages**:
  - Home (/) - Hero section with value proposition and CTAs
  - Services (/services) - Comprehensive service offerings
  - How We Work (/how-we-work) - Process and engagement models
  - Case Studies (/case-studies) - Success stories and results
  - About (/about) - Company mission, values, and team
  - Contact (/contact) - Contact form and FAQ

- **Shared Components**:
  - Responsive Navbar with mobile menu
  - Footer with navigation links
  - "Book a Call" CTA buttons throughout

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Inter (Google Fonts)

## Project Structure

```
app/
├── components/
│   ├── Navbar.tsx       # Navigation component
│   └── Footer.tsx       # Footer component
├── about/
│   └── page.tsx        # About page
├── case-studies/
│   └── page.tsx        # Case studies page
├── contact/
│   └── page.tsx        # Contact page
├── how-we-work/
│   └── page.tsx        # How we work page
├── services/
│   └── page.tsx        # Services page
├── layout.tsx          # Root layout with navbar/footer
├── page.tsx            # Home page
└── globals.css         # Global styles
```

## Customization

### Colors
The primary brand color is indigo-600. To change it, update the Tailwind color classes throughout the components.

### Content
All content is hardcoded in the page components. Update the text, images, and data structures in each page.tsx file.

### Contact Form
The contact form currently has a simulated submission. To make it functional, integrate with your preferred form handling service (e.g., Formspree, SendGrid, etc.) in `app/contact/page.tsx`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT
