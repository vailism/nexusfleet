"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { FileIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  endpoint: "receiptUploader" | "documentUploader";
  value: string;
  onChange: (url?: string) => void;
}

export function FileUpload({ endpoint, value, onChange }: FileUploadProps) {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-40 w-full sm:w-64 rounded-xl overflow-hidden border border-border">
        <Image src={value} alt="Upload preview" fill className="object-cover" />
        <button
          onClick={() => onChange("")}
          className="bg-red-500 text-white p-1 rounded-full absolute top-2 right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && fileType === "pdf") {
    return (
      <div className="relative flex items-center p-4 mt-2 rounded-lg bg-background border border-border">
        <FileIcon className="h-10 w-10 text-indigo-500 mr-4" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-500 hover:underline"
        >
          View PDF Document
        </a>
        <button
          onClick={() => onChange("")}
          className="bg-red-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
        toast.success("File uploaded successfully.");
      }}
      onUploadError={(error: Error) => {
        toast.error(`ERROR! ${error.message}`);
      }}
      className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:ut-readying:bg-primary/50 border-dashed border-2 border-border bg-card/50 hover:bg-card/80 transition-colors rounded-xl"
    />
  );
}
