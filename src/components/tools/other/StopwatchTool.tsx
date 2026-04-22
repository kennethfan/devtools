"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StopwatchTool() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(t => t + 10);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => {
    setLaps(prev => [time, ...prev]);
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
        <h1 className="text-3xl font-bold mb-2">Stopwatch</h1>
        <p className="text-muted-foreground mb-6">
          Precision stopwatch with lap times
        </p>

        <Card className="mb-6">
          <CardContent className="py-12 text-center">
            <div className="text-7xl font-mono font-bold tabular-nums">
              {formatTime(time)}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="flex justify-center gap-4 py-6">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" size="lg">
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={handleLap} variant="outline" size="lg" disabled={!isRunning}>
              Lap
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              <RotateCcw className="h-5 w-5 mr-2" />
              Reset
            </Button>
          </CardContent>
        </Card>

        {laps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lap Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {laps.map((lap, i) => (
                  <div key={i} className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">Lap {laps.length - i}</span>
                    <code className="font-mono">{formatTime(lap)}</code>
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