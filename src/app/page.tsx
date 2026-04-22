"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { CategorySection } from "@/components/layout/ToolCard";
import { tools, getToolsByCategory, type ToolCategory } from "@/config/tools";

const categoryMeta: Record<ToolCategory, { icon: string; name: string }> = {
  crypto: { icon: "🔐", name: "Crypto" },
  converter: { icon: "🔄", name: "Converter" },
  web: { icon: "🌐", name: "Web" },
  images: { icon: "🖼️", name: "Images & Videos" },
  development: { icon: "💻", name: "Development" },
  network: { icon: "🌐", name: "Network" },
  math: { icon: "🔢", name: "Math" },
  measurement: { icon: "📏", name: "Measurement" },
  text: { icon: "📝", name: "Text" },
  data: { icon: "💰", name: "Data" },
};

const orderedCategories: ToolCategory[] = [
  "converter",
  "crypto",
  "web",
  "development",
  "network",
  "math",
  "text",
  "images",
  "measurement",
  "data",
];

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen">
      <Header onSearchClick={() => setSearchOpen(true)} />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All the tools</h1>
          <p className="text-muted-foreground">
            Handy online tools for developers
          </p>
        </div>

        {orderedCategories.map((category) => {
          const categoryTools = getToolsByCategory(category);
          if (categoryTools.length === 0) return null;
          const meta = categoryMeta[category];
          return (
            <CategorySection
              key={category}
              category={category}
              name={meta.name}
              icon={meta.icon}
              tools={categoryTools}
            />
          );
        })}

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>DevTools © 2024 | Built with Next.js</p>
        </footer>
      </main>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
