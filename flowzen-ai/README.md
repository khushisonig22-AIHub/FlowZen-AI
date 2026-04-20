# FlowZen AI - Smart Crowd Management System

**Revolutionary AI-powered crowd management and booking control platform** for seamless event experiences with real-time capacity monitoring, intelligent alerts, and smart access management.

![FlowZen AI](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06b6d4?style=flat-square&logo=tailwindcss)

## ✨ Features

### Core Features
- 🎟️ **Intelligent Booking Management** - Create, view, and manage event bookings with QR codes
- 📊 **Real-Time Crowd Monitoring** - Live capacity tracking with visual progress indicators
- 🚨 **Smart Alert System** - Automatic notifications when crowd capacity exceeds 80%
- 🔐 **Secure Access Control** - Gate management with entry/exit tracking
- 🎯 **User Authentication** - Secure login and signup with localStorage persistence
- 📱 **Responsive Design** - Seamless experience on mobile, tablet, and desktop

### Dashboard Features
- **Colorful Stat Cards** - Visual statistics with gradient backgrounds (Blue, Green, Purple)
- **Live Bookings Display** - Real-time booking cards with crowd capacity bars
- **Cancel Booking** - Remove bookings with confirmation dialog
- **Notification Bell** - Badge showing active crowd alerts
- **User Profile** - Welcome message with user information
- **Event Overview** - Quick access to venue management

### UI/UX Enhancements
- 🎨 **Dark Theme** - Eye-friendly dark slate color scheme
- ✨ **Framer Motion Animations** - Smooth transitions and micro-interactions
- 🎯 **Accessibility** - ARIA labels and semantic HTML throughout
- 📐 **Mobile Optimized** - Mobile-first responsive design
- 🔔 **Visual Feedback** - Toast-like alerts and confirmation dialogs

### Security & Performance
- 🔒 **Security Headers** - X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- 📈 **Google Analytics** - Event tracking and performance monitoring
- ⚡ **Next.js Optimization** - Static page pre-rendering and dynamic routes
- 🚀 **Turbopack** - Lightning-fast build times
- 🧪 **Jest Testing** - Comprehensive test coverage

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.17+ (LTS recommended)
- **npm** 9+ or **yarn** 3+
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flowzen-ai.git
   cd flowzen-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - Sign up to create account
   - Book tickets and manage bookings

### Build for Production

```bash
npm run build
npm start
```

## 📂 Project Structure

```
flowzen-ai/
├── app/
│   ├── layout.tsx              # Root layout with Google Fonts & Analytics
│   ├── page.tsx                # Homepage with event grid
│   ├── globals.css             # Global styles and typography
│   ├── dashboard/page.tsx      # Main dashboard with bookings
│   ├── login/page.tsx          # User login page
│   ├── signup/page.tsx         # User registration page
│   ├── book/page.tsx           # Event booking page
│   ├── ticket/[id]/page.tsx    # Ticket detail view
│   ├── admin/page.tsx          # Admin management panel
│   └── not-found.tsx           # 404 error page
├── components/
│   └── ui/                     # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       └── ...
├── lib/
│   └── utils.ts               # Utility functions
├── public/
│   └── setup-admin.js         # Admin setup script
├── __tests__/
│   └── basic.test.js          # Jest test suite
├── next.config.ts             # Next.js configuration with security headers
├── babel.config.js            # Babel configuration for JSX
├── jest.config.js             # Jest testing configuration
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── package.json               # Dependencies and scripts
```

## 🎯 Key Pages

### Home (`/`)
- Event listing with crowd capacity
- Filter by crowd level
- Quick access to booking and dashboard

### Signup (`/signup`)
- Create new account
- Email and password validation
- Automatic login after signup

### Login (`/login`)
- Secure user authentication
- Remember login option
- Forgot password link

### Dashboard (`/dashboard`)
- **Welcome Section** - User greeting and quick actions
- **Stat Cards** - Total, active, and upcoming bookings
- **Live Bookings** - Detailed booking cards with:
  - Event name and time
  - Entry/exit gate information
  - Crowd capacity progress bar
  - Status badges
  - Cancel booking button
  - View ticket link
- **Alerts** - High crowd warnings (80%+)

### Booking (`/book`)
- Select event
- Choose preferred gate
- Confirm booking
- Generate QR code

### Ticket (`/ticket/:id`)
- View ticket details
- Display QR code
- Entry/exit information
- Crowd status

## 🔧 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.4 | React framework with SSR |
| React | 19.2.4 | UI library |
| TypeScript | 5.0+ | Type safety |
| Tailwind CSS | 4.0 | Utility-first CSS |
| Framer Motion | Latest | Animations |
| Lucide React | Latest | Icon library |
| Radix UI | Latest | Accessible components |
| Jest | Latest | Testing framework |
| Google Analytics | - | Analytics tracking |

## 📊 Features in Detail

### Crowd Alert System
- **Automatic Detection** - Triggers when venue capacity >= 80%
- **Real-Time Monitoring** - Updates continuously
- **Visual Indicators** - Color-coded capacity bars (Green < 50%, Yellow 50-79%, Red >= 80%)
- **Notification Badge** - Alert count on notification bell

### Booking Management
- **Create Bookings** - Select events and gates
- **View Details** - Full booking information with QR code
- **Cancel Bookings** - Confirmation dialog to prevent accidents
- **Track Status** - Confirmed, Used, or Cancelled states

### User Experience
- **Gradient UI** - Eye-catching stat cards with Tailwind gradients
- **Smooth Animations** - Framer Motion transitions
- **Dark Theme** - Slate-950 background with vibrant accents
- **Responsive Layout** - Adapts to all screen sizes
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation

## 🔐 Security

- **XSS Protection** - X-Content-Type-Options header
- **Clickjacking Protection** - X-Frame-Options: DENY
- **Referrer Policy** - strict-origin-when-cross-origin
- **Permissions** - Camera, Microphone, Geolocation disabled
- **Data Storage** - localStorage for client-side persistence
- **Authentication** - Client-side session management

## 📈 Performance

- **Build Time** - ~7 seconds with Turbopack
- **Bundle Size** - Optimized with tree-shaking
- **Page Load** - Static pre-rendering for faster delivery
- **Database** - localStorage for instant response
- **Analytics** - Google Analytics integration (ID: G-FLOWZENAI01)

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Dashboard rendering with user data
- Empty state handling
- Logout functionality
- Booking cancellation
- Login redirect when not authenticated

### Test Suite
- **Framework** - Jest with React Testing Library
- **Environment** - jsdom for DOM simulation
- **Mocking** - Mocked Next.js router and localStorage

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel CLI
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables
No external APIs required. All data uses localStorage.

## 📝 Configuration

### next.config.ts
- Security headers
- Image optimization
- Font optimization

### tailwind.config.ts
- Dark theme colors
- Custom font family (Inter)
- Gradient utilities

### tsconfig.json
- Path aliasing (@/ for src)
- Strict mode enabled
- JSX preservation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**FlowZen AI Development Team**
- GitHub: [@flowzenai](https://github.com/flowzenai)
- Email: dev@flowzen.ai

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for deployment infrastructure
- Tailwind CSS for utility-first styling
- Radix UI for accessible components
- Lucide for beautiful icons

## 📞 Support

For support, email support@flowzen.ai or open an issue on GitHub.

---

**Made with ❤️ by FlowZen AI Team** | [Website](https://flowzen.ai) | [Documentation](https://docs.flowzen.ai)
npm run build
npm start
```

## Testing

Run Jest tests:

```bash
npm test
```
