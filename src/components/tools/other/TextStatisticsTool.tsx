"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function TextStatisticsTool() {
  const [input, setInput] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    sentences: 0,
    latin: 0,
    chinese: 0,
  });

  useEffect(() => {
    if (!input) {
      setStats({ characters: 0, charactersNoSpaces: 0, words: 0, lines: 0, paragraphs: 0, sentences: 0, latin: 0, chinese: 0 });
      return;
    }

    const characters = input.length;
    const charactersNoSpaces = input.replace(/\s/g, "").length;
    const lines = input.split("\n").filter(Boolean).length;
    const paragraphs = input.split("\n\n").filter(Boolean).length;
    const sentences = input.split(/[.!?]+/).filter(Boolean).length;
    const words = input.trim().split(/\s+/).filter(Boolean).length;
    const latin = (input.match(/[a-zA-Z]/g) || []).length;
    const chinese = (input.match(/[\u4e00-\u9fa5]/g) || []).length;

    setStats({ characters, charactersNoSpaces, words, lines, paragraphs, sentences, latin, chinese });
  }, [input]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <h1 className="text-3xl font-bold mb-2">Text Statistics</h1>
        <p className="text-muted-foreground mb-6">
          Analyze text content and count characters, words, and lines
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Input Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter or paste text to analyze..."
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Characters", value: stats.characters },
                { label: "Characters (no spaces)", value: stats.charactersNoSpaces },
                { label: "Words", value: stats.words },
                { label: "Lines", value: stats.lines },
                { label: "Paragraphs", value: stats.paragraphs },
                { label: "Sentences", value: stats.sentences },
                { label: "Latin characters", value: stats.latin },
                { label: "Chinese characters", value: stats.chinese },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 bg-muted rounded-lg text-center">
                  <div className="text-2xl font-bold">{value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}