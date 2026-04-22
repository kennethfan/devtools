"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ColorFormats {
  hex: string;
  rgb: string;
  hsl: string;
  hslRaw: { h: number; s: number; l: number };
  rgba: string;
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
};

export function ColorFormatTool() {
  const [input, setInput] = useState("#3b82f6");
  const [formats, setFormats] = useState<ColorFormats | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [alpha, setAlpha] = useState(100);

  const parseColor = (colorStr: string): { r: number; g: number; b: number; a: number } | null => {
    const trimmed = colorStr.trim().toLowerCase();

    // HEX
    const hexMatch = trimmed.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i);
    if (hexMatch) {
      return {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16),
        a: hexMatch[4] ? parseInt(hexMatch[4], 16) / 255 : 1,
      };
    }
    const hexShortMatch = trimmed.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
    if (hexShortMatch) {
      return {
        r: parseInt(hexShortMatch[1] + hexShortMatch[1], 16),
        g: parseInt(hexShortMatch[2] + hexShortMatch[2], 16),
        b: parseInt(hexShortMatch[3] + hexShortMatch[3], 16),
        a: 1,
      };
    }

    // RGB
    const rgbMatch = trimmed.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3]),
        a: 1,
      };
    }

    // RGBA
    const rgbaMatch = trimmed.match(/rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/);
    if (rgbaMatch) {
      return {
        r: parseInt(rgbaMatch[1]),
        g: parseInt(rgbaMatch[2]),
        b: parseInt(rgbaMatch[3]),
        a: parseFloat(rgbaMatch[4]),
      };
    }

    // HSL
    const hslMatch = trimmed.match(/hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
    if (hslMatch) {
      const rgb = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
      return { ...rgb, a: 1 };
    }

    // HSLA
    const hslaMatch = trimmed.match(/hsla\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*,\s*([\d.]+)\s*\)/);
    if (hslaMatch) {
      const rgb = hslToRgb(parseInt(hslaMatch[1]), parseInt(hslaMatch[2]), parseInt(hslaMatch[3]));
      return { ...rgb, a: parseFloat(hslaMatch[4]) };
    }

    return null;
  };

  const convertColor = () => {
    const parsed = parseColor(input);
    if (parsed) {
      const { r, g, b } = parsed;
      const hsl = rgbToHsl(r, g, b);
      setFormats({
        hex: rgbToHex(r, g, b).toUpperCase(),
        rgb: `rgb(${r}, ${g}, ${b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        hslRaw: hsl,
        rgba: `rgba(${r}, ${g}, ${b}, ${alpha / 100})`,
      });
      setError("");
    } else {
      setError("Invalid color format");
      setFormats(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const ColorDisplay = ({ format }: { format: ColorFormats }) => (
    <div className="flex items-center gap-4">
      <div
        className="w-20 h-20 rounded-lg border shadow-inner"
        style={{ backgroundColor: format.hex }}
      />
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          <span className="text-muted-foreground">HEX:</span>{" "}
          <code className="bg-muted px-1 rounded">{format.hex}</code>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">RGB:</span>{" "}
          <code className="bg-muted px-1 rounded">{format.rgb}</code>
        </p>
        <p className="text-sm">
          <span className="text-muted-foreground">HSL:</span>{" "}
          <code className="bg-muted px-1 rounded">{format.hsl}</code>
        </p>
      </div>
    </div>
  );

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
        <h1 className="text-3xl font-bold mb-2">Color Format Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between HEX, RGB, and HSL color formats
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input Color</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="#3b82f6, rgb(59, 130, 246), hsl(217, 90%, 61%)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-sm"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <div className="flex items-center gap-4">
              <label className="text-sm">Alpha:</label>
              <input
                type="range"
                min={0}
                max={100}
                value={alpha}
                onChange={(e) => setAlpha(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm w-12">{alpha}%</span>
            </div>
            <Button onClick={convertColor} className="w-full">
              Convert
            </Button>
          </CardContent>
        </Card>

        {formats && (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <ColorDisplay format={formats} />
              </CardContent>
            </Card>

            <div className="grid gap-3">
              {[
                { label: "HEX", value: formats.hex, key: "hex" },
                { label: "RGB", value: formats.rgb, key: "rgb" },
                { label: "HSL", value: formats.hsl, key: "hsl" },
                { label: "RGBA", value: formats.rgba, key: "rgba" },
                { label: "CSS var", value: `--color-primary: ${formats.hex};`, key: "css" },
              ].map(({ label, value, key }) => (
                <Card key={key}>
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <span className="text-sm font-medium">{label}: </span>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{value}</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(value, key)}
                    >
                      {copied === key ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
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
