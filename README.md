# CodeXp Website

A modern, component-based React website for **CodeXp - First Creators for Technology L.L.C**.

## 🏗️ Architecture

This project follows a scalable, maintainable architecture with clear separation of concerns.

```
src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Button.jsx         # Button variants
│   │   ├── Card.jsx           # Card components
│   │   ├── Icon.jsx           # Dynamic icon loader
│   │   ├── Section.jsx        # Section wrappers
│   │   └── index.js           # UI exports
│   │
│   ├── layout/                # Layout components
│   │   ├── Header.jsx         # Site header/navigation
│   │   ├── Footer.jsx         # Site footer
│   │   ├── Container.jsx      # Content container
│   │   └── index.js           # Layout exports
│   │
│   ├── sections/              # Page sections
│   │   ├── HeroSection.jsx    # Hero/landing section
│   │   ├── AboutSection.jsx   # About company
│   │   ├── ServicesSection.jsx # Services grid
│   │   ├── IndustriesSection.jsx # Industries list
│   │   ├── CTASection.jsx     # Call to action
│   │   └── index.js           # Section exports
│   │
│   └── index.js               # All component exports
│
├── constants/
│   └── index.js               # App configuration & data
│
├── hooks/                     # Custom React hooks
├── utils/                     # Utility functions
├── styles/                    # Global styles
│
├── App.jsx                    # Main app component
├── main.jsx                   # React entry point
└── index.css                  # Global CSS
```

## 🎯 Design Principles

### 1. **Component-Based Architecture**
- Small, focused components with single responsibilities
- Reusable UI primitives in `/components/ui`
- Layout components for structural consistency
- Feature sections as self-contained modules

### 2. **Data Separation**
- All static data in `/constants`
- Easy to update content without touching components
- Centralized configuration

### 3. **Consistent Exports**
- Barrel exports (`index.js`) in each folder
- Clean import statements
- Easy refactoring

### 4. **Type Safety**
- PropTypes for runtime validation
- Clear component interfaces

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/constants/index.js` | Company info, services, contact data |
| `src/components/ui/` | Reusable UI components |
| `src/components/layout/` | Header, Footer, Container |
| `src/components/sections/` | Page sections |
| `src/App.jsx` | Main application structure |

## 🎨 Styling

- CSS Variables for theming
- Mobile-first responsive design
- Dark mode by default

### CSS Variables
```css
:root {
  --surface: #000;
  --on-surface: #fff;
  --accent: #007af4;
  --accent-surface: #253145;
  --neutral: #818181;
}
```

## 🔧 Adding New Features

### Adding a New Service
1. Open `src/constants/index.js`
2. Add to `SERVICES` array:
```javascript
{
  id: 'new-service',
  icon: 'IconName',  // From lucide-react
  title: 'Service Title',
  description: 'Service description...',
}
```

### Adding a New Section
1. Create `src/components/sections/NewSection.jsx`
2. Export from `src/components/sections/index.js`
3. Import in `src/App.jsx`

### Creating a New UI Component
1. Create component in `src/components/ui/`
2. Add PropTypes validation
3. Export from `src/components/ui/index.js`

## 📦 Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool
- **Lucide React** - Icons
- **CSS Variables** - Theming

## 🌐 Deployment

The site is deployed on Vercel:
- Production: [codexp.co](https://codexp.co)

## 📄 License

© 2025 First Creators for Technology L.L.C. All rights reserved.
