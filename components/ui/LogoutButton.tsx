"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      toast.success("Logged out successfully.");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("[logout] error:", error);
      toast.error("Unable to log out right now.");
    }
  }

  return (
    <Button variant="secondary" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  );
}
