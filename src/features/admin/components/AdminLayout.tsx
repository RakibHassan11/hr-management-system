import { AdminSidebar } from './AdminSidebar'; // Fixed: Use named import
import { AdminUserNav } from './AdminUserNav';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50/30">
      <div className="flex h-full">
        <AdminSidebar />
        <div className="flex-1">
          <header className="h-16 bg-white border-b border-blue-100 shadow-sm flex items-center justify-end px-6">
            <AdminUserNav />
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}