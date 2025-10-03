import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MobileDrawer from './MobileDrawer';
import DigitalClock from './DigitalClock';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const {
    currentUser
  } = useAuth();
  // ...existing code...
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  if (!currentUser) {
    return <Outlet />;
  }
  return <div className="flex h-screen bg-background transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar />
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileDrawerOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 transition-colors pb-20 sm:pb-4">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        {/* Digital Clock */}
        <DigitalClock />
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>;
};
export default Layout;