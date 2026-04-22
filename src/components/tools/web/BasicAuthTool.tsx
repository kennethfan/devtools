"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function BasicAuthTool() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState<{ username: string; password: string } | null>(null);
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleEncode = () => {
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    const credentials = btoa(`${username}:${password}`);
    setEncoded(`Basic ${credentials}`);
    setError("");
  };

  const handleDecode = () => {
    if (!encoded.trim()) {
      setError("Please enter the Basic Auth string");
      return;
    }

    try {
      const parts = encoded.trim().split(" ");
      if (parts.length !== 2 || parts[0] !== "Basic") {
        throw new Error("Invalid Basic Auth format");
      }
      const decodedStr = atob(parts[1]);
      const [user, pass] = decodedStr.split(":");
      setDecoded({ username: user, password: pass });
      setError("");
    } catch (e) {
      setError("Invalid Basic Auth string");
      setDecoded(null);
    }
  };

  const handleSwap = () => {
    setMode((m) => (m === "encode" ? "decode" : "encode"));
    setEncoded("");
    setDecoded(null);
    setError("");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Basic Auth Encoder/Decoder</h1>
        <p className="text-muted-foreground mb-6">
          Encode or decode Basic Authentication header
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={mode === "encode" ? "default" : "outline"}
              onClick={() => setMode("encode")}
            >
              Encode
            </Button>
            <Button
              variant={mode === "decode" ? "default" : "outline"}
              onClick={() => setMode("decode")}
            >
              Decode
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleSwap}>
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>

        {mode === "encode" ? (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm mb-2 block">Username</label>
                  <Input
                    placeholder="Enter username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Password</label>
                  <Input
                    type="password"
                    placeholder="Enter password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button onClick={handleEncode} className="w-full">
                  Encode to Basic Auth
                </Button>
              </CardContent>
            </Card>

            {encoded && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Basic Auth String</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(encoded)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <code className="block bg-muted p-3 rounded text-sm break-all">
                    {encoded}
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Use in Authorization header: Authorization: {encoded}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Auth String</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Basic dXNlcm5hbWU6cGFzc3dvcmQ="
                  value={encoded}
                  onChange={(e) => setEncoded(e.target.value)}
                  className="font-mono"
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button onClick={handleDecode} className="w-full">
                  Decode Credentials
                </Button>
              </CardContent>
            </Card>

            {decoded && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Decoded Credentials</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Username</div>
                    <div className="font-mono bg-muted p-2 rounded">{decoded.username}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Password</div>
                    <div className="font-mono bg-muted p-2 rounded">{decoded.password}</div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
