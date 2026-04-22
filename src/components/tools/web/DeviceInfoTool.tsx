"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DeviceInfo {
  platform: string;
  vendor: string;
  model: string;
  browser: string;
  browserVersion: string;
  language: string;
  languages: string[];
  screenWidth: number;
  screenHeight: number;
  colorDepth: string;
  pixelRatio: number;
  windowWidth: number;
  windowHeight: number;
  online: boolean;
  cookieEnabled: boolean;
  doNotTrack: string | null;
  timezone: string;
  timezoneOffset: number;
  connection: string;
  cores: number;
  memory: string;
  touchPoints: number;
  maxTouchPoints: number;
}

const getBrowserInfo = (): { name: string; version: string } => {
  const ua = navigator.userAgent;
  if (/chrome\/(\d+)/i.test(ua) && !/edge|edg|opr/i.test(ua)) {
    return { name: "Chrome", version: ua.match(/chrome\/(\d+)/i)?.[1] || "" };
  }
  if (/firefox\/(\d+)/i.test(ua)) {
    return { name: "Firefox", version: ua.match(/firefox\/(\d+)/i)?.[1] || "" };
  }
  if (/safari\/(\d+)/i.test(ua) && !/chrome|chromium/i.test(ua)) {
    return { name: "Safari", version: ua.match(/version\/(\d+)/i)?.[1] || "" };
  }
  if (/edge\/(\d+)/i.test(ua) || /edg\/(\d+)/i.test(ua)) {
    return { name: "Edge", version: ua.match(/edg(e)?\/(\d+)/i)?.[2] || "" };
  }
  return { name: "Unknown", version: "" };
};

export function DeviceInfoTool() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const browser = getBrowserInfo();
    const nav = navigator;

    const connection = (nav as any).connection 
      ? (nav as any).connection.effectiveType 
      : "Unknown";

    setInfo({
      platform: nav.platform,
      vendor: nav.vendor || "Unknown",
      model: "Unknown",
      browser: browser.name,
      browserVersion: browser.version,
      language: nav.language,
      languages: nav.languages ? Array.from(nav.languages) : [nav.language],
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      colorDepth: `${window.screen.colorDepth}-bit`,
      pixelRatio: window.devicePixelRatio,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      online: nav.onLine,
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      connection,
      cores: (nav as any).hardwareConcurrency || "Unknown",
      memory: (nav as any).deviceMemory ? `${(nav as any).deviceMemory} GB` : "Unknown",
      touchPoints: nav.maxTouchPoints,
      maxTouchPoints: nav.maxTouchPoints,
    });
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const categories = info
    ? [
        {
          title: "Device",
          items: [
            { label: "Platform", value: info.platform },
            { label: "Vendor", value: info.vendor },
            { label: "Model", value: info.model },
          ],
        },
        {
          title: "Browser",
          items: [
            { label: "Name", value: info.browser },
            { label: "Version", value: info.browserVersion },
            { label: "Language", value: info.language },
            { label: "Languages", value: info.languages.join(", ") },
          ],
        },
        {
          title: "Screen",
          items: [
            { label: "Resolution", value: `${info.screenWidth} × ${info.screenHeight}` },
            { label: "Color Depth", value: info.colorDepth },
            { label: "Pixel Ratio", value: `${info.pixelRatio}x` },
            { label: "Window Size", value: `${info.windowWidth} × ${info.windowHeight}` },
          ],
        },
        {
          title: "System",
          items: [
            { label: "Timezone", value: info.timezone },
            { label: "UTC Offset", value: `${info.timezoneOffset} minutes` },
            { label: "Online", value: info.online ? "Yes ✓" : "No ✗" },
            { label: "Cookies", value: info.cookieEnabled ? "Enabled ✓" : "Disabled ✗" },
            { label: "Do Not Track", value: info.doNotTrack || "Not set" },
          ],
        },
        {
          title: "Hardware",
          items: [
            { label: "CPU Cores", value: info.cores },
            { label: "Device Memory", value: info.memory },
            { label: "Touch Points", value: info.maxTouchPoints },
            { label: "Network", value: info.connection },
          ],
        },
      ]
    : [];

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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Device Information</h1>
            <p className="text-muted-foreground">
              Get detailed information about your device and browser
            </p>
          </div>
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>

        {info && (
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.items.map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-right">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
