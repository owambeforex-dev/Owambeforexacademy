import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBottomNav from '../components/MobileBottomNav';
import AIChatbot from '../components/AIChatbot';
import LiveNotifications from '../components/LiveNotifications';
import AnimatedBackground from '../components/AnimatedBackground';

export default function RootLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isProfilePage = location.pathname === '/profile' || location.pathname === '/settings';
  const isPaymentPage = location.pathname === '/payment';
  const hideLayout = isAuthPage || isProfilePage;

  return (
    <div className="min-h-screen flex flex-col text-brand-light font-sans selection:bg-brand-primary selection:text-brand-dark relative z-0">
      <AnimatedBackground />
      {!hideLayout && (
        isPaymentPage ? (
          <div className="hidden md:block">
            <Navbar />
          </div>
        ) : (
          <Navbar />
        )
      )}
      <main className={`flex-grow ${(!hideLayout && !isPaymentPage) ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      {!hideLayout && !isPaymentPage && <Footer />}
      {!hideLayout && !isPaymentPage && <MobileBottomNav />}
      {!isAuthPage && <AIChatbot />}
    </div>
  );
}
