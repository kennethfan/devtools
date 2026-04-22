"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type HashAlgorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "MD5";

const hashAlgorithms: HashAlgorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512", "MD5"];

export function HmacTool() {
  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("SHA-256");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!message || !secret) {
      setError("Please enter both message and secret key");
      return;
    }

    try {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: algorithm },
        false,
        ["sign"]
      );

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(message)
      );

      // Convert to hex
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map((b) => ("0" + b.toString(16)).slice(-2)).join("");
      setOutput(hashHex);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate HMAC");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
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
        <h1 className="text-3xl font-bold mb-2">HMAC Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate Hash-based Message Authentication Codes
        </p>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Hash Algorithm</label>
                <Select value={algorithm} onValueChange={(v) => setAlgorithm(v as HashAlgorithm)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hashAlgorithms.map((algo) => (
                      <SelectItem key={algo} value={algo}>
                        {algo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Secret Key</label>
                <Input
                  type="password"
                  placeholder="Enter secret key..."
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Message</label>
                <Textarea
                  placeholder="Enter message to authenticate..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] font-mono"
                />
              </div>

              {error && <p className="text-destructive text-sm">{error}</p>}

              <Button onClick={handleGenerate} className="w-full">
                Generate HMAC
              </Button>
            </CardContent>
          </Card>

          {output && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">HMAC Output</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  className="font-mono text-sm min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Output length: {output.length} characters ({output.length * 4} bits)
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
