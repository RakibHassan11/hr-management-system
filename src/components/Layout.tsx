
import { Sidebar } from './Sidebar';
import { UserNav } from './UserNav';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-50/30">
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1">
          <header className="h-16 bg-white border-b border-blue-100 shadow-sm flex items-center justify-end px-6">
            <UserNav />
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
