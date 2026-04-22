"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Percent } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CalculationType = "percentOf" | "percentChange" | "whatPercent" | "percentError";

interface Result {
  label: string;
  value: string;
  formula: string;
}

export function PercentageCalculatorTool() {
  const [calcType, setCalcType] = useState<CalculationType>("percentOf");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const calculate = () => {
    setError("");
    const n1 = parseFloat(input1);
    const n2 = parseFloat(input2);

    if (isNaN(n1) || (calcType !== "whatPercent" && isNaN(n2))) {
      setError("Please enter valid numbers");
      setResults([]);
      return;
    }

    let calcResults: Result[] = [];

    switch (calcType) {
      case "percentOf":
        // What is X% of Y?
        const percentOf = (n1 * n2) / 100;
        calcResults = [
          {
            label: `${n1}% of ${n2}`,
            value: percentOf.toFixed(4),
            formula: `(${n1} × ${n2}) ÷ 100 = ${percentOf.toFixed(4)}`,
          },
          {
            label: "Decimal form",
            value: (n1 / 100).toFixed(4),
            formula: `${n1} ÷ 100 = ${(n1 / 100).toFixed(4)}`,
          },
        ];
        break;

      case "percentChange":
        // What is the percentage change from X to Y?
        if (n1 === 0) {
          setError("Original value cannot be zero for percentage change");
          return;
        }
        const change = ((n2 - n1) / Math.abs(n1)) * 100;
        const isIncrease = change >= 0;
        calcResults = [
          {
            label: `Change from ${n1} to ${n2}`,
            value: `${isIncrease ? "+" : ""}${change.toFixed(2)}%`,
            formula: `((${n2} - ${n1}) ÷ |${n1}|) × 100 = ${change.toFixed(2)}%`,
          },
          {
            label: "Actual difference",
            value: (n2 - n1).toFixed(4),
            formula: `${n2} - ${n1} = ${(n2 - n1).toFixed(4)}`,
          },
          {
            label: isIncrease ? "Increase" : "Decrease",
            value: isIncrease ? "Yes" : "No",
            formula: change >= 0 ? "Value increased" : "Value decreased",
          },
        ];
        break;

      case "whatPercent":
        // X is what percent of Y?
        if (n2 === 0) {
          setError("Base value cannot be zero");
          return;
        }
        const percent = (n1 / n2) * 100;
        calcResults = [
          {
            label: `${n1} is what % of ${n2}`,
            value: `${percent.toFixed(2)}%`,
            formula: `(${n1} ÷ ${n2}) × 100 = ${percent.toFixed(2)}%`,
          },
          {
            label: "Decimal form",
            value: (n1 / n2).toFixed(6),
            formula: `${n1} ÷ ${n2} = ${(n1 / n2).toFixed(6)}`,
          },
        ];
        break;

      case "percentError":
        // What is the percent error between X (actual) and Y (expected)?
        if (n2 === 0) {
          setError("True/Expected value cannot be zero");
          return;
        }
        const errorPct = Math.abs(((n1 - n2) / n2) * 100);
        const actualError = n1 - n2;
        calcResults = [
          {
            label: "Percent Error",
            value: `${errorPct.toFixed(4)}%`,
            formula: `(|${n1} - ${n2}| ÷ |${n2}|) × 100 = ${errorPct.toFixed(4)}%`,
          },
          {
            label: "Absolute Error",
            value: Math.abs(actualError).toFixed(4),
            formula: `|${n1} - ${n2}| = ${Math.abs(actualError).toFixed(4)}`,
          },
          {
            label: "Relative Error",
            value: (Math.abs(actualError) / Math.abs(n2)).toFixed(6),
            formula: `|${n1} - ${n2}| ÷ |${n2}| = ${(Math.abs(actualError) / Math.abs(n2)).toFixed(6)}`,
          },
        ];
        break;
    }

    setResults(calcResults);
  };

  const handleCopy = () => {
    const text = results.map((r) => `${r.label}: ${r.value}`).join("\n");
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

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Percentage Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Calculate percentages, changes, and errors
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Calculation Type
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={calcType} onValueChange={(v) => { setCalcType(v as CalculationType); setResults([]); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentOf">What is X% of Y?</SelectItem>
                <SelectItem value="percentChange">Percentage Change (X → Y)</SelectItem>
                <SelectItem value="whatPercent">X is what percent of Y?</SelectItem>
                <SelectItem value="percentError">Percent Error</SelectItem>
              </SelectContent>
            </Select>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-2 block">
                  {calcType === "percentOf" && "Percentage (%)"}
                  {calcType === "percentChange" && "Original Value"}
                  {calcType === "whatPercent" && "Value (X)"}
                  {calcType === "percentError" && "Measured/Actual Value"}
                </label>
                <Input
                  type="number"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                  placeholder={
                    calcType === "percentOf" ? "e.g., 15" :
                    calcType === "percentChange" ? "e.g., 100" :
                    calcType === "whatPercent" ? "e.g., 25" :
                    "e.g., 10.2"
                  }
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">
                  {calcType === "percentOf" && "Total Value (Y)"}
                  {calcType === "percentChange" && "New Value"}
                  {calcType === "whatPercent" && "Base Value (Y)"}
                  {calcType === "percentError" && "True/Expected Value"}
                </label>
                <Input
                  type="number"
                  value={input2}
                  onChange={(e) => setInput2(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && calculate()}
                  placeholder={
                    calcType === "percentOf" ? "e.g., 200" :
                    calcType === "percentChange" ? "e.g., 150" :
                    calcType === "whatPercent" ? "e.g., 50" :
                    "e.g., 10"
                  }
                />
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button onClick={calculate} className="w-full">
              Calculate
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Results</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.map((result, i) => (
                <div key={i} className="p-4 bg-muted rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">{result.label}</div>
                  <div className="text-2xl font-mono font-bold">{result.value}</div>
                  <div className="text-xs text-muted-foreground mt-1 font-mono">{result.formula}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}