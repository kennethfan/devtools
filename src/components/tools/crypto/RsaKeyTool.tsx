"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Download, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type KeySize = 2048 | 4096;

export function RsaKeyTool() {
  const [keySize, setKeySize] = useState<KeySize>(2048);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"public" | "private" | null>(null);

  const generateKeyPair = async () => {
    setLoading(true);
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      // Export public key
      const publicKeyExported = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const publicKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyExported)));
      const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g)?.join("\n")}\n-----END PUBLIC KEY-----`;

      // Export private key
      const privateKeyExported = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      const privateKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(privateKeyExported)));
      const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyBase64.match(/.{1,64}/g)?.join("\n")}\n-----END PRIVATE KEY-----`;

      setPublicKey(publicKeyPem);
      setPrivateKey(privateKeyPem);
    } catch (e) {
      console.error("Key generation failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (type: "public" | "private") => {
    const key = type === "public" ? publicKey : privateKey;
    navigator.clipboard.writeText(key);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (type: "public" | "private") => {
    const key = type === "public" ? publicKey : privateKey;
    const blob = new Blob([key], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = type === "public" ? "public_key.pem" : "private_key.pem";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const blob = new Blob([`${publicKey}\n\n${privateKey}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsa_keypair.pem";
    a.click();
    URL.revokeObjectURL(url);
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
        <h1 className="text-3xl font-bold mb-2">RSA Key Pair Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate RSA public/private key pairs in PEM format
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Key Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Key Size</label>
              <Select
                value={keySize.toString()}
                onValueChange={(v) => setKeySize(parseInt(v) as KeySize)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2048">2048 bits (Recommended)</SelectItem>
                  <SelectItem value="4096">4096 bits (More Secure)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Larger keys are more secure but slower to generate and use.
              </p>
            </div>

            <Button onClick={generateKeyPair} className="w-full" disabled={loading}>
              {loading ? (
                <>Generating...</>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Key Pair
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Public Key</CardTitle>
              {publicKey && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy("public")}>
                    {copied === "public" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload("public")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Textarea
                value={publicKey}
                readOnly
                placeholder="Public key will appear here..."
                className="min-h-[200px] font-mono text-xs"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Private Key</CardTitle>
              {privateKey && (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleCopy("private")}>
                    {copied === "private" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDownload("private")}>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Textarea
                value={privateKey}
                readOnly
                placeholder="Private key will appear here..."
                className="min-h-[200px] font-mono text-xs"
              />
              <p className="text-xs text-destructive mt-2">
                Keep your private key secret!
              </p>
            </CardContent>
          </Card>
        </div>

        {publicKey && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-2" />
              Download Both Keys
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
