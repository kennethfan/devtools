"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const generateRandomBytes = (count: number): string => {
  const hex = "0123456789abcdef";
  let result = "";
  for (let i = 0; i < count * 2; i++) {
    result += hex[Math.floor(Math.random() * 16)];
  }
  return result;
};

const formatIpv6 = (hex: string): string => {
  const groups: string[] = [];
  for (let i = 0; i < 32; i += 4) {
    groups.push(hex.slice(i, i + 4));
  }
  return groups.join(":");
};

const ipv6ToFull = (ip: string): string => {
  // Expand :: notation
  const parts = ip.split("::");
  if (parts.length === 2) {
    const leftParts = parts[0] ? parts[0].split(":") : [];
    const rightParts = parts[1] ? parts[1].split(":") : [];
    const missing = 8 - leftParts.length - rightParts.length;
    
    const middle = Array(missing).fill("0000");
    return [...leftParts, ...middle, ...rightParts].map(p => p.padStart(4, "0")).join(":");
  }
  return ip.split(":").map(p => p.padStart(4, "0")).join(":");
};

export function Ipv6UlaGeneratorTool() {
  const [prefix, setPrefix] = useState("fd");
  const [customPrefix, setCustomPrefix] = useState("");
  const [subnetId, setSubnetId] = useState("0001");
  const [generated, setGenerated] = useState<{ ula: string; full: string; usage: string } | null>(null);
  const [copied, setCopied] = useState("");

  const generate = () => {
    // ULA format: fdxx:xxxx:xxxx::/48
    const globalId = generateRandomBytes(5); // 40 bits
    const subnetIdHex = subnetId.replace(/[^0-9a-fA-F]/g, "").slice(0, 4) || "0001";
    
    // Construct the /48 prefix
    const prefixHex = customPrefix || `${prefix}${globalId.slice(0, 2)}:${globalId.slice(2)}`;
    const ulaShort = `${prefixHex}:${subnetIdHex}::`;
    const ulaFull = `${formatIpv6(prefixHex + subnetIdHex + "000000000000")}`;
    
    // /64 addresses (common for LAN)
    const link1 = formatIpv6(prefixHex + subnetIdHex + "00000000" + generateRandomBytes(8));
    const link2 = formatIpv6(prefixHex + subnetIdHex + "00000000" + generateRandomBytes(8));
    
    setGenerated({
      ula: `${ulaShort}/48`,
      full: ulaFull,
      usage: `${link1}/64\n${link2}/64`,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 2000);
  };

  const presets = [
    { label: "fd00::/8 (ULA)", prefix: "fd" },
    { label: "fe80::/10 (Link-Local)", prefix: "fe80" },
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
        <h1 className="text-3xl font-bold mb-2">IPv6 ULA Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate Unique Local IPv6 Addresses (ULA) for private networks
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Prefix</label>
                <Input
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value.slice(0, 2))}
                  placeholder="fd"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">Use "fd" for ULA, "fe80" for link-local</p>
              </div>
              <div>
                <label className="text-sm mb-2 block">Subnet ID (hex)</label>
                <Input
                  value={subnetId}
                  onChange={(e) => setSubnetId(e.target.value)}
                  placeholder="0001"
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">16-bit subnet identifier</p>
              </div>
            </div>

            <div>
              <label className="text-sm mb-2 block">Custom Global ID (optional)</label>
              <Input
                value={customPrefix}
                onChange={(e) => setCustomPrefix(e.target.value)}
                placeholder="fd12:3456:789a"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to auto-generate</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map(({ label, prefix: p }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (p.length <= 4) {
                      setPrefix(p);
                      setCustomPrefix("");
                    }
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>

            <Button onClick={generate} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate ULA
            </Button>
          </CardContent>
        </Card>

        {generated && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Generated Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">ULA Prefix (/48)</div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-lg">{generated.ula}</code>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generated.ula)}>
                    {copied === generated.ula ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Full Address</div>
                <div className="flex items-center justify-between">
                  <code className="font-mono text-lg">{generated.full}</code>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(generated.full)}>
                    {copied === generated.full ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Sample /64 Subnets</div>
                <pre className="font-mono text-sm mt-2 whitespace-pre-wrap">{generated.usage}</pre>
                <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleCopy(generated.usage)}>
                  {copied === generated.usage ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>• ULA addresses are like private IPv6 addresses (equivalent to RFC 1918 for IPv4)</p>
                <p>• The fd prefix indicates a locally-assigned ULA (recommended)</p>
                <p>• /48 prefix allows 65536 /64 subnets</p>
                <p>• Use /64 prefixes for LAN segments</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}