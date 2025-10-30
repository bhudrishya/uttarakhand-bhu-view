import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Shield, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-landscape.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative pt-16 min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(30, 27, 75, 0.85), rgba(30, 27, 75, 0.95)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Uttarakhand BhuDrishya
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Digital Land Records at Your Fingertips
            </p>
            <p className="text-lg text-white/80 mb-10">
              Access property details, verify ownership, and explore GIS-based land records with complete transparency and accuracy.
            </p>
            <div className="flex justify-center">
              <Link to="/search">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  <Search className="w-5 h-5" />
                  Search Property
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Key Features
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Empowering citizens and government with transparent, accurate, and accessible land records
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Maps</h3>
                <p className="text-muted-foreground">
                  View cadastral boundaries with satellite imagery overlay
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
                <p className="text-muted-foreground">
                  Find properties by Khasra number, owner name, or location
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Access</h3>
                <p className="text-muted-foreground">
                  Role-based authentication with encrypted data protection
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
                <p className="text-muted-foreground">
                  Track mutations and property transactions as they happen
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Access transparent, verified land records for Uttarakhand. Search properties, view maps, and verify ownership details instantly.
          </p>
          <Link to="/search">
            <Button size="lg" className="text-lg px-8">
              Start Searching
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Uttarakhand BhuDrishya. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
