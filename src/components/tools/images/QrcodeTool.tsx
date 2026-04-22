"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function QrcodeTool() {
  const [content, setContent] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!content) {
      setQrCodeUrl("");
      return;
    }

    // Generate QR code using Canvas API
    const generateQRCode = async () => {
      try {
        // Simple QR code generation using canvas
        const QRCode = await import("qrcode");
        const url = await QRCode.toDataURL(content, {
          width: size,
          margin: 2,
          color: {
            dark: fgColor,
            light: bgColor,
          },
        });
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    };

    generateQRCode();
  }, [content, size, bgColor, fgColor]);

  const handleCopyImage = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy image:", error);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrCodeUrl;
    link.click();
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
          <h1 className="text-3xl font-bold mb-2">QR Code Generator</h1>
          <p className="text-muted-foreground">
            Generate QR codes for URLs, text, or any content
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter URL or text to encode..."
                  className="min-h-[120px] font-mono text-sm"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Size</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value={128}>128 x 128</option>
                      <option value={256}>256 x 256</option>
                      <option value={512}>512 x 512</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Background</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-9 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Foreground</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-10 h-9 rounded border cursor-pointer"
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col items-center justify-center">
            <Card className="w-full">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <CardTitle className="text-sm font-medium">Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setContent("")}
                    disabled={!content}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyImage}
                    disabled={!qrCodeUrl}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDownload}
                    disabled={!qrCodeUrl}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-6">
                {qrCodeUrl ? (
                  <div
                    className="rounded-lg overflow-hidden"
                    style={{ backgroundColor: bgColor }}
                  >
                    <img src={qrCodeUrl} alt="QR Code" className="block" />
                  </div>
                ) : (
                  <div className="w-[256px] h-[256px] flex items-center justify-center bg-muted rounded-lg">
                    <p className="text-muted-foreground text-sm">
                      Enter content to generate QR code
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {content && (
              <p className="text-sm text-muted-foreground mt-4 text-center max-w-xs">
                {content.length > 100 ? content.slice(0, 100) + "..." : content}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
