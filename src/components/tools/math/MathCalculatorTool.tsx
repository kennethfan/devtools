"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Delete, Calculator } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ButtonType = "number" | "operator" | "function" | "clear";

interface CalcButton {
  label: string;
  value: string;
  type: ButtonType;
}

const buttons: CalcButton[][] = [
  [
    { label: "sin", value: "sin(", type: "function" },
    { label: "cos", value: "cos(", type: "function" },
    { label: "tan", value: "tan(", type: "function" },
    { label: "√", value: "sqrt(", type: "function" },
  ],
  [
    { label: "log", value: "log(", type: "function" },
    { label: "ln", value: "ln(", type: "function" },
    { label: "π", value: "pi", type: "number" },
    { label: "e", value: "e", type: "number" },
  ],
  [
    { label: "7", value: "7", type: "number" },
    { label: "8", value: "8", type: "number" },
    { label: "9", value: "9", type: "number" },
    { label: "÷", value: "/", type: "operator" },
  ],
  [
    { label: "4", value: "4", type: "number" },
    { label: "5", value: "5", type: "number" },
    { label: "6", value: "6", type: "number" },
    { label: "×", value: "*", type: "operator" },
  ],
  [
    { label: "1", value: "1", type: "number" },
    { label: "2", value: "2", type: "number" },
    { label: "3", value: "3", type: "number" },
    { label: "-", value: "-", type: "operator" },
  ],
  [
    { label: "0", value: "0", type: "number" },
    { label: ".", value: ".", type: "number" },
    { label: "⌫", value: "backspace", type: "clear" },
    { label: "+", value: "+", type: "operator" },
  ],
  [
    { label: "(", value: "(", type: "operator" },
    { label: ")", value: ")", type: "operator" },
    { label: "^", value: "^", type: "operator" },
    { label: "=", value: "=", type: "operator" },
  ],
];

const safeEval = (expression: string): string => {
  // Replace math functions with JavaScript equivalents
  let expr = expression
    .replace(/sin\(/g, "Math.sin(")
    .replace(/cos\(/g, "Math.cos(")
    .replace(/tan\(/g, "Math.tan(")
    .replace(/log\(/g, "Math.log10(")
    .replace(/ln\(/g, "Math.log(")
    .replace(/sqrt\(/g, "Math.sqrt(")
    .replace(/pi/gi, "Math.PI")
    .replace(/\be\b/gi, "Math.E")
    .replace(/\^/g, "**");

  // Validate expression (only allow numbers, operators, parentheses, and Math functions)
  if (!/^[\d\s+\-*/().Math,]+$/.test(expr)) {
    throw new Error("Invalid expression");
  }

  // Use Function constructor for safe evaluation
  const result = new Function(`return ${expr}`)();
  return Number.isInteger(result) ? result.toString() : result.toFixed(10).replace(/\.?0+$/, "");
};

export function MathCalculatorTool() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleButtonClick = (btn: CalcButton) => {
    setError("");

    if (btn.value === "backspace") {
      if (expression.length > 0) {
        const newExpr = expression.slice(0, -1);
        setExpression(newExpr);
        setDisplay(newExpr || "0");
      }
      return;
    }

    if (btn.value === "=") {
      try {
        const result = safeEval(expression);
        setHistory((prev) => [`${expression} = ${result}`, ...prev.slice(0, 4)]);
        setDisplay(result);
        setExpression(result);
      } catch (e) {
        setError("Invalid expression");
        setDisplay("Error");
      }
      return;
    }

    const newExpr = expression + btn.value;
    setExpression(newExpr);
    setDisplay(newExpr);
  };

  const handleClear = () => {
    setExpression("");
    setDisplay("0");
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
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

      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-2">Math Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Scientific calculator with trigonometric and logarithmic functions
        </p>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculator
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-right min-h-[80px] flex flex-col justify-end">
              <p className="text-sm text-muted-foreground truncate">{expression}</p>
              <p className={`text-3xl font-mono ${error ? "text-destructive" : ""}`}>{display}</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {buttons.flat().map((btn, i) => (
                <Button
                  key={i}
                  variant={btn.type === "operator" ? "default" : "outline"}
                  className={`h-12 text-lg font-mono ${
                    btn.type === "function" ? "text-xs" : ""
                  }`}
                  onClick={() => handleButtonClick(btn)}
                >
                  {btn.label}
                </Button>
              ))}
            </div>

            <Button variant="destructive" className="w-full" onClick={handleClear}>
              <Delete className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </CardContent>
        </Card>

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="p-2 bg-muted rounded text-sm font-mono cursor-pointer hover:bg-muted/80"
                    onClick={() => {
                      setExpression(item.split(" = ")[1]);
                      setDisplay(item.split(" = ")[1]);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}