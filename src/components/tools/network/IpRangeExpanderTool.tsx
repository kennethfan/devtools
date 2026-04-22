"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const parseCidr = (cidr: string): { start: number; end: number } | null => {
  const parts = cidr.split("/");
  if (parts.length !== 2) return null;
  
  const ipParts = parts[0].split(".").map(Number);
  if (ipParts.length !== 4 || ipParts.some(isNaN)) return null;
  
  const mask = parseInt(parts[1]);
  if (isNaN(mask) || mask < 0 || mask > 32) return null;
  
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const start = (ipNum & (~0 << (32 - mask))) >>> 0;
  const end = (start | ((1 << (32 - mask)) - 1)) >>> 0;
  
  return { start, end };
};

const numberToIp = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
};

export function IpRangeExpanderTool() {
  const [input, setInput] = useState("192.168.1.0/24");
  const [ips, setIps] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(0);

  const expand = () => {
    setError("");
    const parsed = parseCidr(input);
    
    if (!parsed) {
      setError("Invalid CIDR format. Example: 192.168.1.0/24");
      setIps([]);
      setCount(0);
      return;
    }

    const { start, end } = parsed;
    const total = end - start + 1;
    
    if (total > 65536) {
      setError(`Range too large (${total.toLocaleString()} IPs). Maximum 65,536 IPs.`);
      setIps([]);
      setCount(total);
      return;
    }

    const newIps: string[] = [];
    for (let i = start; i <= end; i++) {
      newIps.push(numberToIp(i));
    }
    
    setIps(newIps);
    setCount(total);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ips.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([ips.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ip-range-${input.replace(/\//g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const presets = [
    { label: "/24 (256 IPs)", value: "192.168.1.0/24" },
    { label: "/25 (128 IPs)", value: "192.168.1.0/25" },
    { label: "/26 (64 IPs)", value: "192.168.1.0/26" },
    { label: "/27 (32 IPs)", value: "192.168.1.0/27" },
    { label: "/28 (16 IPs)", value: "192.168.1.0/28" },
    { label: "/30 (4 IPs)", value: "192.168.1.0/30" },
  ];

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
        <h1 className="text-3xl font-bold mb-2">IP Range Expander</h1>
        <p className="text-muted-foreground mb-6">
          Expand CIDR notation to individual IP addresses
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">CIDR Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">CIDR Notation</label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="192.168.1.0/24"
                className="font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map(({ label, value }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(value)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button onClick={expand} className="w-full">
              Expand Range
            </Button>
          </CardContent>
        </Card>

        {ips.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">
                IP Addresses ({count.toLocaleString()} total)
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={ips.slice(0, 1000).join("\n")}
                readOnly
                className="min-h-[300px] font-mono text-sm"
              />
              {ips.length > 1000 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing first 1,000 of {ips.length.toLocaleString()} IPs. Download for full list.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}