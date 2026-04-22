"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SearchDialog } from "@/components/layout/SearchDialog";
import { CategorySection } from "@/components/layout/ToolCard";
import { getToolsByCategory, type ToolCategory } from "@/config/tools";
import { useLocaleContext } from "@/components/LocaleProvider";

function CategoryMeta() {
  const { locale, t } = useLocaleContext();
  
  const categoryMeta: Record<ToolCategory, { icon: string; name: string; nameZh: string }> = {
    crypto: { icon: "🔐", name: "Crypto", nameZh: "加密" },
    converter: { icon: "🔄", name: "Converter", nameZh: "转换器" },
    web: { icon: "🌐", name: "Web", nameZh: "Web" },
    images: { icon: "🖼️", name: "Images & Videos", nameZh: "图片和视频" },
    development: { icon: "💻", name: "Development", nameZh: "开发" },
    network: { icon: "🌐", name: "Network", nameZh: "网络" },
    math: { icon: "🔢", name: "Math", nameZh: "数学" },
    measurement: { icon: "📏", name: "Measurement", nameZh: "测量" },
    text: { icon: "📝", name: "Text", nameZh: "文本" },
    data: { icon: "💰", name: "Data", nameZh: "数据" },
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

  return (
    <>
      {orderedCategories.map((category) => {
        const categoryTools = getToolsByCategory(category);
        if (categoryTools.length === 0) return null;
        const meta = categoryMeta[category];
        return (
          <CategorySection
            key={category}
            category={category}
            name={locale === "zh" ? meta.nameZh : meta.name}
            icon={meta.icon}
            tools={categoryTools}
          />
        );
      })}
    </>
  );
}

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t } = useLocaleContext();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          <h1 className="text-3xl font-bold mb-2">{t("home.title")}</h1>
          <p className="text-muted-foreground">
            {t("home.subtitle")}
          </p>
        </div>

        {mounted && <CategoryMeta />}

        <footer className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>{t("home.footer")}</p>
        </footer>
      </main>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}