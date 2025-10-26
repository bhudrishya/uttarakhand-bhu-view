import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">BhuDrishya</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/search") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Search Property
            </Link>
            <Link 
              to="/map" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/map") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Map View
            </Link>
            <Link to="/login">
              <Button variant="default" size="sm">Login</Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className={`block text-sm font-medium ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`block text-sm font-medium ${
                isActive("/search") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Search Property
            </Link>
            <Link 
              to="/map" 
              className={`block text-sm font-medium ${
                isActive("/map") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Map View
            </Link>
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button variant="default" size="sm" className="w-full">Login</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
