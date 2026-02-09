# 🏢 HRM Front-End System

A **production-grade Human Resource Management (HRM) System** engineered with modern web technologies. This application showcases a **scalable, feature-based architecture**, designed to handle complex workforce management workflows with high performance and maintainability.

Built by **Rakib Hassan** to demonstrate expertise in **React ecosystem**, **Clean Code principles**, and **Enterprise-level Application Architecture**.

---

## 🚀 Key Features

### � **Professional User Experience**
- **Responsive Dashboard**: Data-rich visualization of attendance, leave balances, and holidays using `Recharts`.
- **Modern UI/UX**: Built with **Shadcn UI** & **Tailwind CSS** for a polished, accessible, and consistent design system.
- **Interactive Forms**: Robust form handling with **React Hook Form** and **Zod** schema validation.

### 👥 **Core Functionalities**
- **User Portal**:
    - **Smart Attendance**: Check-in/out logic, monthly summaries, and correction requests.
    - **Leave Management**: Full lifecycle management (Apply, Track, Approve/Reject) with real-time status updates.
    - **Profile & Security**: Secure profile management and password handling.
- **Admin Portal**:
    - **Employee Lifecycle**: CRUD operations for employee onboarding and offboarding.
    - **Global Oversight**: Organization-wide attendance monitoring and leave approval workflows.

### �️ **Enterprise-Grade Security**
- **JWT Authentication**: Secure, stateless authentication flow.
- **RBAC (Role-Based Access Control)**: Strict separation of concerns between `User` and `Admin` roles.
- **Route Protection**: Custom `PrivateRoute` wrappers ensuring secure navigation.

---

## 🏗️ Software Architecture

This project adopts a **Feature-Based Architecture** (Vertical Slice Architecture), enabling high cohesion and low coupling. Each feature module encapsulates its own logic, state, and UI, making the codebase highly scalable and easy to maintain.

### **Directory Structure**

```bash
src/
├── app/
│   ├── routes.tsx          # Centralized route configuration with Role-Based Guards
│   └── store/              # Redux Store configuration
├── features/               # 📦 The Core: Feature-Based Modules
│   ├── auth/               # Authentication logic (slices, API Services, Hooks)
│   ├── attendance/         # Attendance tracking domain
│   ├── employee/           # Employee management domain
│   ├── leave/              # Leave application domain
│   └── ...                 
├── components/             # 🧱 Shared UI Library
│   ├── ui/                 # Shadcn Atoms (Button, Input, Dialog, etc.)
│   └── navigationUI/       # Layouts, Sidebar, and Navigation components
├── hooks/                  # 🎣 Global Custom Hooks
│   ├── use-toast.ts        # Toast notifications
│   └── useAuth.ts          # Auth state abstraction
├── lib/                    # 🛠️ Core Utilities
│   └── utils.ts            # Class merging utility (clsx + tailwind-merge)
└── pages/                  # 📄 Page-level Components (Route Targets)
```

### **Code Quality Highlights**

- **Strict TypeScript**: Full type safety across components, API responses, and Redux state.
- **Efficient State Management**:
    - **Redux Toolkit**: Manages global auth and application state.
    - **TanStack Query (React Query)**: Handles server state (caching, deduping, background updates) for high performance.
- **Component Composition**: Reusable, atomic components built on top of Radix UI primitives.
- **Validation First**: Form inputs are validated at runtime using **Zod** schemas, ensuring data integrity before it reaches the API.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) | High-performance UI rendering and build tooling. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Static typing for reliability and developer experience. |
| **State** | [Redux Toolkit](https://redux-toolkit.js.org/) | Predictable global state management. |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query/latest) | Server state synchronization and caching. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS for rapid UI development. |
| **UI Library** | [Shadcn UI](https://ui.shadcn.com/) | Accessible, customizable component primitives. |
| **Forms** | [React Hook Form](https://react-hook-form.com/) | Performant, uncontrolled form validation. |
| **Routing** | [React Router v6](https://reactrouter.com/) | Client-side routing with nested layouts. |

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/RakibHassan11/hr-management-system.git
    cd hrm-front-end
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Launch Development Server**
    ```bash
    npm run dev
    ```

---

## 🤝 Contributing

Contributions are welcome! Please follow the standard Pull Request workflow.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
