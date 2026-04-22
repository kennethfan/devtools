"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ibanLengths: Record<string, { country: string; length: number }> = {
  "AL": { country: "Albania", length: 28 },
  "AD": { country: "Andorra", length: 24 },
  "AT": { country: "Austria", length: 20 },
  "BH": { country: "Bahrain", length: 22 },
  "BY": { country: "Belarus", length: 28 },
  "BE": { country: "Belgium", length: 16 },
  "BA": { country: "Bosnia", length: 20 },
  "BR": { country: "Brazil", length: 29 },
  "BG": { country: "Bulgaria", length: 22 },
  "CR": { country: "Costa Rica", length: 22 },
  "HR": { country: "Croatia", length: 21 },
  "CY": { country: "Cyprus", length: 28 },
  "CZ": { country: "Czech Republic", length: 24 },
  "DK": { country: "Denmark", length: 18 },
  "DO": { country: "Dominican Republic", length: 28 },
  "TL": { country: "East Timor", length: 23 },
  "EE": { country: "Estonia", length: 20 },
  "FO": { country: "Faroe Islands", length: 18 },
  "FI": { country: "Finland", length: 18 },
  "FR": { country: "France", length: 27 },
  "GE": { country: "Georgia", length: 22 },
  "DE": { country: "Germany", length: 22 },
  "GI": { country: "Gibraltar", length: 23 },
  "GR": { country: "Greece", length: 27 },
  "GL": { country: "Greenland", length: 18 },
  "GT": { country: "Guatemala", length: 28 },
  "HU": { country: "Hungary", length: 28 },
  "IS": { country: "Iceland", length: 26 },
  "IQ": { country: "Iraq", length: 23 },
  "IE": { country: "Ireland", length: 22 },
  "IL": { country: "Israel", length: 23 },
  "IT": { country: "Italy", length: 27 },
  "JO": { country: "Jordan", length: 30 },
  "KZ": { country: "Kazakhstan", length: 20 },
  "KE": { country: "Kuwait", length: 30 },
  "LV": { country: "Latvia", length: 21 },
  "LB": { country: "Lebanon", length: 28 },
  "LI": { country: "Liechtenstein", length: 21 },
  "LT": { country: "Lithuania", length: 20 },
  "LU": { country: "Luxembourg", length: 20 },
  "MK": { country: "Macedonia", length: 19 },
  "MT": { country: "Malta", length: 31 },
  "MR": { country: "Mauritania", length: 27 },
  "MU": { country: "Mauritius", length: 30 },
  "MD": { country: "Moldova", length: 24 },
  "MC": { country: "Monaco", length: 27 },
  "ME": { country: "Montenegro", length: 22 },
  "NL": { country: "Netherlands", length: 18 },
  "NO": { country: "Norway", length: 15 },
  "PK": { country: "Pakistan", length: 24 },
  "PS": { country: "Palestine", length: 29 },
  "PL": { country: "Poland", length: 28 },
  "PT": { country: "Portugal", length: 25 },
  "QA": { country: "Qatar", length: 29 },
  "RO": { country: "Romania", length: 24 },
  "LC": { country: "Saint Lucia", length: 32 },
  "SM": { country: "San Marino", length: 27 },
  "ST": { country: "Sao Tome", length: 25 },
  "SA": { country: "Saudi Arabia", length: 24 },
  "RS": { country: "Serbia", length: 22 },
  "SC": { country: "Seychelles", length: 31 },
  "SK": { country: "Slovakia", length: 24 },
  "SI": { country: "Slovenia", length: 19 },
  "ES": { country: "Spain", length: 24 },
  "SE": { country: "Sweden", length: 24 },
  "CH": { country: "Switzerland", length: 21 },
  "TN": { country: "Tunisia", length: 24 },
  "TR": { country: "Turkey", length: 26 },
  "UA": { country: "Ukraine", length: 29 },
  "AE": { country: "UAE", length: 23 },
  "GB": { country: "United Kingdom", length: 22 },
  "VG": { country: "Virgin Islands", length: 24 },
};

export function IbanValidatorTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ valid: boolean; country: string; length: number; message: string } | null>(null);
  const [copied, setCopied] = useState<string | boolean>(false);

  const validate = () => {
    const clean = input.replace(/\s/g, "").toUpperCase();
    
    if (clean.length < 2) {
      setResult({ valid: false, country: "", length: 0, message: "Too short" });
      return;
    }
    
    const countryCode = clean.slice(0, 2);
    const info = ibanLengths[countryCode];
    
    if (!info) {
      setResult({ valid: false, country: "Unknown country code", length: 0, message: "Country code not found" });
      return;
    }
    
    const expectedLength = info.length;
    const actualLength = clean.length;
    
    if (actualLength !== expectedLength) {
      setResult({
        valid: false,
        country: info.country,
        length: actualLength,
        message: `Expected ${expectedLength}, got ${actualLength} characters`,
      });
      return;
    }
    
    // Basic modulo 97 check (simplified)
    const numeric = clean.slice(4) + clean.slice(0, 4)
      .replace(/[A-Z]/g, c => (c.charCodeAt(0) - 55).toString())
      .replace(/[a-z]/g, c => (c.charCodeAt(0) - 87).toString());
    
    let remainder = 0;
    for (let i = 0; i < numeric.length; i += 7) {
      remainder = parseInt(remainder + numeric.slice(i, i + 7)) % 97;
    }
    
    setResult({
      valid: remainder === 1,
      country: info.country,
      length: actualLength,
      message: remainder === 1 ? "Valid IBAN" : "Invalid checksum",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
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
        <h1 className="text-3xl font-bold mb-2">IBAN Validator</h1>
        <p className="text-muted-foreground mb-6">
          Validate International Bank Account Numbers
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">IBAN</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && validate()}
              placeholder="Enter IBAN (e.g., DE89 3704 0044 0532 0130 00)"
              className="font-mono"
            />
            <Button onClick={validate} className="w-full">
              Validate
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className={result.valid ? "border-green-500" : "border-red-500"}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Result</CardTitle>
              {result.valid ? (
                <Check className="h-6 w-6 text-green-500" />
              ) : (
                <X className="h-6 w-6 text-red-500" />
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${result.valid ? "text-green-500" : "text-red-500"}`}>
                  {result.valid ? "Valid" : "Invalid"}
                </span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Country</div>
                  <div className="font-medium">{result.country}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground">Length</div>
                  <div className="font-medium">{result.length} characters</div>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Message</div>
                <div className="font-medium">{result.message}</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}