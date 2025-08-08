"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Chapa Logo */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-card rounded-2xl shadow-sm mb-4">
            <Image
              src="/chapa_gradient.png"
              alt="Chapa Logo"
              width={120}
              height={40}
              className="mx-auto"
              priority
            />
          </div>
        </div>

        {/* 404 Card */}
        <Card className={`border-0 shadow-2xl bg-card/95 backdrop-blur-sm transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <CardHeader className="text-center pb-6 pt-8">
            <div className="flex justify-center mb-6">
              <div className={`p-4 bg-destructive/10 rounded-full transition-all duration-500 delay-300 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-45'
              }`}>
                <AlertTriangle className="w-16 h-16 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-6xl font-bold text-foreground mb-2">
              404
            </CardTitle>
            <p className="text-xl font-semibold text-foreground mb-2">
              Page Not Found
            </p>
            <p className="text-lg text-muted-foreground">
              The page you're looking for doesn't exist
            </p>
          </CardHeader>
          
          <CardContent className="text-center space-y-6 px-8 pb-8">
            {/* Error Details */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Search className="w-5 h-5" />
                <span className="font-medium">What happened?</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The page you requested could not be found. It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="flex-1 flex items-center gap-2 h-12"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              <Link href="/" className="flex-1">
                <Button className="w-full flex items-center gap-2 h-12">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Additional Help */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Still having trouble? Contact our support team at{" "}
                <span className="text-primary font-medium">support@chapa.co</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}