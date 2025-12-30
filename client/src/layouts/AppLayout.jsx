// layout/AppLayout.jsx
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

export default function AppLayout({ children }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <AppHeader />
      <main className='flex-1 max-w-12xl mx-auto w-full '>{children}</main>
      <AppFooter />
    </div>
  );
}
