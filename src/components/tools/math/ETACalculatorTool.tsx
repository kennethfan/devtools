"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Clock, Play, Pause, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ETAResult {
  label: string;
  value: string;
  description: string;
}

export function ETACalculatorTool() {
  const [totalItems, setTotalItems] = useState("");
  const [completedItems, setCompletedItems] = useState("");
  const [elapsedTime, setElapsedTime] = useState("");
  const [results, setResults] = useState<ETAResult[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Live timer mode
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [liveElapsed, setLiveElapsed] = useState(0);
  const [liveCompleted, setLiveCompleted] = useState(0);

  const calculateETA = () => {
    setError("");
    
    const total = parseFloat(totalItems);
    const completed = parseFloat(completedItems);
    const elapsed = parseFloat(elapsedTime);

    if (isNaN(total) || total <= 0) {
      setError("Total items must be a positive number");
      return;
    }
    if (isNaN(completed) || completed < 0 || completed > total) {
      setError("Completed items must be between 0 and total");
      return;
    }
    if (isNaN(elapsed) || elapsed <= 0) {
      setError("Elapsed time must be a positive number");
      return;
    }

    const remaining = total - completed;
    const rate = completed / elapsed; // items per time unit
    const eta = remaining / rate;

    // Calculate completion percentage
    const percentComplete = (completed / total) * 100;

    // Estimate finish time
    const now = new Date();
    const finishTime = new Date(now.getTime() + eta * 1000);

    const calcResults: ETAResult[] = [
      {
        label: "Items Remaining",
        value: Math.ceil(remaining).toString(),
        description: `${total} total - ${completed} completed`,
      },
      {
        label: "Current Rate",
        value: `${rate.toFixed(2)} items/time`,
        description: `${completed} items in ${elapsed} time units`,
      },
      {
        label: "Time Remaining",
        value: formatTime(eta),
        description: `Estimated time to completion`,
      },
      {
        label: "Progress",
        value: `${percentComplete.toFixed(1)}%`,
        description: `${completed} of ${total} items`,
      },
      {
        label: "Estimated Finish",
        value: finishTime.toLocaleTimeString(),
        description: finishTime.toLocaleDateString(),
      },
    ];

    setResults(calcResults);
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
  };

  // Live timer functions
  const startTimer = () => {
    setStartTime(Date.now());
    setIsRunning(true);
    setLiveElapsed(0);
    setLiveCompleted(0);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resumeTimer = () => {
    setIsRunning(true);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setLiveElapsed(0);
    setLiveCompleted(0);
  };

  const incrementCompleted = () => {
    setLiveCompleted((prev) => prev + 1);
  };

  // Update live elapsed time
  useState(() => {
    if (isRunning && startTime) {
      const interval = setInterval(() => {
        setLiveElapsed((Date.now() - startTime) / 1000);
      }, 100);
      return () => clearInterval(interval);
    }
  });

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
        <h1 className="text-3xl font-bold mb-2">ETA Calculator</h1>
        <p className="text-muted-foreground mb-6">
          Estimate time to completion based on progress rate
        </p>

        {/* Manual Calculation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Manual Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm mb-2 block">Total Items</label>
                <Input
                  type="number"
                  value={totalItems}
                  onChange={(e) => setTotalItems(e.target.value)}
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Completed</label>
                <Input
                  type="number"
                  value={completedItems}
                  onChange={(e) => setCompletedItems(e.target.value)}
                  placeholder="e.g., 25"
                />
              </div>
              <div>
                <label className="text-sm mb-2 block">Elapsed Time (seconds)</label>
                <Input
                  type="number"
                  value={elapsedTime}
                  onChange={(e) => setElapsedTime(e.target.value)}
                  placeholder="e.g., 60"
                />
              </div>
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}

            <Button onClick={calculateETA} className="w-full">
              Calculate ETA
            </Button>
          </CardContent>
        </Card>

        {/* Live Timer Mode */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Live Timer Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-muted rounded-lg">
              <div className="text-4xl font-mono font-bold mb-2">
                {formatTime(liveElapsed)}
              </div>
              <div className="text-sm text-muted-foreground">
                Items completed: {liveCompleted}
              </div>
            </div>

            <div className="flex gap-2">
              {!startTime ? (
                <Button onClick={startTimer} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </Button>
              ) : (
                <>
                  {isRunning ? (
                    <Button onClick={pauseTimer} variant="outline" className="flex-1">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeTimer} className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={resetTimer} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </>
              )}
            </div>

            {isRunning && (
              <Button onClick={incrementCompleted} variant="secondary" className="w-full">
                +1 Completed
              </Button>
            )}
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
                  <div className="text-xs text-muted-foreground mt-1">{result.description}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}