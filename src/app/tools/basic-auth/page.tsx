import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BasicAuthTool } from "@/components/tools/web/BasicAuthTool";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>
        </div>
      </header>
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-2">Basic Auth Generator</h1>
        <div className="mt-8">
          <BasicAuthTool />
        </div>
      </main>
    </div>
  );
}
