"use client";

import { useState } from "react";
import { ArrowLeft, Copy, Check, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const emojiCategories = {
  "Smileys": ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕"],
  "Gestures": ["👍", "👎", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋", "🤏", "💪", "🦾", "🦿", "🦵", "🦶", "👣", "👏", "🙌", "👐", "🤲", "🙏"],
  "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"],
  "Objects": ["💼", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "📝", "✏️", "✒️", "🖋️", "🖊️", "🖊️", "📌"],
  "Symbols": ["✅", "❌", "❓", "❔", "❕", "❗", "‼️", "⁉️", "💯", "🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "⚪", "🟤", "⭐", "🌟", "✨", "💫", "💥", "💢", "💬", "💭", "🗯️", "♠️", "♣️", "♥️", "♦️"],
};

export function EmojiPickerTool() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const allEmojis = Object.values(emojiCategories).flat();
  const filteredEmojis = search
    ? allEmojis
    : allEmojis;

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setCopied(emoji);
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

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Emoji Picker</h1>
        <p className="text-muted-foreground mb-6">
          Copy and paste emojis
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Search</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search emojis..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Emojis ({filteredEmojis.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filteredEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleCopy(emoji)}
                  className="text-3xl p-2 hover:bg-muted rounded-lg transition-colors relative"
                >
                  {emoji}
                  {copied === emoji && (
                    <span className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-lg">
                      <Check className="h-4 w-4 text-green-500" />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}