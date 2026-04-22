"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  isBot: boolean;
  isMobile: boolean;
  isDesktop: boolean;
}

// Simple user agent parser (client-side)
const parseUserAgent = (ua: string): ParsedUA => {
  const result: ParsedUA = {
    browser: { name: "Unknown", version: "Unknown" },
    os: { name: "Unknown", version: "Unknown" },
    device: { type: "Desktop", vendor: "Unknown", model: "Unknown" },
    isBot: false,
    isMobile: false,
    isDesktop: true,
  };

  const lowerUA = ua.toLowerCase();

  // Detect Bot
  if (/bot|crawler|spider|googlebot|bingbot|yandex|duckduckbot/i.test(ua)) {
    result.isBot = true;
  }

  // Detect Mobile
  if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(ua)) {
    result.isMobile = true;
    result.isDesktop = false;
    result.device.type = "Mobile";
  }

  // Detect Tablet
  if (/ipad|tablet|playbook|nexus 7/i.test(ua)) {
    result.device.type = "Tablet";
    result.isMobile = false;
  }

  // Browser detection
  if (/chrome\/(\d+)/i.test(ua) && !/edge|edg|opr/i.test(ua)) {
    result.browser.name = "Chrome";
    result.browser.version = ua.match(/chrome\/(\d+)/i)?.[1] || "Unknown";
  } else if (/firefox\/(\d+)/i.test(ua)) {
    result.browser.name = "Firefox";
    result.browser.version = ua.match(/firefox\/(\d+)/i)?.[1] || "Unknown";
  } else if (/safari\/(\d+)/i.test(ua) && !/chrome|chromium/i.test(ua)) {
    result.browser.name = "Safari";
    result.browser.version = ua.match(/version\/(\d+)/i)?.[1] || "Unknown";
  } else if (/edge\/(\d+)/i.test(ua) || /edg\/(\d+)/i.test(ua)) {
    result.browser.name = "Edge";
    result.browser.version = ua.match(/edg(e)?\/(\d+)/i)?.[2] || "Unknown";
  } else if (/opera|opr\/(\d+)/i.test(ua)) {
    result.browser.name = "Opera";
    result.browser.version = ua.match(/opr\/(\d+)/i)?.[1] || "Unknown";
  }

  // OS detection
  if (/windows nt 10/i.test(ua)) {
    result.os.name = "Windows";
    result.os.version = "10/11";
  } else if (/windows phone (\d+)/i.test(ua)) {
    result.os.name = "Windows Phone";
    result.os.version = ua.match(/windows phone (\d+)/i)?.[1] || "Unknown";
  } else if (/mac os x (\d+[._]\d+)/i.test(ua)) {
    result.os.name = "macOS";
    result.os.version = ua.match(/mac os x (\d+[._]\d+)/i)?.[1]?.replace(/_/g, ".") || "Unknown";
  } else if (/iphone os (\d+)/i.test(ua)) {
    result.os.name = "iOS";
    result.os.version = ua.match(/iphone os (\d+)/i)?.[1] || "Unknown";
  } else if (/ipad.*os (\d+)/i.test(ua)) {
    result.os.name = "iPadOS";
    result.os.version = ua.match(/ipad.*os (\d+)/i)?.[1] || "Unknown";
  } else if (/android (\d+)/i.test(ua)) {
    result.os.name = "Android";
    result.os.version = ua.match(/android (\d+)/i)?.[1] || "Unknown";
  } else if (/linux/i.test(ua)) {
    result.os.name = "Linux";
  }

  // Device vendor/model
  if (/samsung/i.test(ua)) {
    result.device.vendor = "Samsung";
    if (/sm-g\d/i.test(ua)) result.device.model = "Galaxy";
    else if (/sm-n\d/i.test(ua)) result.device.model = "Galaxy Note";
  } else if (/iphone/i.test(ua)) {
    result.device.vendor = "Apple";
    result.device.model = "iPhone";
  } else if (/ipad/i.test(ua)) {
    result.device.vendor = "Apple";
    result.device.model = "iPad";
  }

  return result;
};

export function UserAgentParserTool() {
  const [input, setInput] = useState("");
  const [parsed, setParsed] = useState<ParsedUA | null>(null);

  const handleParse = () => {
    if (!input.trim()) return;
    setParsed(parseUserAgent(input));
  };

  const handleDetectCurrent = () => {
    setInput(navigator.userAgent);
    setParsed(parseUserAgent(navigator.userAgent));
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
        <h1 className="text-3xl font-bold mb-2">User Agent Parser</h1>
        <p className="text-muted-foreground mb-6">
          Parse user agent string to identify browser, OS, and device
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">User Agent String</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter user agent string..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleParse} className="flex-1">
                Parse
              </Button>
              <Button variant="outline" onClick={handleDetectCurrent}>
                Use Current Browser
              </Button>
            </div>
          </CardContent>
        </Card>

        {parsed && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browser</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">{parsed.browser.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Version</div>
                    <div className="font-medium">{parsed.browser.version}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operating System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Name</div>
                    <div className="font-medium">{parsed.os.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Version</div>
                    <div className="font-medium">{parsed.os.version}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Type</div>
                    <div className="font-medium">{parsed.device.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Vendor</div>
                    <div className="font-medium">{parsed.device.vendor}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Model</div>
                    <div className="font-medium">{parsed.device.model}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      parsed.isBot ? "bg-yellow-500/20 text-yellow-600" : "bg-green-500/20 text-green-600"
                    }`}
                  >
                    {parsed.isBot ? "🤖 Bot" : "👤 Human"}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-lg ${
                      parsed.isMobile ? "bg-blue-500/20 text-blue-600" : "bg-gray-500/20 text-gray-600"
                    }`}
                  >
                    {parsed.isMobile ? "📱 Mobile" : "💻 Desktop"}
                  </div>
                  {parsed.isDesktop && (
                    <div className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-600">
                      🖥️ Desktop
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
