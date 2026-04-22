"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Unit = "C" | "F" | "K";

export function TemperatureConverterTool() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState<Unit>("C");
  const [results, setResults] = useState({ C: "", F: "", K: "" });
  const [copied, setCopied] = useState("");

  const convert = () => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    
    let celsius: number;
    
    switch (fromUnit) {
      case "C":
        celsius = num;
        break;
      case "F":
        celsius = (num - 32) * 5/9;
        break;
      case "K":
        celsius = num - 273.15;
        break;
    }
    
    setResults({
      C: celsius.toFixed(2) + "°C",
      F: (celsius * 9/5 + 32).toFixed(2) + "°F",
      K: (celsius + 273.15).toFixed(2) + "K",
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
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
        <h1 className="text-3xl font-bold mb-2">Temperature Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert between Celsius, Fahrenheit, and Kelvin
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">Temperature</label>
                <Input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter temperature..."
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Unit</label>
                <div className="flex gap-2">
                  {(["C", "F", "K"] as Unit[]).map(unit => (
                    <Button
                      key={unit}
                      variant={fromUnit === unit ? "default" : "outline"}
                      onClick={() => setFromUnit(unit)}
                    >
                      {unit === "C" ? "°C" : unit === "F" ? "°F" : "K"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={convert} className="w-full">
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              Convert
            </Button>
          </CardContent>
        </Card>

        {results.C && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(results).map(([unit, value]) => (
                <div
                  key={unit}
                  onClick={() => handleCopy(value)}
                  className="flex justify-between p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80"
                >
                  <span className="font-medium">{unit === "C" ? "Celsius" : unit === "F" ? "Fahrenheit" : "Kelvin"}</span>
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