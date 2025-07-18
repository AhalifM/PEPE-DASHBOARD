# PEPE Business Platform

A comprehensive business management platform designed for Malaysian businesses, providing seamless integration from SSM registration to payment processing and business operations.

## 🚀 Features

### Business Onboarding
- **SSM Registration Integration**: Automated verification of Malaysian business SSM numbers
- **Business Verification**: Complete KYB (Know Your Business) documentation process
- **Wallet Setup**: Integrated payment processing and business wallet management
- **Progress Tracking**: Visual step-by-step onboarding progress

### Platform Capabilities
- Complete business management dashboard
- Payment processing integration
- Order management system
- Business analytics and reporting
- Mobile-responsive design

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Package Manager**: Bun
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Development**: ESLint for code quality

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   ├── layout/          # Layout components
│   └── dev/             # Development components
├── pages/
│   └── Onboarding.tsx   # Business onboarding flow
├── contexts/
│   └── BusinessContext.tsx # Business state management
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
└── utils/               # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd market-mosaic-online-417
```

2. **Install dependencies**
```bash
bun install
```

3. **Start development server**
```bash
bun run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run build:dev` - Build in development mode
- `bun run lint` - Run ESLint for code quality
- `bun run preview` - Preview production build locally

## 🏢 Business Onboarding Flow

The platform features a comprehensive 4-step onboarding process:

### Step 1: SSM Registration
- Enter Malaysian SSM registration number
- Automatic business details verification
- Real-time validation and data fetching

### Step 2: Business Verification
- Upload required business documents
- Identity verification process
- Compliance checks

### Step 3: KYB Completion
- Know Your Business documentation
- Enhanced due diligence
- Risk assessment

### Step 4: Wallet Setup
- Business payment wallet creation
- Payment method integration
- Transaction capabilities activation

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible design:

- **Cards**: Information display and form containers
- **Buttons**: Primary actions with brand colors (#e03b6d)
- **Forms**: Input fields with validation
- **Badges**: Status indicators
- **Icons**: Lucide React icon set

## 🔧 Configuration Files

- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS customization
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint rules
- `components.json` - shadcn/ui configuration

### Supported Platforms
- Netlify
- Vercel
- AWS S3 + CloudFront
- Firebase Hosting
- Any static hosting service

## 🔐 Environment Setup

Create a `.env` file for environment variables:

```env
VITE_API_URL=your_api_endpoint
VITE_SSM_API_KEY=your_ssm_api_key
VITE_PAYMENT_API_KEY=your_payment_api_key
```

## 📱 Mobile Support

The platform is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


