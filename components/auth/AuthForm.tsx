"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  async function handleOAuth() {
    try {
      setIsLoading(true);
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("[auth] oauth error:", error);
      toast.error("Google sign-in is unavailable right now.");
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      const supabase = createClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          throw error;
        }

        toast.success("Logged in successfully.");
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success("Check your email to finish sign up.");
    } catch (error) {
      console.error("[auth] form error:", error);
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>
        <h1 className="text-3xl font-bold text-slate-900">
          {mode === "login" ? "Sign in to PixelLift AI" : "Join PixelLift AI"}
        </h1>
        <p className="text-sm text-slate-600">
          {mode === "login"
            ? "Access your dashboard and enhancement history."
            : "Save your history and unlock a higher daily limit."}
        </p>
      </div>

      <form className="mt-8 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400"
            placeholder={mode === "login" ? "Enter your password" : "Create a password"}
            minLength={mode === "login" ? 1 : 8}
            required
          />
        </label>

        <Button className="w-full" size="lg" loading={isLoading} type="submit">
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        Or
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <Button className="w-full" size="lg" variant="secondary" loading={isLoading} onClick={() => void handleOAuth()}>
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-slate-600">
        {mode === "login" ? "Need an account? " : "Already have an account? "}
        <Link className="font-medium text-blue-600 hover:text-blue-700" href={mode === "login" ? "/auth/signup" : "/auth/login"}>
          {mode === "login" ? "Sign up" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
