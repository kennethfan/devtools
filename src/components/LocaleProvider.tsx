"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Locale = "en" | "zh";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "common.back": "Back",
    "common.copy": "Copy",
    "common.copied": "Copied!",
    "common.download": "Download",
    "common.generate": "Generate",
    "common.clear": "Clear",
    "common.reset": "Reset",
    "common.settings": "Settings",
    "tool.input": "Input",
    "tool.output": "Output",
    "tool.result": "Result",
    "tool.configuration": "Configuration",
  },
  zh: {
    "common.back": "返回",
    "common.copy": "复制",
    "common.copied": "已复制!",
    "common.download": "下载",
    "common.generate": "生成",
    "common.clear": "清空",
    "common.reset": "重置",
    "common.settings": "设置",
    "tool.input": "输入",
    "tool.output": "输出",
    "tool.result": "结果",
    "tool.configuration": "配置",
  },
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale;
    if (saved && (saved === "en" || saved === "zh")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations.en] || key;
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return context;
}