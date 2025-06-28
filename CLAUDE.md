# Natural Playgrounds Frontend

## Project Overview

Natural Playgrounds is a Next.js-based e-commerce frontend application for outdoor playground equipment. The project uses React 17, Redux for state management, and Tailwind CSS for styling.

## Tech Stack

- **Framework**: Next.js 11.0.1
- **React**: 17.0.2
- **State Management**: Redux Toolkit, React Context API
- **Styling**: Tailwind CSS 2.2.4 with JIT mode
- **Authentication**: Custom auth with JWT tokens
- **Cart Management**: react-use-cart
- **API Client**: Apollo Client for GraphQL
- **Search**: Searchkit (Elasticsearch integration)
- **UI Components**: Elastic UI, Headless UI
- **Icons**: Heroicons
- **Forms**: React Google Autocomplete, React Payment Inputs
- **PDF Generation**: jsPDF

## Project Structure

```
natural-playgrounds-frontend/
├── components/          # React components
│   ├── widget/         # Reusable UI widgets
│   ├── cart.js         # Shopping cart component
│   ├── layout.js       # Main layout wrapper
│   ├── navbar.js       # Navigation bar
│   └── ...            # Other feature components
├── pages/              # Next.js pages (routes)
│   ├── products/       # Product pages
│   ├── gallery/        # Gallery pages
│   ├── purchase/       # Purchase flow
│   └── ...            # Auth & other pages
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── styles/             # Global CSS styles
├── public/             # Static assets
└── images/             # Image assets
```

## Development Setup

### Prerequisites
- Node.js (version compatible with Next.js 11)
- Yarn or npm
- Backend API running on port 8000

### Environment Variables
Create a `.env` file in the root directory:

```env
API_URL="http://localhost:8000"
NEXT_PUBLIC_API_URL="http://localhost:8000"
TOKEN_SECRET="your-secure-token-secret"
```

### Installation

```bash
# Install dependencies
yarn install
# or
npm install
```

### Running the Development Server

```bash
# Start dev server on port 3005
yarn dev
# or
npm run dev
```

The application will be available at `http://localhost:3005`

### Available Scripts

- `yarn dev` / `npm run dev` - Start development server on port 3005
- `yarn build` / `npm run build` - Build for production
- `yarn start` / `npm start` - Start production server
- `yarn lint` / `npm run lint` - Run ESLint

## Key Features

### 1. Dynamic Page System
- Pages are built dynamically using widgets from the API
- Widget system allows flexible content management
- Homepage and other pages fetch their structure from the backend

### 2. Product Catalog
- Product listing with categories
- Individual product pages with details
- Product instructions and PDF generation
- Search and filtering capabilities

### 3. Shopping Cart
- Persistent cart state using react-use-cart
- Cart slide-out drawer
- Add/remove items functionality

### 4. User Authentication
- Custom authentication system with JWT tokens
- Login, registration, and password reset flows
- Token stored in localStorage
- Protected routes for account management

### 5. Checkout Flow
- Multi-step checkout process
- Payment input handling
- Order confirmation

### 6. Search Integration
- Elasticsearch-powered search via Searchkit
- Category filtering
- Product search functionality

## Styling

### Tailwind Configuration
The project uses custom Tailwind configuration with:

- **Custom Colors**:
  - brown: `#695f5c`
  - tan/sand: `#f0e7de`
  - dark-green: `#0d5352`
  - blue-green: `#0b6265`
  - natural-red: `#b93b36`
  
- **Custom Fonts**:
  - `rounded`: Publica Play Regular
  - `body`: Open Sans

- **JIT Mode**: Enabled for optimized CSS generation

### Component Styling
- Utility-first approach with Tailwind CSS
- Responsive design with mobile-first approach
- Print-specific styles for PDF generation

## API Integration

### REST API
- Base URL configured via `NEXT_PUBLIC_API_URL`
- Used for page data, products, and search
- Authentication endpoints

### GraphQL (Apollo Client)
- Apollo Client setup for GraphQL queries
- Used for specific data fetching needs

### Image Hosting
Images are served from:
- Local development: `localhost`
- Production: AWS S3 (`natural-playgrounds-production.s3.amazonaws.com`)
- External: Unsplash

## State Management

### Redux Toolkit
- Used for global application state
- Cart state management
- User authentication state

### React Context
- `AuthContext`: Authentication state
- `CartContext`: Shopping cart UI state

### Local Storage
- JWT token persistence
- Cart data persistence

## Component Architecture

### Layout System
- Main layout wrapper with navbar and footer
- Consistent structure across all pages
- Responsive design

### Widget System
- Modular widget components
- Dynamic content rendering
- Types: text, images, grid sections, YouTube videos, contact forms

### Reusable Components
- Form components (login, registration, contact)
- Navigation components
- Product display components
- Cart components

## Performance Optimizations

1. **Next.js Optimizations**:
   - Static generation for pages
   - Image optimization with next/image
   - Code splitting

2. **Tailwind JIT**:
   - On-demand CSS generation
   - Smaller CSS bundle sizes

3. **React Strict Mode**:
   - Enabled for development warnings

## Security Considerations

- JWT token authentication
- Environment variables for sensitive data
- HTTPS in production
- Input validation on forms
- reCAPTCHA integration for forms

## Development Workflow

1. **Feature Development**:
   - Create/modify components in `/components`
   - Add new pages in `/pages`
   - Update styles with Tailwind utilities

2. **API Integration**:
   - Check backend API documentation
   - Update environment variables as needed
   - Handle loading and error states

3. **Testing**:
   - Manual testing in development
   - Cross-browser compatibility
   - Mobile responsiveness

## Common Tasks

### Adding a New Page
1. Create file in `/pages` directory
2. Export default React component
3. Add `getStaticProps` or `getServerSideProps` if needed
4. Page automatically available at corresponding route

### Adding a New Widget
1. Create component in `/components/widget/`
2. Add to `widgetChooser.js` switch statement
3. Handle props from API response

### Updating Styles
1. Use Tailwind utility classes
2. For custom styles, update `tailwind.config.js`
3. Global styles in `/styles/globals.css`

## Deployment

### Build Process
```bash
yarn build
```

### Production Environment
- Set production environment variables
- Update API URLs to production endpoints
- Ensure TOKEN_SECRET is secure
- Deploy to Vercel or similar Next.js hosting

### Port Configuration
- Development: Port 3005
- Production: Uses `$PORT` environment variable

## Troubleshooting

### Common Issues

1. **API Connection Errors**:
   - Verify backend is running on port 8000
   - Check NEXT_PUBLIC_API_URL is correct
   - Look for CORS issues

2. **Build Errors**:
   - Clear `.next` directory
   - Remove `node_modules` and reinstall
   - Check for missing environment variables

3. **Styling Issues**:
   - Ensure Tailwind classes are not purged
   - Check responsive breakpoints
   - Verify custom color definitions

## Future Improvements

- TypeScript migration for better type safety
- Unit and integration testing setup
- Performance monitoring
- Enhanced error handling
- Accessibility improvements
- SEO optimizations