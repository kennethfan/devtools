"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const countryCodes: Record<string, { country: string; format: string }> = {
  "86": { country: "China", format: "+86 XXX XXXX XXXX" },
  "1": { country: "US/Canada", format: "+1 (XXX) XXX-XXXX" },
  "44": { country: "UK", format: "+44 XXXX XXXXXX" },
  "49": { country: "Germany", format: "+49 XXX XXXXXX" },
  "33": { country: "France", format: "+33 X XX XX XX XX" },
  "81": { country: "Japan", format: "+81 XX-XXXX-XXXX" },
  "82": { country: "South Korea", format: "+82 XX-XXXX-XXXX" },
  "886": { country: "Taiwan", format: "+886 X XXX XXXX" },
  "852": { country: "Hong Kong", format: "+852 XXXX XXXX" },
  "853": { country: "Macau", format: "+853 XXXX XXXX" },
};

export function PhoneParserTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ original: string; country: string; format: string; e164: string } | null>(null);
  const [copied, setCopied] = useState<string | boolean>(false);

  const parse = () => {
    const cleaned = input.replace(/[\s\-\(\)]/g, "");
    
    let countryCode = "";
    let phoneNumber = cleaned;
    
    // Try to find country code
    for (const [code, info] of Object.entries(countryCodes)) {
      if (cleaned.startsWith("+" + code)) {
        countryCode = code;
        phoneNumber = cleaned.slice(code.length + 1);
        break;
      } else if (cleaned.startsWith(code) && code.length > 1) {
        countryCode = code;
        phoneNumber = cleaned.slice(code.length);
        break;
      }
    }
    
    if (!countryCode) {
      // Default to China if starts with 1
      if (cleaned.startsWith("1")) {
        countryCode = "1";
      } else if (cleaned.startsWith("0")) {
        // Assume China
        countryCode = "86";
      }
    }
    
    const info = countryCodes[countryCode] || { country: "Unknown", format: "Unknown format" };
    
    setResult({
      original: input,
      country: info.country,
      format: info.format,
      e164: cleaned.startsWith("+") ? cleaned : "+" + cleaned,
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
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
        <h1 className="text-3xl font-bold mb-2">Phone Number Parser</h1>
        <p className="text-muted-foreground mb-6">
          Parse and format phone numbers
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && parse()}
              placeholder="Enter phone number (e.g., +86 138 1234 5678)"
            />
            <Button onClick={parse} className="w-full">
              <Search className="h-4 w-4 mr-2" />
              Parse
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Original", value: result.original },
                { label: "Country", value: result.country },
                { label: "Format", value: result.format },
                { label: "E.164", value: result.e164 },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  onClick={() => handleCopy(value)}
                  className="flex justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <div className="flex items-center gap-2">
                    <code className="font-mono">{value}</code>
                    {copied === value && <Check className="h-4 w-4" />}
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