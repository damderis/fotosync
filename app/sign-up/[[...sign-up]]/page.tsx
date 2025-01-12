import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Get started with FotoSync
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90 w-full',
              footerActionLink: 'text-primary hover:text-primary/90',
              card: 'shadow-none p-0',
              formFieldInput: 'border-gray-300 focus:border-primary',
              formFieldLabel: 'text-gray-700',
              socialButtonsBlockButton: 'border-gray-300 hover:bg-gray-50',
              socialButtonsBlockButtonText: 'text-gray-600 font-medium',
              dividerLine: 'bg-gray-200',
              dividerText: 'text-gray-500'
            },
            layout: {
              socialButtonsPlacement: "bottom",
              privacyPageUrl: "https://clerk.dev/privacy",
              termsPageUrl: "https://clerk.dev/terms"
            }
          }}
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          afterSignUpUrl="/"
        />
      </div>
    </div>
  );
} 