"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CronField = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

const fields: { label: string; key: CronField; min: number; max: number }[] = [
  { label: "Minute", key: "minute", min: 0, max: 59 },
  { label: "Hour", key: "hour", min: 0, max: 23 },
  { label: "Day of Month", key: "dayOfMonth", min: 1, max: 31 },
  { label: "Month", key: "month", min: 1, max: 12 },
  { label: "Day of Week", key: "dayOfWeek", min: 0, max: 6 },
];

const presets = [
  { label: "Every minute", cron: "* * * * *" },
  { label: "Every hour", cron: "0 * * * *" },
  { label: "Every day at midnight", cron: "0 0 * * *" },
  { label: "Every Monday", cron: "0 0 * * 1" },
  { label: "Every month", cron: "0 0 1 * *" },
  { label: "Every 5 minutes", cron: "*/5 * * * *" },
  { label: "Every 30 minutes", cron: "*/30 * * * *" },
];

export function CronGeneratorTool() {
  const [cron, setCron] = useState("0 * * * *");
  const [fields, setFields] = useState({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
  });
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [nextRuns, setNextRuns] = useState<string[]>([]);

  const updateCron = (key: keyof typeof fields, value: string) => {
    const newFields = { ...fields, [key]: value };
    setFields(newFields);
    setCron(`${newFields.minute} ${newFields.hour} ${newFields.dayOfMonth} ${newFields.month} ${newFields.dayOfWeek}`);
  };

  const handleParseCron = () => {
    try {
      const cronParser = require("cron-parser");
      const interval = cronParser.parse(cron);
      const next = [];
      for (let i = 0; i < 5; i++) {
        next.push(interval.next().toISOString());
      }
      setNextRuns(next);
      setError("");
    } catch (e) {
      setError("Invalid cron expression");
      setNextRuns([]);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cron);
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Cron Generator</h1>
        <p className="text-muted-foreground mb-6">
          Generate and validate cron expressions
        </p>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Cron Expression</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <code className="text-2xl font-mono block text-center p-4 bg-muted rounded">
              {cron}
            </code>
            <p className="text-xs text-muted-foreground text-center mt-2">
              minute hour day-of-month month day-of-week
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {presets.map(({ label, cron: c }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const parts = c.split(" ");
                    setFields({
                      minute: parts[0],
                      hour: parts[1],
                      dayOfMonth: parts[2],
                      month: parts[3],
                      dayOfWeek: parts[4],
                    });
                    setCron(c);
                  }}
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Custom Expression</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { label: "Minute", key: "minute" as CronField, min: 0, max: 59 },
                { label: "Hour", key: "hour" as CronField, min: 0, max: 23 },
                { label: "Day", key: "dayOfMonth" as CronField, min: 1, max: 31 },
                { label: "Month", key: "month" as CronField, min: 1, max: 12 },
                { label: "Weekday", key: "dayOfWeek" as CronField, min: 0, max: 6 },
              ].map(({ label, key, min, max }) => (
                <div key={key}>
                  <label className="text-sm mb-2 block">{label}</label>
                  <Input
                    value={fields[key]}
                    onChange={(e) => updateCron(key, e.target.value)}
                    className="font-mono text-center"
                    placeholder="*"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-center">
                    {min}-{max} or *
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Next Run Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleParseCron} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              Calculate Next Runs
            </Button>
            {error && <p className="text-destructive text-sm">{error}</p>}
            {nextRuns.length > 0 && (
              <div className="space-y-2">
                {nextRuns.map((run, i) => (
                  <div key={i} className="p-2 bg-muted rounded text-sm">
                    {new Date(run).toLocaleString()}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}