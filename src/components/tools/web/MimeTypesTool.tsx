"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const mimeTypes: { type: string; category: string; extensions: string; description: string }[] = [
  // Text
  { type: "text/plain", category: "Text", extensions: ".txt", description: "Plain text" },
  { type: "text/html", category: "Text", extensions: ".html, .htm", description: "HTML document" },
  { type: "text/css", category: "Text", extensions: ".css", description: "Cascading Style Sheets" },
  { type: "text/javascript", category: "Text", extensions: ".js", description: "JavaScript" },
  { type: "text/csv", category: "Text", extensions: ".csv", description: "Comma-separated values" },
  { type: "text/markdown", category: "Text", extensions: ".md", description: "Markdown" },
  // Images
  { type: "image/png", category: "Image", extensions: ".png", description: "Portable Network Graphics" },
  { type: "image/jpeg", category: "Image", extensions: ".jpg, .jpeg", description: "JPEG image" },
  { type: "image/gif", category: "Image", extensions: ".gif", description: "Graphics Interchange Format" },
  { type: "image/webp", category: "Image", extensions: ".webp", description: "WebP image" },
  { type: "image/svg+xml", category: "Image", extensions: ".svg", description: "Scalable Vector Graphics" },
  { type: "image/x-icon", category: "Image", extensions: ".ico", description: "Icon" },
  { type: "image/bmp", category: "Image", extensions: ".bmp", description: "Bitmap" },
  // Audio
  { type: "audio/mpeg", category: "Audio", extensions: ".mp3", description: "MP3 audio" },
  { type: "audio/wav", category: "Audio", extensions: ".wav", description: "WAV audio" },
  { type: "audio/ogg", category: "Audio", extensions: ".ogg", description: "OGG audio" },
  { type: "audio/webm", category: "Audio", extensions: ".webm", description: "WebM audio" },
  // Video
  { type: "video/mp4", category: "Video", extensions: ".mp4", description: "MP4 video" },
  { type: "video/webm", category: "Video", extensions: ".webm", description: "WebM video" },
  { type: "video/ogg", category: "Video", extensions: ".ogv", description: "OGG video" },
  { type: "video/x-msvideo", category: "Video", extensions: ".avi", description: "AVI video" },
  // Application
  { type: "application/json", category: "Application", extensions: ".json", description: "JSON" },
  { type: "application/xml", category: "Application", extensions: ".xml", description: "XML" },
  { type: "application/pdf", category: "Application", extensions: ".pdf", description: "PDF" },
  { type: "application/zip", category: "Application", extensions: ".zip", description: "ZIP archive" },
  { type: "application/x-tar", category: "Application", extensions: ".tar", description: "TAR archive" },
  { type: "application/x-gzip", category: "Application", extensions: ".gz", description: "GZIP" },
  { type: "application/octet-stream", category: "Application", extensions: ".bin", description: "Binary" },
  { type: "application/javascript", category: "Application", extensions: ".js", description: "JavaScript" },
  { type: "application/typescript", category: "Application", extensions: ".ts", description: "TypeScript" },
  // Fonts
  { type: "font/woff", category: "Font", extensions: ".woff", description: "Web Open Font" },
  { type: "font/woff2", category: "Font", extensions: ".woff2", description: "Web Open Font 2" },
  { type: "font/ttf", category: "Font", extensions: ".ttf", description: "TrueType Font" },
  // Archives
  { type: "application/x-rar-compressed", category: "Archive", extensions: ".rar", description: "RAR archive" },
  { type: "application/x-7z-compressed", category: "Archive", extensions: ".7z", description: "7-Zip" },
];

const categories = [...new Set(mimeTypes.map((m) => m.category))];

const categoryColors: Record<string, string> = {
  Text: "bg-blue-500/20 text-blue-600",
  Image: "bg-purple-500/20 text-purple-600",
  Audio: "bg-pink-500/20 text-pink-600",
  Video: "bg-red-500/20 text-red-600",
  Application: "bg-green-500/20 text-green-600",
  Font: "bg-orange-500/20 text-orange-600",
  Archive: "bg-yellow-500/20 text-yellow-600",
};

export function MimeTypesTool() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<typeof mimeTypes[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredTypes = mimeTypes.filter(
    (m) =>
      m.type.toLowerCase().includes(search.toLowerCase()) ||
      m.extensions.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const groupedTypes = filteredTypes.reduce((acc, mtype) => {
    if (!acc[mtype.category]) acc[mtype.category] = [];
    acc[mtype.category].push(mtype);
    return acc;
  }, {} as Record<string, typeof mimeTypes>);

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
        <h1 className="text-3xl font-bold mb-2">MIME Types Reference</h1>
        <p className="text-muted-foreground mb-6">
          Quick reference for common MIME types
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by type, extension, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {Object.entries(groupedTypes).map(([category, types]) => (
              <div key={category}>
                <h3 className={`text-sm font-semibold mb-2 px-2 py-1 rounded inline-block ${categoryColors[category]}`}>
                  {category}
                </h3>
                <div className="grid gap-1">
                  {types.map((mtype) => (
                    <Card
                      key={mtype.type}
                      className={`cursor-pointer hover:ring-2 hover:ring-primary ${
                        selectedType?.type === mtype.type ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedType(mtype)}
                    >
                      <CardContent className="py-2 px-3 flex items-center gap-3">
                        <code className="text-xs flex-1 truncate">{mtype.type}</code>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {selectedType && (
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">MIME Type Details</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(selectedType.type)}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <code className="text-lg font-mono">{selectedType.type}</code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Extensions</div>
                  <code className="bg-muted px-2 py-1 rounded">{selectedType.extensions}</code>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <span className={`inline-block px-2 py-1 rounded text-sm ${categoryColors[selectedType.category]}`}>
                    {selectedType.category}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div>{selectedType.description}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}