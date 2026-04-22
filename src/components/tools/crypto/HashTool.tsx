"use client";

import { useState } from "react";
import { useLocaleContext } from "@/components/LocaleProvider";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha384" | "sha512";

async function hashText(text: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm.replace("sha", "SHA-"), data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

const { t } = useLocaleContext();

export function HashTool() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>("sha256");
  const [hashes, setHashes] = useState<Record<HashAlgorithm, string>>({
    md5: "",
    sha1: "",
    sha256: "",
    sha384: "",
    sha512: "",
  });
  const [copied, setCopied] = useState<string | null>(null);

  const handleInputChange = async (value: string) => {
    setInput(value);
    if (!value) {
      setHashes({ md5: "", sha1: "", sha256: "", sha384: "", sha512: "" });
      return;
    }

    const results: Record<HashAlgorithm, string> = {
      md5: "",
      sha1: "",
      sha256: "",
      sha384: "",
      sha512: "",
    };

    // MD5 需要特殊处理 (Web Crypto 不支持)
    results.md5 = await md5(value);

    // SHA 系列
    results.sha1 = await hashText(value, "sha1");
    results.sha256 = await hashText(value, "sha256");
    results.sha384 = await hashText(value, "sha384");
    results.sha512 = await hashText(value, "sha512");

    setHashes(results);
  };

  const handleCopy = async (hash: string, key: string) => {
    await navigator.clipboard.writeText(hash);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
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
          <h1 className="text-3xl font-bold mb-2">Hash Text</h1>
          <p className="text-muted-foreground">
            Generate hash from text using various algorithms
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter text to hash..."
              className="min-h-[120px] font-mono text-sm"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
            />
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {(["md5", "sha1", "sha256", "sha384", "sha512"] as HashAlgorithm[]).map((algo) => (
            <Card key={algo}>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-medium uppercase">{algo}</span>
                  {algo === algorithm && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                      Selected
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => hashes[algo] && handleCopy(hashes[algo], algo)}
                  disabled={!hashes[algo]}
                >
                  {copied === algo ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                <code className="text-sm font-mono break-all text-muted-foreground">
                  {hashes[algo] || "..."}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-medium mb-2">About Hash Algorithms</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground">MD5</h4>
              <p>128-bit hash. Fast but not secure. Not recommended for passwords.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">SHA-1</h4>
              <p>160-bit hash. Deprecated for security use.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">SHA-256</h4>
              <p>256-bit hash. Recommended for most security applications.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">SHA-384</h4>
              <p>384-bit hash. Part of SHA-2 family, very secure.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground">SHA-512</h4>
              <p>512-bit hash. Highest security in SHA-2 family.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// MD5 implementation for browser
async function md5(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Use a simple MD5 implementation
  const rotateLeft = (x: number, n: number) => (x << n) | (x >>> (32 - n));
  
  const S = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  
  const K = new Uint32Array(64);
  for (let i = 0; i < 64; i++) {
    K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000);
  }
  
  // Pre-processing
  const msgLen = data.length;
  const bitLen = msgLen * 8;
  const paddingLen = (msgLen % 64 < 56 ? 56 : 120) - (msgLen % 64);
  
  const paddedData = new Uint8Array(msgLen + paddingLen + 8);
  paddedData.set(data);
  paddedData[msgLen] = 0x80;
  
  const view = new DataView(paddedData.buffer);
  view.setUint32(paddedData.length - 4, bitLen, true);
  
  // Initialize hash values
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  
  // Process each 64-byte chunk
  for (let i = 0; i < paddedData.length; i += 64) {
    const M = new Uint32Array(16);
    for (let j = 0; j < 16; j++) {
      M[j] = view.getUint32(i + j * 4, true);
    }
    
    let A = a0, B = b0, C = c0, D = d0;
    
    for (let j = 0; j < 64; j++) {
      let F, g;
      if (j < 16) {
        F = (B & C) | (~B & D);
        g = j;
      } else if (j < 32) {
        F = (D & B) | (~D & C);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        F = B ^ C ^ D;
        g = (3 * j + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * j) % 16;
      }
      
      const temp = D;
      D = C;
      C = B;
      B = (B + rotateLeft((A + F + K[j] + M[g]), S[j])) >>> 0;
      A = temp;
    }
    
    a0 = (a0 + A) >>> 0;
    b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0;
    d0 = (d0 + D) >>> 0;
  }
  
  // Convert to little-endian
  const result = new Uint8Array(16);
  new DataView(result.buffer).setUint32(0, a0, true);
  new DataView(result.buffer).setUint32(4, b0, true);
  new DataView(result.buffer).setUint32(8, c0, true);
  new DataView(result.buffer).setUint32(12, d0, true);
  
  return Array.from(result).map(b => b.toString(16).padStart(2, "0")).join("");
}
