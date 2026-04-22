"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BcryptTool() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [rounds, setRounds] = useState(10);
  const [mode, setMode] = useState<"hash" | "verify">("hash");
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHash = async () => {
    if (!input) return;
    setLoading(true);
    
    try {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.genSalt(rounds);
      const hashed = await bcrypt.hash(input, salt);
      setHash(hashed);
      setResult(null);
    } catch (e) {
      setResult({ success: false, message: "Failed to hash password" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!input || !hash) return;
    setLoading(true);
    
    try {
      const bcrypt = await import("bcryptjs");
      const isMatch = await bcrypt.compare(input, hash);
      setResult({
        success: isMatch,
        message: isMatch ? "Password matches! ✓" : "Password does not match! ✗"
      });
    } catch (e) {
      setResult({ success: false, message: "Invalid hash format" });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setMode((m) => (m === "hash" ? "verify" : "hash"));
    setInput("");
    setHash("");
    setResult(null);
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
        <h1 className="text-3xl font-bold mb-2">Bcrypt Hash / Verify</h1>
        <p className="text-muted-foreground mb-6">
          Hash passwords or verify against bcrypt hashes
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={mode === "hash" ? "default" : "outline"}
              onClick={() => setMode("hash")}
            >
              Hash Password
            </Button>
            <Button
              variant={mode === "verify" ? "default" : "outline"}
              onClick={() => setMode("verify")}
            >
              Verify Password
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleSwap}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>

        {mode === "hash" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Cost Rounds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="range"
                  min={4}
                  max={14}
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="w-12 text-center font-mono">{rounds}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher rounds = more secure but slower. 10 is recommended.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {mode === "hash" ? "Password" : "Password to Verify"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="password"
                placeholder="Enter password..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button onClick={mode === "hash" ? handleHash : handleVerify} className="w-full" disabled={loading}>
                {loading ? "Processing..." : mode === "hash" ? "Generate Hash" : "Verify"}
              </Button>
            </CardContent>
          </Card>

          {mode === "hash" && hash && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Generated Hash</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={hash}
                  readOnly
                  className="font-mono text-sm min-h-[80px]"
                />
              </CardContent>
            </Card>
          )}

          {mode === "verify" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hash to Verify Against</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste bcrypt hash here..."
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="font-mono text-sm min-h-[80px]"
                />
              </CardContent>
            </Card>
          )}

          {result && (
            <Card className={result.success ? "border-green-500" : "border-red-500"}>
              <CardContent className="py-4">
                <p className={`text-center font-medium ${result.success ? "text-green-500" : "text-red-500"}`}>
                  {result.message}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
