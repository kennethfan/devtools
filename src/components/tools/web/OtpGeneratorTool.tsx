"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Copy, Check, RefreshCw, Play, Pause } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OtpLength = 6 | 8;

const generateTotp = async (secret: string, digits: number, period: number): Promise<string> => {
  // Simple TOTP implementation (client-side)
  // In production, use a proper TOTP library
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
  const timeStep = Math.floor(now / period);
  const timeBuffer = new ArrayBuffer(8);
  const timeView = new DataView(timeBuffer);
  timeView.setUint32(4, timeStep, false); // Big-endian

  const signature = await crypto.subtle.sign("HMAC", key, timeBuffer);
  const hash = new Uint8Array(signature);

  // Truncate
  const offset = hash[hash.length - 1] & 0xf;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = code % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
};

const generateHotp = (secret: string, counter: number, digits: number): string => {
  // Simple HOTP implementation
  let hash = 0;
  const data = secret + counter.toString();
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash + data.charCodeAt(i)) | 0;
  }
  const otp = Math.abs(hash) % Math.pow(10, digits);
  return otp.toString().padStart(digits, "0");
};

export function OtpGeneratorTool() {
  const [secret, setSecret] = useState("JBSWY3DPEHPK3PXP");
  const [otpType, setOtpType] = useState<"totp" | "hotp">("totp");
  const [digits, setDigits] = useState<OtpLength>(6);
  const [period, setPeriod] = useState(30);
  const [counter, setCounter] = useState(1);
  const [otp, setOtp] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateOtp = async () => {
    if (otpType === "totp") {
      const code = await generateTotp(secret, digits, period);
      setOtp(code);
    } else {
      const code = generateHotp(secret, counter, digits);
      setOtp(code);
    }
  };

  useEffect(() => {
    generateOtp();
  }, [secret, digits, period, counter, otpType]);

  useEffect(() => {
    if (otpType === "totp" && isRunning) {
      const updateTime = () => {
        setTimeLeft((prev) => {
          if (prev <= 1) return period;
          return prev - 1;
        });
      };

      intervalRef.current = setInterval(updateTime, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [otpType, isRunning, period]);

  useEffect(() => {
    if (timeLeft === period && otpType === "totp") {
      generateOtp();
    }
  }, [timeLeft, period, otpType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(otp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewSecret = () => {
    const array = new Uint8Array(10);
    crypto.getRandomValues(array);
    const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let newSecret = "";
    for (let i = 0; i < 10; i++) {
      newSecret += base32Chars[array[i] % 32];
    }
    setSecret(newSecret);
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
        <h1 className="text-3xl font-bold mb-2">OTP Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate Time-based (TOTP) or Counter-based (HOTP) one-time passwords
        </p>

        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={otpType === "totp" ? "default" : "outline"}
              onClick={() => setOtpType("totp")}
            >
              TOTP (Time-based)
            </Button>
            <Button
              variant={otpType === "hotp" ? "default" : "outline"}
              onClick={() => setOtpType("hotp")}
            >
              HOTP (Counter-based)
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm">Secret Key (Base32)</label>
                  <Button variant="ghost" size="sm" onClick={handleNewSecret}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                <Input
                  value={secret}
                  onChange={(e) => setSecret(e.target.value.toUpperCase().replace(/[^A-Z2-7]/g, ""))}
                  className="font-mono"
                  placeholder="JBSWY3DPEHPK3PXP"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm mb-2 block">Digits</label>
                  <Select
                    value={digits.toString()}
                    onValueChange={(v) => setDigits(parseInt(v) as OtpLength)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 digits</SelectItem>
                      <SelectItem value="8">8 digits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {otpType === "totp" && (
                  <div className="flex-1">
                    <label className="text-sm mb-2 block">Period (seconds)</label>
                    <Input
                      type="number"
                      value={period}
                      onChange={(e) => setPeriod(parseInt(e.target.value) || 30)}
                      min={10}
                      max={300}
                    />
                  </div>
                )}

                {otpType === "hotp" && (
                  <div className="flex-1">
                    <label className="text-sm mb-2 block">Counter</label>
                    <Input
                      type="number"
                      value={counter}
                      onChange={(e) => setCounter(parseInt(e.target.value) || 1)}
                      min={1}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl">Generated OTP</CardTitle>
              {otpType === "totp" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRunning(!isRunning)}
                >
                  {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl font-mono font-bold tracking-[0.5em] mb-4">
                {otp}
              </div>
              {otpType === "totp" && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${(timeLeft / period) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{timeLeft}s</span>
                </div>
              )}
              <Button onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy OTP
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}