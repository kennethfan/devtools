import { type LucideIcon } from "lucide-react";

export type ToolCategory =
  | "crypto"
  | "converter"
  | "web"
  | "images"
  | "development"
  | "network"
  | "math"
  | "measurement"
  | "text"
  | "data";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
}

export const categories: { id: ToolCategory; name: string; icon: LucideIcon }[] = [
  { id: "crypto", name: "Crypto", icon: "🔐" as unknown as LucideIcon },
  { id: "converter", name: "Converter", icon: "🔄" as unknown as LucideIcon },
  { id: "web", name: "Web", icon: "🌐" as unknown as LucideIcon },
  { id: "images", name: "Images & Videos", icon: "🖼️" as unknown as LucideIcon },
  { id: "development", name: "Development", icon: "💻" as unknown as LucideIcon },
  { id: "network", name: "Network", icon: "🌐" as unknown as LucideIcon },
  { id: "math", name: "Math", icon: "🔢" as unknown as LucideIcon },
  { id: "measurement", name: "Measurement", icon: "📏" as unknown as LucideIcon },
  { id: "text", name: "Text", icon: "📝" as unknown as LucideIcon },
  { id: "data", name: "Data", icon: "💰" as unknown as LucideIcon },
];

export const tools: Tool[] = [
  // Crypto
  { id: "token-generator", name: "Token Generator", description: "Generate random strings", category: "crypto", icon: "Key" },
  { id: "hash-text", name: "Hash Text", description: "Hash text using MD5, SHA1, SHA256...", category: "crypto", icon: "Hash" },
  { id: "bcrypt", name: "Bcrypt", description: "Hash and compare passwords", category: "crypto", icon: "Lock" },
  { id: "uuid-generator", name: "UUID Generator", description: "Generate UUIDs", category: "crypto", icon: "Fingerprint" },
  { id: "ulid-generator", name: "ULID Generator", description: "Generate ULIDs", category: "crypto", icon: "ListOrdered" },
  { id: "encrypt-decrypt", name: "Encrypt / Decrypt", description: "AES, TripleDES, Rabbit, RC4", category: "crypto", icon: "Shield" },
  
  // Converter
  { id: "json-yaml", name: "JSON to YAML", description: "Convert JSON to YAML", category: "converter", icon: "FileCode" },
  { id: "yaml-json", name: "YAML to JSON", description: "Convert YAML to JSON", category: "converter", icon: "FileJson" },
  { id: "json-toml", name: "JSON to TOML", description: "Convert JSON to TOML", category: "converter", icon: "FileText" },
  { id: "toml-json", name: "TOML to JSON", description: "Convert TOML to JSON", category: "converter", icon: "FileJson" },
  { id: "json-xml", name: "JSON to XML", description: "Convert JSON to XML", category: "converter", icon: "FileCode" },
  { id: "xml-json", name: "XML to JSON", description: "Convert XML to JSON", category: "converter", icon: "FileJson" },
  { id: "json-csv", name: "JSON to CSV", description: "Convert JSON to CSV", category: "converter", icon: "Table" },
  { id: "base64", name: "Base64 Encode/Decode", description: "Encode and decode Base64", category: "converter", icon: "Code" },
  { id: "url-encode", name: "URL Encode/Decode", description: "Encode and decode URLs", category: "converter", icon: "Link" },
  { id: "html-entities", name: "HTML Entities", description: "Escape and unescape HTML", category: "converter", icon: "FileCode" },
  { id: "color-converter", name: "Color Converter", description: "Convert between hex, rgb, hsl", category: "converter", icon: "Palette" },
  { id: "case-converter", name: "Case Converter", description: "Transform text case", category: "converter", icon: "TextCursor" },
  { id: "base-converter", name: "Base Converter", description: "Convert between bases", category: "converter", icon: "ArrowLeftRight" },
  
  // Web
  { id: "jwt-parser", name: "JWT Parser", description: "Parse and decode JWT", category: "web", icon: "KeyRound" },
  { id: "url-parser", name: "URL Parser", description: "Parse URL components", category: "web", icon: "Link2" },
  { id: "user-agent-parser", name: "User Agent Parser", description: "Parse user agent string", category: "web", icon: "Monitor" },
  { id: "device-information", name: "Device Information", description: "Get device info", category: "web", icon: "Smartphone" },
  { id: "http-status-codes", name: "HTTP Status Codes", description: "List of HTTP status codes", category: "web", icon: "Server" },
  { id: "basic-auth", name: "Basic Auth Generator", description: "Generate Basic Auth header", category: "web", icon: "User" },
  { id: "slugify", name: "Slugify String", description: "Make string URL safe", category: "web", icon: "Type" },
  
  // Development
  { id: "json-prettify", name: "JSON Prettify", description: "Format JSON", category: "development", icon: "AlignLeft" },
  { id: "json-minify", name: "JSON Minify", description: "Minify JSON", category: "development", icon: "Minimize2" },
  { id: "json-diff", name: "JSON Diff", description: "Compare two JSON objects", category: "development", icon: "Diff" },
  { id: "sql-prettify", name: "SQL Prettify", description: "Format SQL queries", category: "development", icon: "Database" },
  { id: "yaml-prettify", name: "YAML Prettify", description: "Format YAML", category: "development", icon: "AlignLeft" },
  { id: "xml-formatter", name: "XML Formatter", description: "Format XML", category: "development", icon: "Code" },
  { id: "regex-tester", name: "Regex Tester", description: "Test regular expressions", category: "development", icon: "Search" },
  { id: "crontab-generator", name: "Crontab Generator", description: "Generate cron expressions", category: "development", icon: "Clock" },
  { id: "git-memo", name: "Git Cheatsheet", description: "Common git commands", category: "development", icon: "GitBranch" },
  
  // Network
  { id: "ip-subnet", name: "IPv4 Subnet Calculator", description: "Calculate subnet information", category: "network", icon: "Network" },
  { id: "ip-converter", name: "IPv4 Converter", description: "Convert IP addresses", category: "network", icon: "Globe" },
  { id: "mac-lookup", name: "MAC Address Lookup", description: "Find vendor by MAC", category: "network", icon: "Search" },
  { id: "mac-generator", name: "MAC Generator", description: "Generate MAC addresses", category: "network", icon: "Plus" },
  
  // Math
  { id: "math-evaluator", name: "Math Evaluator", description: "Calculate expressions", category: "math", icon: "Calculator" },
  { id: "percentage-calculator", name: "Percentage Calculator", description: "Calculate percentages", category: "math", icon: "Percent" },
  
  // Text
  { id: "lorem-ipsum", name: "Lorem Ipsum", description: "Generate placeholder text", category: "text", icon: "FileText" },
  { id: "text-statistics", name: "Text Statistics", description: "Get text info", category: "text", icon: "BarChart" },
  { id: "text-diff", name: "Text Diff", description: "Compare two texts", category: "text", icon: "FileDiff" },
  { id: "emoji-picker", name: "Emoji Picker", description: "Copy emojis", category: "text", icon: "Smile" },
  { id: "ascii-art", name: "ASCII Art Generator", description: "Create ASCII art text", category: "text", icon: "Type" },
  
  // Images
  { id: "qrcode-generator", name: "QR Code Generator", description: "Generate QR codes", category: "images", icon: "QrCode" },
  { id: "wifi-qrcode", name: "WiFi QR Code", description: "Generate WiFi QR codes", category: "images", icon: "Wifi" },
  { id: "svg-placeholder", name: "SVG Placeholder", description: "Generate SVG placeholders", category: "images", icon: "Image" },
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getAllToolIds(): string[] {
  return tools.map((tool) => tool.id);
}
