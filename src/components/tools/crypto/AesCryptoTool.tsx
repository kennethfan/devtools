"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CipherMode = "encrypt" | "decrypt";

export function AesCryptoTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [key, setKey] = useState("");
  const [iv, setIv] = useState("");
  const [mode, setMode] = useState<CipherMode>("encrypt");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleProcess = async () => {
    if (!input || !key) {
      setError("Please enter both text and key");
      return;
    }

    try {
      const CryptoJS = (await import("crypto-js")).default;

      if (mode === "encrypt") {
        const encrypted = CryptoJS.AES.encrypt(input, CryptoJS.enc.Utf8.parse(key), {
          iv: iv ? CryptoJS.enc.Utf8.parse(iv) : undefined,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        setOutput(encrypted.toString());
      } else {
        const decrypted = CryptoJS.AES.decrypt(input, CryptoJS.enc.Utf8.parse(key), {
          iv: iv ? CryptoJS.enc.Utf8.parse(iv) : undefined,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });
        const result = decrypted.toString(CryptoJS.enc.Utf8);
        if (!result) {
          setError("Decryption failed. Invalid key or ciphertext.");
          setOutput("");
          return;
        }
        setOutput(result);
      }
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Operation failed");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setMode((m) => (m === "encrypt" ? "decrypt" : "encrypt"));
    setInput(output);
    setOutput("");
    setError("");
  };

  const generateKey = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    setKey(Array.from(array).map((b) => ("0" + b.toString(16)).slice(-2)).join(""));
  };

  const generateIv = () => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    setIv(Array.from(array).map((b) => ("0" + b.toString(16)).slice(-2)).join(""));
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
        <h1 className="text-3xl font-bold mb-2">AES Encryption / Decryption</h1>
        <p className="text-muted-foreground mb-6">
          Encrypt or decrypt text using AES-128-CBC
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={mode === "encrypt" ? "default" : "outline"}
              onClick={() => setMode("encrypt")}
            >
              Encrypt
            </Button>
            <Button
              variant={mode === "decrypt" ? "default" : "outline"}
              onClick={() => setMode("decrypt")}
            >
              Decrypt
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleSwap} disabled={!output}>
            <ArrowRightLeft className="h-4 w-4 mr-1" />
            Swap
          </Button>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key & IV</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm">Key (16 bytes hex)</label>
                  <Button variant="ghost" size="sm" onClick={generateKey}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
                <Input
                  placeholder="Enter 32 character hex key..."
                  value={key}
                  onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^0-9a-f]/g, ""))}
                  className="font-mono"
                  maxLength={32}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm">IV (16 bytes hex, optional)</label>
                  <Button variant="ghost" size="sm" onClick={generateIv}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Generate
                  </Button>
                </div>
                <Input
                  placeholder="Enter 32 character hex IV..."
                  value={iv}
                  onChange={(e) => setIv(e.target.value.toLowerCase().replace(/[^0-9a-f]/g, ""))}
                  className="font-mono"
                  maxLength={32}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {mode === "encrypt" ? "Plain Text" : "Cipher Text"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={mode === "encrypt" ? "Enter text to encrypt..." : "Enter cipher text..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] font-mono"
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
              <Button onClick={handleProcess} className="w-full">
                {mode === "encrypt" ? "Encrypt" : "Decrypt"}
              </Button>
            </CardContent>
          </Card>

          {output && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  {mode === "encrypt" ? "Cipher Text" : "Plain Text"}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[120px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
