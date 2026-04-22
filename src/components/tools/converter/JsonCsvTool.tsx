"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export function JsonCsvTool() {
  const [input, setInput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const jsonToCsv = (jsonStr: string): string => {
    const data = JSON.parse(jsonStr);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return "";

    const headers = Object.keys(arr[0]);
    const csvRows = [headers.join(",")];

    for (const row of arr) {
      const values = headers.map((header) => {
        const value = row[header];
        const escaped =
          value === null || value === undefined
            ? ""
            : String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  const handleConvert = () => {
    try {
      const result = jsonToCsv(input);
      setCsvOutput(result);
      setError("");
    } catch (e) {
      setError("Invalid JSON. Please check the input format.");
      setCsvOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(csvOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([csvOutput], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.csv";
    a.click();
    URL.revokeObjectURL(url);
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
        <h1 className="text-3xl font-bold mb-2">JSON to CSV Converter</h1>
        <p className="text-muted-foreground mb-6">
          Convert JSON array to CSV format with headers
        </p>

        <Tabs defaultValue="convert" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="convert">Convert</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="convert" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Input JSON</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                {error && (
                  <p className="text-destructive text-sm mt-2">{error}</p>
                )}
                <Button onClick={handleConvert} className="mt-4">
                  Convert to CSV
                </Button>
              </CardContent>
            </Card>

            <Separator />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Output CSV</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    disabled={!csvOutput}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-1" />
                    ) : (
                      <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!csvOutput}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={csvOutput}
                  readOnly
                  placeholder="CSV output will appear here..."
                  className="min-h-[200px] font-mono text-sm"
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">CSV Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {csvOutput ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b">
                          {csvOutput
                            .split("\n")[0]
                            ?.split(",")
                            .map((header, i) => (
                              <th
                                key={i}
                                className="text-left p-2 font-semibold bg-muted"
                              >
                                {header.replace(/"/g, "")}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvOutput
                          .split("\n")
                          .slice(1)
                          .filter((row) => row)
                          .map((row, i) => (
                            <tr key={i} className="border-b">
                              {row.split('","').map((cell, j) => (
                                <td key={j} className="p-2">
                                  {cell.replace(/"/g, "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Convert JSON first to see preview
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
