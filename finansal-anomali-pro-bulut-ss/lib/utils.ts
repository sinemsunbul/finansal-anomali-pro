import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Account } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Puan hesaplama fonksiyonu
export function calculateScore(item: Account): number {
  let score = 0
  if (item.transfer_tutari < 100) score += 2
  if (item.hesap_turu === "E-cüzdan" || item.hesap_turu === "Kripto") score += 4

  if (isGeceTransfer(item.transfer_saati)) score += 2

  if (item["kara listede hesap"] === "var") score += 4
  if (Number.parseInt(item["Yurt dışı transfer büyüklüğü"]) > 2500) score += 3
  if (Number.parseInt(item["Ters İbraz Oranı"]) > 50) score += 4

  if (
    Number.parseFloat(item["Hesap Bakiyesi"]) + Number.parseFloat(item["Hesap Bakiyesi"]) / 2 <
    Number.parseFloat(item["Kredi Kartı Harcama"])
  )
    score += 2

  return score
}

// Risk seviyesi belirleme
export function getRiskLevel(score: number): "high" | "medium" | "low" {
  if (score >= 9) return "high"
  if (score >= 6) return "medium"
  return "low"
}

// Gece transferi kontrolü
export function isGeceTransfer(transferZamani: string): boolean {
  const saat = Number.parseInt(transferZamani.split(" ")[1].split(":")[0])
  return saat < 6 || saat > 22
}
