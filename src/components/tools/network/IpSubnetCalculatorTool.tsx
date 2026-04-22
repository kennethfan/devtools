"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SubnetResult {
  label: string;
  value: string;
}

const ipToNumber = (ip: string): number => {
  const parts = ip.split(".").map(Number);
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
};

const numberToIp = (num: number): string => {
  return [
    (num >>> 24) & 255,
    (num >>> 16) & 255,
    (num >>> 8) & 255,
    num & 255,
  ].join(".");
};

const cidrToMask = (cidr: number): number => {
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
};

const countOnes = (num: number): number => {
  let count = 0;
  while (num) {
    count += num & 1;
    num >>>= 1;
  }
  return count;
};

export function IpSubnetCalculatorTool() {
  const [ip, setIp] = useState("192.168.1.100");
  const [cidr, setCidr] = useState("24");
  const [results, setResults] = useState<SubnetResult[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const calculate = () => {
    setError("");
    
    const ipParts = ip.split(".");
    if (ipParts.length !== 4 || ipParts.some(p => isNaN(parseInt(p)) || parseInt(p) < 0 || parseInt(p) > 255)) {
      setError("Invalid IP address format");
      return;
    }

    const cidrNum = parseInt(cidr);
    if (cidrNum < 0 || cidrNum > 32) {
      setError("CIDR must be between 0 and 32");
      return;
    }

    const ipNum = ipToNumber(ip);
    const mask = cidrToMask(cidrNum);
    const wildcard = (~mask) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | wildcard) >>> 0;
    const firstUsable = cidrNum >= 31 ? network : network + 1;
    const lastUsable = cidrNum >= 31 ? broadcast : broadcast - 1;
    const totalHosts = Math.pow(2, 32 - cidrNum);

    const calcResults: SubnetResult[] = [
      { label: "Network Address", value: numberToIp(network) + `/${cidr}` },
      { label: "Broadcast Address", value: numberToIp(broadcast) },
      { label: "Subnet Mask", value: numberToIp(mask) },
      { label: "Wildcard Mask", value: numberToIp(wildcard) },
      { label: "First Usable IP", value: numberToIp(firstUsable) },
      { label: "Last Usable IP", value: numberToIp(lastUsable) },
      { label: "Total Hosts", value: totalHosts.toString() },
      { label: "Usable Hosts", value: cidrNum >= 31 ? totalHosts.toString() : (totalHosts - 2).toString() },
      { label: "Network Class", value: getIpClass(ipParts[0]) },
      { label: "Binary Subnet Mask", value: mask.toString(2).padStart(32, "0").match(/.{1,8}/g)!.join(".") },
    ];

    setResults(calcResults);
  };

  const getIpClass = (firstOctet: string): string => {
    const num = parseInt(firstOctet);
    if (num < 128) return "Class A";
    if (num < 192) return "Class B";
    if (num < 224) return "Class C";
    if (num < 240) return "Class D (Multicast)";
    return "Class E (Reserved)";
  };

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const commonSubnets = [
    { label: "/24 (256 IPs)", cidr: "24" },
    { label: "/25 (128 IPs)", cidr: "25" },
    { label: "/26 (64 IPs)", cidr: "26" },
    { label: "/27 (32 IPs)", cidr: "27" },
    { label: "/28 (16 IPs)", cidr: "28" },
    { label: "/29 (8 IPs)", cidr: "29" },
    { label: "/30 (4 IPs)", cidr: "30" },
    { label: "/32 (1 IP)", cidr: "32" },
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
        <h1 className="text-3xl font-bold mb-2">IP Subnet Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate subnet mask, network address, and usable hosts
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">IP Address</label>
                <Input
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  placeholder="192.168.1.100"
                  className="font-mono"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">CIDR / Subnet Mask</label>
                <Select value={cidr} onValueChange={(v) => setCidr(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 33 }, (_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        /{i} ({i === 0 ? "0" : i === 32 ? "255.255.255.255" : `255.255.255.${256 - Math.pow(2, 8 - i) >= 0 ? 256 - Math.pow(2, 8 - i) : 0}`})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {commonSubnets.map(({ label, cidr: c }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => setCidr(c)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button onClick={calculate} className="w-full">
              Calculate
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {results.map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                    onClick={() => handleCopy(value, label)}
                  >
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm">{value}</code>
                      {copied === label && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}