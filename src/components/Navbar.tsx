import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, LogOut, User, PlusCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginDialog from "./LoginDialog";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
              to="/browse-listings" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/browse-listings") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Land Marketplace
            </Link>
            {user ? (
              <>
                <Link to="/post-listing">
                  <Button variant="default" size="sm" className="gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Post Land
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="default" size="sm" onClick={() => setShowLoginDialog(true)}>
                Login
              </Button>
            )}
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
              to="/browse-listings" 
              className={`block text-sm font-medium ${
                isActive("/browse-listings") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Land Marketplace
            </Link>
            {user ? (
              <div className="space-y-2">
                <Link to="/post-listing">
                  <Button variant="default" size="sm" className="w-full gap-2" onClick={() => setIsOpen(false)}>
                    <PlusCircle className="w-4 h-4" />
                    Post Land
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="w-full gap-2" onClick={() => setIsOpen(false)}>
                    <User className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => { signOut(); setIsOpen(false); }}>
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="default" size="sm" className="w-full" onClick={() => { setShowLoginDialog(true); setIsOpen(false); }}>
                Login
              </Button>
            )}
          </div>
        )}
      </div>
      
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </nav>
  );
};

export default Navbar;
