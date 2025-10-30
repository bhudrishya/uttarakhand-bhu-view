import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Have questions about Uttarakhand BhuDrishya? We're here to help.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  For inquiries and support:
                </p>
                <a 
                  href="mailto:siddharth.kala1989@gmail.com" 
                  className="text-primary hover:underline font-medium"
                >
                  siddharth.kala1989@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Uttarakhand, India
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About Our Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Uttarakhand BhuDrishya is a comprehensive digital land records platform designed to provide 
                transparent and accessible property information for the state of Uttarakhand.
              </p>
              <p><strong>Key Services:</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>GIS-based interactive property maps</li>
                <li>Property search and verification</li>
                <li>Ownership detail access</li>
                <li>Real-time transaction tracking</li>
                <li>Secure document management</li>
              </ul>
              <p className="mt-6">
                Whether you're a buyer, seller, or government official, our platform provides the tools 
                you need to access accurate land records with complete transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We typically respond to inquiries within 24-48 hours during business days.
              </p>
              <p className="text-muted-foreground mt-2">
                For urgent matters, please mark your email as "Urgent" in the subject line.
              </p>
            </CardContent>
          </Card>
        </div>
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

export default Contact;
