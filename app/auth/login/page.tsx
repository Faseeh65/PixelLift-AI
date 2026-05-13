import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Sign In | PixelLift AI",
  description: "Sign in to PixelLift AI to access your dashboard and enhancement history.",
};

export default function LoginPage() {
  return (
    <div className="bg-[#F8FAFC] px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-7xl items-center justify-center">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}
