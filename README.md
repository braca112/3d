# 3D Model Generator

Generate amazing 3D models from text descriptions using AI1.

## Features

- Generate 3D models from text descriptions
- View and interact with 3D models in the browser
- Share models with others
- Download models in various formats
- User authentication with Google
- Free and premium subscription tiers

## Tech Stack

- Next.js 14 with App Router
- React Three Fiber for 3D rendering
- Groq API for AI text processing
- Vercel Blob for storage
- PostgreSQL database with Prisma
- NextAuth.js for authentication
- Stripe for payments
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Groq API key
- Google OAuth credentials
- Stripe account
- Vercel account (for deployment)

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/3d-model-generator.git
cd 3d-model-generator
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Copy the `.env.example` file to `.env.local` and fill in your environment variables:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Set up the database:

\`\`\`bash
npx prisma db push
\`\`\`

5. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The easiest way to deploy this application is with Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Set up the required environment variables
4. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
