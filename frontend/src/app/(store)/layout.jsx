import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StoreSessionProvider } from '@/components/providers/StoreSessionProvider';

export default function StoreLayout({ children }) {
  return (
    <StoreSessionProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </StoreSessionProvider>
  );
}
