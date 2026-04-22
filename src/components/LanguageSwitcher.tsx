"use client";

import { useLocaleContext } from "./LocaleProvider";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocaleContext();

  return (
    <button
      onClick={() => setLocale(locale === "en" ? "zh" : "en")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
      title={locale === "en" ? "切换到中文" : "Switch to English"}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">{locale === "en" ? "EN" : "中文"}</span>
    </button>
  );
}