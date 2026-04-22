"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function WifiQrcodeTool() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");
  const [hidden, setHidden] = useState(false);
  const [qrcode, setQrcode] = useState("");
  const [copied, setCopied] = useState<string | boolean>(false);

  const generate = async () => {
    if (!ssid) return;
    
    const QRCode = require("qrcode");
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`;
    
    try {
      const dataUrl = await QRCode.toDataURL(wifiString, { margin: 2, width: 200 });
      setQrcode(dataUrl);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopy = async () => {
    if (!qrcode) return;
    const response = await fetch(qrcode);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob })
    ]);
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
        <h1 className="text-3xl font-bold mb-2">WiFi QR Code</h1>
        <p className="text-muted-foreground mb-6">
          Generate QR code for WiFi network
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">WiFi Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm mb-2 block">Network Name (SSID)</label>
              <Input
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="WiFi network name"
              />
            </div>
            <div>
              <label className="text-sm mb-2 block">Password</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="WiFi password"
                type="password"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Encryption</label>
                <Select value={encryption} onValueChange={(v) => setEncryption(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="hidden"
                  checked={hidden}
                  onChange={(e) => setHidden(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="hidden">Hidden Network</label>
              </div>
            </div>
            <Button onClick={generate} className="w-full">
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {qrcode && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">QR Code</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img src={qrcode} alt="WiFi QR Code" className="rounded-lg" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}