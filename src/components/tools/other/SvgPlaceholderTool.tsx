"use client";

import { useState } from "react";
import { ArrowLeft, Download, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SvgPlaceholderTool() {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(150);
  const [bgColor, setBgColor] = useState("e0e0e0");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("999999");
  const [copied, setCopied] = useState<string | boolean>(false);

  const getSvg = () => {
    const displayText = text || `${width}×${height}`;
    return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#${bgColor}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">${displayText}</text>
</svg>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getSvg());
    setCopied(true);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleDownload = () => {
    const svg = getSvg();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `placeholder-${width}x${height}.svg`;
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">SVG Placeholder</h1>
        <p className="text-muted-foreground mb-6">
          Generate SVG placeholder images
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Width</label>
                <Input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 300)}
                  min={1}
                  max={2000}
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Height</label>
                <Input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 150)}
                  min={1}
                  max={2000}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Background Color</label>
                <Input
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  placeholder="e0e0e0"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Text Color</label>
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="999999"
                />
              </div>
            </div>
            <div>
              <label className="text-sm mb-2 block">Custom Text (optional)</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Leave empty for dimensions"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Preview</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div dangerouslySetInnerHTML={{ __html: getSvg() }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}