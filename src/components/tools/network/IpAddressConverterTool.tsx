"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Format = "dotted" | "integer" | "hex" | "binary";

const formatIp = (ip: string, format: Format): string => {
  const parts = ip.split(".").map(Number);
  
  switch (format) {
    case "dotted":
      return ip;
    case "integer":
      return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]).toString();
    case "hex":
      return "0x" + parts.map(p => p.toString(16).padStart(2, "0")).join("");
    case "binary":
      return parts.map(p => p.toString(2).padStart(8, "0")).join(".");
    default:
      return ip;
  }
};

const parseToDotted = (input: string, format: Format): string => {
  let parts: number[];
  
  switch (format) {
    case "dotted":
      parts = input.split(".").map(Number);
      break;
    case "integer":
      const num = parseInt(input);
      parts = [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ];
      break;
    case "hex":
      const hex = input.replace(/^0x/i, "");
      const padded = hex.padStart(8, "0");
      parts = [
        parseInt(padded.slice(0, 2), 16),
        parseInt(padded.slice(2, 4), 16),
        parseInt(padded.slice(4, 6), 16),
        parseInt(padded.slice(6, 8), 16),
      ];
      break;
    case "binary":
      parts = input.split(".").map(p => parseInt(p, 2));
      break;
    default:
      return input;
  }
  
  return parts.join(".");
};

export function IpAddressConverterTool() {
  const [input, setInput] = useState("192.168.1.100");
  const [inputFormat, setInputFormat] = useState<Format>("dotted");
  const [outputs, setOutputs] = useState<{ format: Format; value: string }[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const convert = () => {
    setError("");
    
    try {
      const dotted = parseToDotted(input, inputFormat);
      
      // Validate dotted format
      const parts = dotted.split(".").map(Number);
      if (parts.length !== 4 || parts.some(isNaN)) {
        setError("Invalid IP address");
        return;
      }
      
      const formats: Format[] = ["dotted", "integer", "hex", "binary"];
      const newOutputs = formats.map(format => ({
        format,
        value: formatIp(dotted, format),
      }));
      
      setOutputs(newOutputs);
    } catch (e) {
      setError("Invalid input format");
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(value);
    setTimeout(() => setCopied(""), 2000);
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
        <h1 className="text-3xl font-bold mb-2">IP Address Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between different IP address formats
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Input Format</label>
                <Select value={inputFormat} onValueChange={(v) => setInputFormat(v as Format)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dotted">Dotted Decimal (192.168.1.1)</SelectItem>
                    <SelectItem value="integer">Integer (3232235777)</SelectItem>
                    <SelectItem value="hex">Hexadecimal (0xC0A80101)</SelectItem>
                    <SelectItem value="binary">Binary (11000000.10101000...)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm mb-2 block">IP Address</label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    inputFormat === "dotted" ? "192.168.1.100" :
                    inputFormat === "integer" ? "3232235777" :
                    inputFormat === "hex" ? "0xC0A80164" :
                    "11000000.10101000.00000001.01100100"
                  }
                  className="font-mono"
                />
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button onClick={convert} className="w-full">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Convert
            </Button>
          </CardContent>
        </Card>

        {outputs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {outputs.map(({ format, value }) => (
                <div
                  key={format}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                  onClick={() => handleCopy(value)}
                >
                  <span className="text-sm text-muted-foreground capitalize w-32">{format}</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono">{value}</code>
                    {copied === value && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}