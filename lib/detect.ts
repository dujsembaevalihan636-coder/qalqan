import type { AccountKind } from "./types";

// Определить тип реквизита по строке (карта / телефон / ник / кошелёк).
export function detectKind(raw: string): AccountKind {
  const v = raw.trim();
  const digits = v.replace(/\D/g, "");
  if (/^@/.test(v) || /t\.me\//i.test(v)) return "telegram";
  if (/instagram|insta|ig\b/i.test(v)) return "instagram";
  if (/^\+?7?\s*7?\d{9,10}$/.test(digits) && digits.length >= 10 && digits.length <= 11 && /^[78]?7/.test(digits))
    return "phone";
  if (digits.length >= 15 && digits.length <= 19) return "card";
  if (/^(0x|T|bc1|[13])[a-zA-Z0-9]{20,}/.test(v) || /usdt|btc|eth|trc20|erc20|wallet/i.test(v))
    return "wallet";
  if (digits.length >= 10 && digits.length <= 12) return "phone";
  return "telegram";
}

// Похоже ли на реквизит (а не на текст сообщения)?
export function looksLikeAccount(raw: string): boolean {
  const v = raw.trim();
  if (v.length > 60) return false;
  if (/\s/.test(v) && !/^[\d\s+()-]+$/.test(v)) {
    // есть пробелы и это не форматированный номер карты/телефона
    return /^@?\S+$/.test(v) === false ? false : true;
  }
  return true;
}
