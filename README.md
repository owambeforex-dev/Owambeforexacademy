# React Firebase Application

This is a production-ready React application built with Vite, Tailwind CSS, and Firebase. It is fully configured for deployment on GitHub, Vercel, Netlify, and Firebase Hosting.

## Project Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the `.env.example` file to `.env` and fill in your actual API keys and configuration values.
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_GEMINI_API_KEY`
   - `VITE_RAPID_API_KEY`

## Development

To start the development server:
```bash
npm run dev
```

## Build

To build the application for production:
```bash
npm run build
```
The output will be generated in the `dist` directory.

## Deployment Steps

### Netlify
The project includes a `netlify.toml` and `public/_redirects` file for seamless Netlify deployment.
1. Connect your GitHub repository to Netlify.
2. Netlify will automatically detect the build settings.
3. Add your environment variables in the Netlify dashboard.
4. Deploy.

### Vercel
The project includes a `vercel.json` file for routing configuration.
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect the Vite framework.
3. Add your environment variables in the Vercel dashboard.
4. Deploy.

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting` (select the `dist` directory as public)
4. Deploy: `firebase deploy --only hosting`

## Project Structure
- `/src/components` - Reusable UI components
- `/src/pages` - Application pages/routes
- `/src/contexts` - React contexts (e.g., AuthContext)
- `/src/firebase` - Firebase configuration and initialization
- `/src/layouts` - Layout components
- `/src/lib` - Utility functions and libraries
