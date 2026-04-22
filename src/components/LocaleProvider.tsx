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
    "common.error": "Error",
    "common.success": "Success",
    "common.compare": "Compare",
    "common.format": "Format",
    "common.minify": "Minify",
    "common.validate": "Validate",
    "common.encode": "Encode",
    "common.decode": "Decode",
    "common.encrypt": "Encrypt",
    "common.decrypt": "Decrypt",
    "common.calculate": "Calculate",
    "common.convert": "Convert",
    "common.parse": "Parse",
    "common.test": "Test",
    "common.paste": "Paste",
    "common.pasteHere": "Paste here...",
    "common.placeholder": "Enter or paste text...",
    "common.characters": "characters",
    "common.words": "words",
    "common.lines": "lines",
    "tool.input": "Input",
    "tool.output": "Output",
    "tool.result": "Result",
    "tool.configuration": "Configuration",
    "tool.inputYaml": "Input YAML",
    "tool.inputJson": "Input JSON",
    "tool.inputText": "Input Text",
    "tool.leftOriginal": "Original (Left)",
    "tool.rightModified": "Modified (Right)",
    "tool.useResult": "Use Result",
    "tool.noDifferences": "No differences",
    "tool.invalidJson": "Error comparing JSON. Make sure both inputs are valid JSON.",
    "tool.dockerCommand": "Docker Command",
    "tool.generateCompose": "Generate Docker Compose",
    "tool.cronExpression": "Cron Expression",
    "tool.cronDescription": "Description",
    "tool.nextRuns": "Next Run Times",
    "tool.presets": "Presets",
    "tool.custom": "Custom",
    "home.title": "All the tools",
    "home.subtitle": "Handy online tools for developers",
    "home.footer": "DevTools © 2024 | Built with Next.js",
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
    "common.error": "错误",
    "common.success": "成功",
    "common.compare": "比较",
    "common.format": "格式化",
    "common.minify": "压缩",
    "common.validate": "验证",
    "common.encode": "编码",
    "common.decode": "解码",
    "common.encrypt": "加密",
    "common.decrypt": "解密",
    "common.calculate": "计算",
    "common.convert": "转换",
    "common.parse": "解析",
    "common.test": "测试",
    "common.paste": "粘贴",
    "common.pasteHere": "在此粘贴...",
    "common.placeholder": "输入或粘贴文本...",
    "common.characters": "字符",
    "common.words": "词",
    "common.lines": "行",
    "tool.input": "输入",
    "tool.output": "输出",
    "tool.result": "结果",
    "tool.configuration": "配置",
    "tool.inputYaml": "输入 YAML",
    "tool.inputJson": "输入 JSON",
    "tool.inputText": "输入文本",
    "tool.leftOriginal": "原始 (左侧)",
    "tool.rightModified": "修改后 (右侧)",
    "tool.useResult": "使用结果",
    "tool.noDifferences": "无差异",
    "tool.invalidJson": "比较 JSON 错误，请确保两个输入都是有效的 JSON。",
    "tool.dockerCommand": "Docker 命令",
    "tool.generateCompose": "生成 Docker Compose",
    "tool.cronExpression": "Cron 表达式",
    "tool.cronDescription": "描述",
    "tool.nextRuns": "下次运行时间",
    "tool.presets": "预设",
    "tool.custom": "自定义",
    "home.title": "所有工具",
    "home.subtitle": "开发者必备在线工具集",
    "home.footer": "DevTools © 2024 | 基于 Next.js 构建",
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