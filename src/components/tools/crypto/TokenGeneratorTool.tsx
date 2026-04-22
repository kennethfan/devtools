"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type TokenType = "hex" | "base64" | "numeric" | "alphanumeric" | "uuid";

export function TokenGeneratorTool() {
  const [length, setLength] = useState(32);
  const [tokenType, setTokenType] = useState<TokenType>("hex");
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState(1);
  const [tokens, setTokens] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [showTokens, setShowTokens] = useState(true);

  const generateToken = (type: TokenType, len: number): string => {
    const chars = {
      hex: "0123456789abcdef",
      base64: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      numeric: "0123456789",
      alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      uuid: "", // Special handling
    };

    if (type === "uuid") {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    const charset = chars[type];
    let result = "";
    const randomValues = new Uint32Array(len);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < len; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    return result;
  };

  const handleGenerate = () => {
    const newTokens: string[] = [];
    for (let i = 0; i < count; i++) {
      const token = generateToken(tokenType, length);
      newTokens.push(prefix ? `${prefix}${token}` : token);
    }
    setTokens(newTokens);
  };

  const handleCopy = (token: string, index: number) => {
    navigator.clipboard.writeText(token);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tokens.join("\n"));
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
  };

  const maskedToken = (token: string): string => {
    if (!showTokens) return "•".repeat(token.length);
    return token;
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Token Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate cryptographically secure random tokens
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm mb-2 block">Token Type</label>
                <Select value={tokenType} onValueChange={(v) => setTokenType(v as TokenType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex">Hexadecimal</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="numeric">Numeric</SelectItem>
                    <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                    <SelectItem value="uuid">UUID v4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Length</label>
                <Input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={128}
                />
              </div>

              <div>
                <label className="text-sm mb-2 block">Count</label>
                <Input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min={1}
                  max={100}
                />
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">Prefix (optional)</label>
              <Input
                placeholder="e.g., sk_live_, tok_"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
              />
            </div>

            <Button onClick={handleGenerate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate Tokens
            </Button>
          </CardContent>
        </Card>

        {tokens.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Generated {tokens.length} token{tokens.length > 1 ? "s" : ""}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTokens(!showTokens)}
                >
                  {showTokens ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={copyAll}>
                  {copied === -1 ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  Copy All
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {tokens.map((token, i) => (
                <Card key={i}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <code className="text-sm font-mono break-all">{maskedToken(token)}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(token, i)}
                    >
                      {copied === i ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
