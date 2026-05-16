"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileIcon, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ExpenseReceiptModalProps {
  url: string | null;
}

export function ExpenseReceiptModal({ url }: ExpenseReceiptModalProps) {
  if (!url) return <span className="text-muted-foreground text-xs">No receipt</span>;

  const isPdf = url.endsWith(".pdf");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          {isPdf ? <FileIcon className="mr-2 h-3 w-3" /> : <ExternalLink className="mr-2 h-3 w-3" />}
          View Receipt
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-card/95 backdrop-blur-xl border-border">
        {isPdf ? (
          <div className="w-full h-[80vh] rounded-md overflow-hidden bg-white">
            <iframe src={url} className="w-full h-full" title="Receipt PDF" />
          </div>
        ) : (
          <div className="relative w-full h-[80vh] rounded-md overflow-hidden bg-black/50">
            <Image src={url} alt="Expense Receipt" fill className="object-contain" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
