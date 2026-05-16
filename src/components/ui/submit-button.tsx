"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean; // Can be manually passed or automatically inferred
}

export function SubmitButton({ children, loading, className, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isLoading = loading !== undefined ? loading : pending;

  return (
    <Button type="submit" disabled={isLoading} className={className} {...props}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        children
      )}
    </Button>
  );
}
