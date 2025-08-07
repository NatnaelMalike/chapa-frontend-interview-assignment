
export default function ThankYouPage() {
    return (
      <main className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 rounded shadow-md text-center max-w-md">
          <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Payment Successful!</h1>
          <p className="text-gray-700">
            Thank you for your payment. We've received your transaction.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            You can close this tab or return to the dashboard.
          </p>
          <div className="mt-6">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Go to Dashboard
            </a>
            </div>
        </div>
      </main>
    );
  }
  