"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
    </div>
  );
}
