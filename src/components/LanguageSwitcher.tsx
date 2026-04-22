"use client";

import { useLocaleContext } from "./LocaleProvider";
import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors">
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">EN</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        const newLocale = locale === "en" ? "zh" : "en";
        setLocale(newLocale);
        console.log("Language switched to:", newLocale);
      }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
      title={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{locale === "en" ? "EN" : "中文"}</span>
    </button>
  );
}