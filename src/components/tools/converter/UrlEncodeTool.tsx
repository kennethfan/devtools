"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UrlEncodeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleEncode = () => {
    setError("");
    try {
      setOutput(encodeURIComponent(input));
    } catch (e) {
      setError("Failed to encode");
      setOutput("");
    }
  };

  const handleDecode = () => {
    setError("");
    try {
      setOutput(decodeURIComponent(input));
    } catch (e) {
      setError("Invalid URL encoded string");
      setOutput("");
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput(output);
    setOutput("");
    setError("");
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
          <h1 className="text-3xl font-bold mb-2">URL Encode/Decode</h1>
          <p className="text-muted-foreground">
            Encode and decode URL strings (percent-encoded)
          </p>
        </div>

        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
          <TabsList className="mb-4">
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>

          <TabsContent value={mode}>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {mode === "encode" ? "Plain Text" : "URL Encoded"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleSwap}>
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={mode === "encode" ? "Enter text to encode..." : "Enter URL encoded string..."}
                    className="min-h-[300px] font-mono text-sm"
                    value={input}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                  {error && (
                    <p className="text-sm text-destructive mt-2">{error}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {mode === "encode" ? "URL Encoded" : "Decoded Text"}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={mode === "encode" ? handleEncode : handleDecode}>
                      {mode === "encode" ? "Encode" : "Decode"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Output will appear here..."
                    className="min-h-[300px] font-mono text-sm"
                    value={output}
                    readOnly
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
