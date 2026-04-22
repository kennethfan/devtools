"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emailProviders = [
  { domain: "gmail.com", name: "Gmail", format: "lowercase" },
  { domain: "googlemail.com", name: "Google Mail", format: "lowercase" },
  { domain: "yahoo.com", name: "Yahoo", format: "preserve" },
  { domain: "hotmail.com", name: "Hotmail", format: "lowercase" },
  { domain: "outlook.com", name: "Outlook", format: "lowercase" },
  { domain: "icloud.com", name: "iCloud", format: "lowercase" },
  { domain: "protonmail.com", name: "ProtonMail", format: "lowercase" },
  { domain: "mail.com", name: "Mail.com", format: "lowercase" },
];

const normalizeEmail = (email: string): string => {
  const [localPart, domain] = email.toLowerCase().split("@");
  
  if (!domain) return email;
  
  // Remove common aliases and dots for Gmail
  if (domain === "gmail.com" || domain === "googlemail.com") {
    return `${localPart.replace(/\./g, "")}@gmail.com`.toLowerCase();
  }
  
  // Hotmail/Outlook removes trailing dots
  if (domain === "hotmail.com" || domain === "outlook.com") {
    return email.toLowerCase();
  }
  
  return email.toLowerCase();
};

const getEmailDomain = (email: string): string => {
  const parts = email.split("@");
  return parts.length > 1 ? parts[1].toLowerCase() : "";
};

export function EmailNormalizerTool() {
  const [input, setInput] = useState("John.Doe@Gmail.Com");
  const [output, setOutput] = useState("");
  const [detected, setDetected] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleNormalize = () => {
    try {
      const email = input.trim();
      if (!email.includes("@")) {
        setError("Invalid email format: missing @");
        setOutput("");
        return;
      }

      const domain = getEmailDomain(email);
      const provider = emailProviders.find((p) => domain.includes(p.domain));
      
      if (provider) {
        setDetected(provider.name);
      } else {
        setDetected("Unknown");
      }

      const normalized = normalizeEmail(email);
      setOutput(normalized);
      setError("");
    } catch (e) {
      setError("Invalid email format");
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        <h1 className="text-3xl font-bold mb-2">Email Normalizer</h1>
        <p className="text-muted-foreground mb-6">
          Standardize email addresses for comparison
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Email Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNormalize()}
              placeholder="Enter email address..."
              className="font-mono"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button onClick={handleNormalize} className="w-full">
              Normalize
            </Button>
          </CardContent>
        </Card>

        {output && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Normalized Email</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <code className="block p-4 bg-muted rounded text-lg font-mono">
                {output}
              </code>
              
              {detected && (
                <div className="text-sm text-muted-foreground">
                  Detected provider: <span className="font-medium">{detected}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Supported Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {emailProviders.map(({ domain, name }) => (
                <span
                  key={domain}
                  className="px-3 py-1 bg-muted rounded text-sm"
                >
                  {name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}