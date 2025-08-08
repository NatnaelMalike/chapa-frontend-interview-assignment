
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Payment Successful!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Thank you for your payment. We've received your transaction and it's being processed.
          </p>
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly.
          </p>
          <div className="pt-4">
            <Link href="/dashboard">
              <Button className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}