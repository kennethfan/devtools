"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const bases = [
  { label: "Binary", value: 2, prefix: "0b", chars: "01" },
  { label: "Octal", value: 8, prefix: "0o", chars: "01234567" },
  { label: "Decimal", value: 10, prefix: "", chars: "0123456789" },
  { label: "Hexadecimal", value: 16, prefix: "0x", chars: "0123456789ABCDEF" },
];

export function BaseConverterTool() {
  const [values, setValues] = useState<Record<number, string>>({
    2: "",
    8: "",
    10: "",
    16: "",
  });
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const parseValue = (str: string, base: number): bigint | null => {
    if (!str) return null;
    try {
      // Remove prefixes
      const clean = str.replace(/^0x/i, "").replace(/^0b/i, "").replace(/^0o/i, "");
      if (!clean) return null;
      // Validate characters
      if (!/^[\dA-Fa-f]+$/.test(clean) || clean === "") return null;
      return BigInt(parseInt(clean, base));
    } catch {
      return null;
    }
  };

  const formatValue = (num: bigint, base: number, prefix: string): string => {
    return prefix + num.toString(base).toUpperCase();
  };

  const handleChange = (base: number, inputValue: string) => {
    setActiveInput(base);
    setError("");

    const newValues = { ...values, [base]: inputValue };

    // Parse the input
    const num = parseValue(inputValue, base);

    if (num === null && inputValue !== "") {
      setError(`Invalid ${bases.find((b) => b.value === base)?.label} number`);
      setValues(newValues);
      return;
    }

    if (num !== null) {
      // Convert to all other bases
      bases.forEach((b) => {
        if (b.value !== base) {
          newValues[b.value] = formatValue(num, b.value, b.prefix);
        }
      });
    } else {
      bases.forEach((b) => {
        if (b.value !== base) {
          newValues[b.value] = "";
        }
      });
    }

    setValues(newValues);
  };

  const handleCopy = (value: string, base: number) => {
    navigator.clipboard.writeText(value);
    setCopied(base);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const all = bases.map((b) => `${b.label}: ${values[b.value]}`).join("\n");
    navigator.clipboard.writeText(all);
    setCopied(-1);
    setTimeout(() => setCopied(null), 2000);
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
        <h1 className="text-3xl font-bold mb-2">Base Number Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between binary, octal, decimal, and hexadecimal
        </p>

        {error && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {bases.map(({ label, value, prefix }) => (
            <Card key={value}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <label className="w-28 text-sm font-medium">{label}</label>
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      value={values[value]}
                      onChange={(e) => handleChange(value, e.target.value.toUpperCase())}
                      placeholder={prefix ? `${prefix}...` : "..."}
                      className="font-mono pr-12"
                    />
                    {prefix && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {prefix}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(values[value], value)}
                    disabled={!values[value]}
                  >
                    {copied === value ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Valid chars: {bases.find((b) => b.value === value)?.chars}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" onClick={copyAll}>
            {copied === -1 ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            Copy All Conversions
          </Button>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Quick Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
              {[
                { label: "Binary", value: "0, 1" },
                { label: "Octal", value: "0-7" },
                { label: "Decimal", value: "0-9" },
                { label: "Hex", value: "0-9, A-F" },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <div className="text-muted-foreground">{label}</div>
                  <div className="font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
