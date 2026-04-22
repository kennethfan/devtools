"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface ParsedUrl {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  username: string;
  password: string;
  origin: string;
}

const parseUrl = (urlStr: string): ParsedUrl | null => {
  try {
    const url = new URL(urlStr);
    return {
      href: url.href,
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      username: url.username,
      password: url.password,
      origin: url.origin,
    };
  } catch {
    return null;
  }
};

export function UrlParserTool() {
  const [input, setInput] = useState("https://username:password@example.com:8080/pathname?query=123#hash");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const handleParse = () => {
    const result = parseUrl(input);
    if (result) {
      setParsed(result);
      setError("");
    } else {
      setError("Invalid URL");
      setParsed(null);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const fields: { label: string; key: keyof ParsedUrl }[] = [
    { label: "Full URL", key: "href" },
    { label: "Origin", key: "origin" },
    { label: "Protocol", key: "protocol" },
    { label: "Hostname", key: "hostname" },
    { label: "Port", key: "port" },
    { label: "Pathname", key: "pathname" },
    { label: "Search", key: "search" },
    { label: "Hash", key: "hash" },
    { label: "Username", key: "username" },
    { label: "Password", key: "password" },
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
        <h1 className="text-3xl font-bold mb-2">URL Parser</h1>
        <p className="text-muted-foreground mb-6">
          Parse and extract components from URLs
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input URL</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter URL to parse..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleParse()}
              className="font-mono"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button onClick={handleParse} className="w-full">
              Parse URL
            </Button>
          </CardContent>
        </Card>

        {parsed && (
          <div className="space-y-3">
            {fields.map(({ label, key }) => (
              <Card key={key}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground w-28 inline-block">
                      {label}:
                    </span>
                    <code className="text-sm bg-muted px-2 py-1 rounded ml-2">
                      {parsed[key] || <span className="text-muted-foreground">(empty)</span>}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(parsed[key], key)}
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
        )}
      </div>
    </div>
  );
}
