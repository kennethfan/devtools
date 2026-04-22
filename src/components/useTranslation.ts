"use client";

import { useLocaleContext } from "./LocaleProvider";

export function useTranslation() {
  const { t, locale } = useLocaleContext();
  return { t, locale };
}