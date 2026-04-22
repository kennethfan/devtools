"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const httpStatusCodes: { code: number; name: string; description: string; category: string }[] = [
  // 1xx Informational
  { code: 100, name: "Continue", description: "The server has received the request headers", category: "1xx" },
  { code: 101, name: "Switching Protocols", description: "The requester has asked the server to switch protocols", category: "1xx" },
  { code: 102, name: "Processing", description: "The server is processing the request", category: "1xx" },
  // 2xx Success
  { code: 200, name: "OK", description: "The request succeeded", category: "2xx" },
  { code: 201, name: "Created", description: "The request succeeded and a new resource was created", category: "2xx" },
  { code: 202, name: "Accepted", description: "The request has been accepted for processing", category: "2xx" },
  { code: 204, name: "No Content", description: "The server successfully processed the request", category: "2xx" },
  { code: 206, name: "Partial Content", description: "The server is delivering only part of the resource", category: "2xx" },
  // 3xx Redirection
  { code: 301, name: "Moved Permanently", description: "The resource has moved to a new URL", category: "3xx" },
  { code: 302, name: "Found", description: "The resource temporarily resides at a different URL", category: "3xx" },
  { code: 304, name: "Not Modified", description: "The resource has not been modified", category: "3xx" },
  { code: 307, name: "Temporary Redirect", description: "The resource temporarily resides at a different URL", category: "3xx" },
  { code: 308, name: "Permanent Redirect", description: "The resource has moved permanently", category: "3xx" },
  // 4xx Client Error
  { code: 400, name: "Bad Request", description: "The server cannot process the request due to client error", category: "4xx" },
  { code: 401, name: "Unauthorized", description: "Authentication is required", category: "4xx" },
  { code: 403, name: "Forbidden", description: "The server refuses to authorize the request", category: "4xx" },
  { code: 404, name: "Not Found", description: "The requested resource was not found", category: "4xx" },
  { code: 405, name: "Method Not Allowed", description: "The request method is not supported", category: "4xx" },
  { code: 408, name: "Request Timeout", description: "The server timed out waiting for the request", category: "4xx" },
  { code: 409, name: "Conflict", description: "The request conflicts with the current state", category: "4xx" },
  { code: 410, name: "Gone", description: "The resource is no longer available", category: "4xx" },
  { code: 413, name: "Payload Too Large", description: "The request payload is too large", category: "4xx" },
  { code: 429, name: "Too Many Requests", description: "Too many requests in a given time period", category: "4xx" },
  // 5xx Server Error
  { code: 500, name: "Internal Server Error", description: "The server encountered an unexpected condition", category: "5xx" },
  { code: 501, name: "Not Implemented", description: "The server does not support the functionality", category: "5xx" },
  { code: 502, name: "Bad Gateway", description: "The server received an invalid response from upstream", category: "5xx" },
  { code: 503, name: "Service Unavailable", description: "The server is temporarily unavailable", category: "5xx" },
  { code: 504, name: "Gateway Timeout", description: "The server did not receive a timely response", category: "5xx" },
];

const categoryColors: Record<string, string> = {
  "1xx": "bg-blue-500/20 text-blue-600",
  "2xx": "bg-green-500/20 text-green-600",
  "3xx": "bg-yellow-500/20 text-yellow-600",
  "4xx": "bg-orange-500/20 text-orange-600",
  "5xx": "bg-red-500/20 text-red-600",
};

export function HttpStatusCodesTool() {
  const [search, setSearch] = useState("");
  const [selectedCode, setSelectedCode] = useState<typeof httpStatusCodes[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredCodes = httpStatusCodes.filter(
    (c) =>
      c.code.toString().includes(search) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCodes = filteredCodes.reduce((acc, code) => {
    if (!acc[code.category]) acc[code.category] = [];
    acc[code.category].push(code);
    return acc;
  }, {} as Record<string, typeof httpStatusCodes>);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">HTTP Status Codes</h1>
        <p className="text-muted-foreground mb-6">
          Quick reference for HTTP status codes
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code, name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {Object.entries(groupedCodes).map(([category, codes]) => (
              <div key={category}>
                <h3 className={`text-sm font-semibold mb-2 px-3 py-1 rounded inline-block ${categoryColors[category]}`}>
                  {category} - {category === "1xx" ? "Informational" : category === "2xx" ? "Success" : category === "3xx" ? "Redirection" : category === "4xx" ? "Client Error" : "Server Error"}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {codes.map((code) => (
                    <Card
                      key={code.code}
                      className={`cursor-pointer hover:ring-2 hover:ring-primary ${
                        selectedCode?.code === code.code ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedCode(code)}
                    >
                      <CardContent className="py-2 px-3 flex items-center gap-3">
                        <span className="font-mono font-bold text-lg">{code.code}</span>
                        <span className="text-sm truncate">{code.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedCode && (
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-mono">
                    {selectedCode.code}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(selectedCode.code.toString())}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-semibold">{selectedCode.name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <span className={`inline-block px-2 py-1 rounded text-sm ${categoryColors[selectedCode.category]}`}>
                    {selectedCode.category}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div>{selectedCode.description}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
