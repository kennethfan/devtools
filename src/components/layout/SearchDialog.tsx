"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { tools, Tool } from "@/config/tools";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<Tool[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const fuse = React.useMemo(
    () =>
      new Fuse(tools, {
        keys: ["name", "description"],
        threshold: 0.3,
      }),
    []
  );

  React.useEffect(() => {
    if (query) {
      const searchResults = fuse.search(query).map((r) => r.item);
      setResults(searchResults.slice(0, 10));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query, fuse]);

  const handleSelect = (tool: Tool) => {
    router.push(`/tools/${tool.id}`);
    onOpenChange(false);
    setQuery("");
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, results, selectedIndex]);

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-[500px]">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools..."
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto p-1">
          {results.map((tool, index) => (
            <button
              key={tool.id}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent"
              }`}
              onClick={() => handleSelect(tool)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="text-lg">{tool.category === "crypto" ? "🔐" : "🔄"}</span>
              <div className="text-left">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs text-muted-foreground">
                  {tool.description}
                </div>
              </div>
            </button>
          ))}
          {query && results.length === 0 && (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No tools found for "{query}"
            </div>
          )}
        </div>
        <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <kbd className="rounded border bg-muted px-1.5 py-0.5">↑↓</kbd>
            <span>navigate</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5">↵</kbd>
            <span>select</span>
            <kbd className="rounded border bg-muted px-1.5 py-0.5">esc</kbd>
            <span>close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
