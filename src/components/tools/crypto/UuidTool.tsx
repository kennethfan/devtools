"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateULID(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const TIME_LEN = 10;
  const RANDOM_LEN = 16;
  
  let str = '';
  let time = Date.now();
  
  // Encode time
  for (let i = TIME_LEN; i > 0; i--) {
    str = ENCODING[time % 32] + str;
    time = Math.floor(time / 32);
  }
  
  // Encode random
  for (let i = 0; i < RANDOM_LEN; i++) {
    str += ENCODING[Math.floor(Math.random() * 32)];
  }
  
  return str;
}

export function UuidTool() {
  const [uuid, setUuid] = useState(generateUUID());
  const [ulid, setUlid] = useState(generateULID());
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedUlid, setCopiedUlid] = useState(false);

  const handleRefresh = () => {
    setUuid(generateUUID());
    setUlid(generateULID());
  };

  const handleCopyUuid = async () => {
    await navigator.clipboard.writeText(uuid);
    setCopiedUuid(true);
    setTimeout(() => setCopiedUuid(false), 2000);
  };

  const handleCopyUlid = async () => {
    await navigator.clipboard.writeText(ulid);
    setCopiedUlid(true);
    setTimeout(() => setCopiedUlid(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to tools</span>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">UUID & ULID Generator</h1>
          <p className="text-muted-foreground">
            Generate random UUIDs and ULIDs
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">UUID v4</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopyUuid}>
                  {copiedUuid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <code className="text-lg font-mono break-all">{uuid}</code>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                128-bit universally unique identifier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ULID</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCopyUlid}>
                  {copiedUlid ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg">
                <code className="text-lg font-mono break-all">{ulid}</code>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Lexicographically sortable, time-based identifier
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">About</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium">UUID</h4>
              <p className="text-muted-foreground">
                Format: 8-4-4-4-12 characters. Random-based, no central authority needed.
              </p>
            </div>
            <div>
              <h4 className="font-medium">ULID</h4>
              <p className="text-muted-foreground">
                Format: 26 characters (Crockford's Base32). Timestamp + randomness, sortable by creation time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
