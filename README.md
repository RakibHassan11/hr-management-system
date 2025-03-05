# HRM Front-End

A modern web application for managing human resource tasks like employee records, leave applications, and attendance tracking.

---

## Features

- Secure login with JWT authentication
- Employee management
- Leave and attendance tracking

---

## Technologies

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Axios
- React Router

.
├── src
│   ├── components        # Reusable UI components (e.g., Sidebar, Layout)
│   ├── hooks            # Custom hooks (e.g., use-mobile, use-toast)
│   ├── lib              # Utility functions (e.g., API client)
│   ├── lovable-uploads  # Static assets (e.g., logos, images)
│   ├── pages            # Page components (e.g., Login, Employee, NotFound)
│   └── App.tsx          # Main app component with routing
├── .env                 # Environment variables (e.g., VITE_API_URL)
├── package.json         # Dependencies and scripts
├── tailwind.config.ts   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
