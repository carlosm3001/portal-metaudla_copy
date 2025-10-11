import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";

export default function RootLayout(){
  return (
    <ErrorBoundary>
      <div className="min-h-dvh bg-bg text-ink">
        <Navbar />
        <main className="container mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}