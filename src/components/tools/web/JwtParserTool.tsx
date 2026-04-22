"use client";

import { useState } from "react";
import { useLocaleContext } from "@/components/LocaleProvider";
import { ArrowLeft, Copy, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JWTPart {
  header: Record<string, unknown>;
  payload: Record<string, string | number | boolean | null | unknown>;
  signature: string;
  raw: { header: string; payload: string; signature: string };
}

function decodeJWT(token: string): JWTPart | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decodeBase64Url = (str: string): string => {
      const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
      return decodeURIComponent(
        atob(padded)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
    };

    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const signature = parts[2];

    return {
      header,
      payload,
      signature,
      raw: {
        header: parts[0],
        payload: parts[1],
        signature: parts[2],
      },
    };
  } catch {
    return null;
  }
}

function formatTimestamp(ts: number | string): string {
  if (typeof ts === "string") ts = parseInt(ts);
  if (isNaN(ts)) return "Invalid";
  const date = new Date(ts * 1000);
  return date.toLocaleString();
}

function isExpired(exp: number | string): boolean {
  if (typeof exp === "string") exp = parseInt(exp);
  if (isNaN(exp)) return false;
  return Date.now() > exp * 1000;
}

export function JwtParserTool() {
  const { t } = useLocaleContext();
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<JWTPart | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (value: string) => {
    setInput(value.trim());
    if (!value.trim()) {
      setParsed(null);
      setError("");
      return;
    }

    const result = decodeJWT(value.trim());
    if (result) {
      setParsed(result);
      setError("");
    } else {
      setParsed(null);
      setError("Invalid JWT format. Expected: header.payload.signature");
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
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
            <span>{t("common.back")} to tools</span>
          </Link>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">JWT Parser</h1>
          <p className="text-muted-foreground">
            Decode and inspect JSON Web Tokens (JWT)
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">JWT Token</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...)"
              className="min-h-[100px] font-mono text-sm"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
            />
            {error && (
              <div className="flex items-center gap-2 text-destructive mt-2 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {parsed && (
          <div className="space-y-4">
            {/* Header */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-sm font-medium">Header</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(parsed.header, null, 2))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                  {JSON.stringify(parsed.header, null, 2)}
                </pre>
                <p className="text-xs text-muted-foreground mt-2">
                  Algorithm: <code className="bg-muted px-1 rounded">{String(parsed.header.alg)}</code>
                </p>
              </CardContent>
            </Card>

            {/* Payload */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-sm font-medium">Payload</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(JSON.stringify(parsed.payload, null, 2))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <pre className="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto">
                  {JSON.stringify(parsed.payload, null, 2)}
                </pre>

                {/* Claims Info */}
                <div className="mt-4 space-y-2">
                  {Boolean(parsed.payload.exp) && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expires:</span>
                      <div className="flex items-center gap-2">
                        <code className="bg-muted px-1 rounded">{formatTimestamp(parsed.payload.exp as number)}</code>
                        {isExpired(parsed.payload.exp as number) && (
                          <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {Boolean(parsed.payload.iat) && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Issued:</span>
                      <code className="bg-muted px-1 rounded">{formatTimestamp(parsed.payload.iat as number)}</code>
                    </div>
                  )}
                  {Boolean(parsed.payload.nbf) && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Not Before:</span>
                      <code className="bg-muted px-1 rounded">{formatTimestamp(parsed.payload.nbf as number)}</code>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Signature */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-sm font-medium">Signature</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(parsed.signature)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <code className="text-sm font-mono break-all text-muted-foreground">
                  {parsed.signature}
                </code>
                <p className="text-xs text-muted-foreground mt-2">
                  Signature verification requires the secret key.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">JWT Structure</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-foreground">Header</h4>
              <p className="text-muted-foreground">Contains metadata about the token (algorithm, type)</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Payload</h4>
              <p className="text-muted-foreground">Contains claims (user data, expiration, etc.)</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">Signature</h4>
              <p className="text-muted-foreground">Verifies token authenticity</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
