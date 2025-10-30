import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>About Uttarakhand BhuDrishya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Uttarakhand BhuDrishya is a digital land records management system that provides transparent, 
              accurate, and accessible land records for the state of Uttarakhand. Our platform empowers 
              citizens and government officials with GIS-based land information.
            </p>
            <p>
              <strong>Platform Features:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Interactive cadastral maps with satellite imagery overlay</li>
              <li>Property search by Khasra number, owner name, or location</li>
              <li>Secure role-based authentication system</li>
              <li>Real-time property transaction tracking</li>
              <li>Encrypted data protection for all records</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Information Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We collect information that you provide during registration including your name, email address, 
              and user type (buyer, seller, government official). Property search queries and map interactions 
              are logged to improve service quality.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your data is used to provide access to land records, verify property ownership, and maintain 
              the security of the platform. We implement industry-standard encryption and security measures 
              to protect your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All user data is encrypted and stored securely. We follow strict data protection protocols 
              and comply with government regulations for handling land records and personal information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              For privacy-related concerns or questions, please contact us at: 
              <a href="mailto:siddharth.kala1989@gmail.com" className="text-primary hover:underline ml-1">
                siddharth.kala1989@gmail.com
              </a>
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

export default PrivacyPolicy;
