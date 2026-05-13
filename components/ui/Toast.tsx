"use client";

import { Toaster, toast } from "react-hot-toast";

export { toast };

export function PixelLiftToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#FFFFFF",
          color: "#0F172A",
          border: "1px solid #E2E8F0",
          borderRadius: "14px",
          boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
        },
        success: {
          iconTheme: {
            primary: "#22C55E",
            secondary: "#FFFFFF",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#FFFFFF",
          },
        },
      }}
    />
  );
}
