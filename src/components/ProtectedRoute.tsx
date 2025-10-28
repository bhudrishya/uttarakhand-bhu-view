import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginDialog from './LoginDialog';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LoginDialog open={true} onOpenChange={setShowLoginDialog} />
        <div className="min-h-screen flex items-center justify-center bg-background blur-sm">
          {children}
        </div>
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
