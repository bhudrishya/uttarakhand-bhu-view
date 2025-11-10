import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async"; // 👈 new import
import { AuthProvider } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Search from "./pages/Search";
import MapView from "./pages/MapView";
import PropertyDetails from "./pages/PropertyDetails";
import PropertyMapView from "./pages/PropertyMapView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HelmetProvider>
        {/* 🌐 Global SEO + Metadata */}
        <Helmet>
          <title>Uttarakhand BhuDrishya | Digital Land Records Portal</title>
          <meta name="robots" content="index, follow" />
          <meta
            name="description"
            content="Access Uttarakhand's digital land records. Search properties by Khasra number, owner name, or map — powered by GIS technology for transparency and accuracy."
          />
          <meta
            name="keywords"
            content="Uttarakhand land records, Bhunaksha, BhuDrishya, Khasra number search, GIS map Uttarakhand, property verification, Dehradun land map"
          />
          <meta name="author" content="Uttarakhand BhuDrishya" />
          <link rel="canonical" href="https://budhrishya.in" />

          {/* ✅ Open Graph / Social Tags */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://budhrishya.in" />
          <meta
            property="og:title"
            content="Uttarakhand BhuDrishya – Digital Land Records Portal"
          />
          <meta
            property="og:description"
            content="View Uttarakhand's cadastral maps, verify land ownership, and explore real-time GIS-based land data."
          />
          <meta property="og:image" content="https://budhrishya.in/og-image.jpg" />
          <meta name="twitter:card" content="summary_large_image" />

          {/* ✅ Google site verification (optional) */}
          <meta name="google-site-verification" content="YOUR_VERIFICATION_TOKEN" />

          {/* ✅ Schema Markup (JSON-LD) */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "GovernmentService",
              name: "Uttarakhand BhuDrishya",
              description:
                "Digital platform for Uttarakhand land records and property verification.",
              serviceType: "Land Records",
              provider: {
                "@type": "GovernmentOrganization",
                name: "Government of Uttarakhand",
              },
              areaServed: "Uttarakhand, India",
              url: "https://budhrishya.in",
            })}
          </script>
        </Helmet>

        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <Search />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property"
                element={
                  <ProtectedRoute>
                    <PropertyDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/property/map"
                element={
                  <ProtectedRoute>
                    <PropertyMapView />
                  </ProtectedRoute>
                }
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </HelmetProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
