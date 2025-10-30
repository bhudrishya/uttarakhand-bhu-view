import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By accessing and using Uttarakhand BhuDrishya, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these terms, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>2. Use of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Uttarakhand BhuDrishya provides access to digital land records for informational and verification 
              purposes. Users must register with accurate information and maintain the confidentiality of their 
              account credentials.
            </p>
            <p><strong>Users agree to:</strong></p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the service only for lawful purposes</li>
              <li>Not attempt to gain unauthorized access to any portion of the service</li>
              <li>Not use the service to violate any applicable laws or regulations</li>
              <li>Not interfere with or disrupt the service or servers</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Users must provide accurate and complete information during registration. You are responsible 
              for maintaining the security of your account and password. You must immediately notify us of 
              any unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>4. Data Accuracy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              While we strive to maintain accurate and up-to-date land records, we do not guarantee the 
              absolute accuracy, completeness, or reliability of any information provided through the service. 
              Users should verify critical information through official government channels.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All content, features, and functionality of Uttarakhand BhuDrishya are owned by the platform 
              and are protected by intellectual property laws. Users may not copy, modify, distribute, or 
              reverse engineer any part of the service without explicit permission.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Uttarakhand BhuDrishya shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use or inability to use the service. We provide the 
              service on an "as is" and "as available" basis.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Modifications to Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to modify, suspend, or discontinue the service at any time without prior 
              notice. We may also update these terms of service periodically, and continued use of the service 
              constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              For questions about these Terms of Service, please contact us at: 
              <a href="mailto:siddharth.kala1989@gmail.com" className="text-primary hover:underline ml-1">
                siddharth.kala1989@gmail.com
              </a>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last Updated: January 2025
            </p>
          </CardContent>
        </Card>
      </main>

      <footer className="py-8 border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Uttarakhand BhuDrishya. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
