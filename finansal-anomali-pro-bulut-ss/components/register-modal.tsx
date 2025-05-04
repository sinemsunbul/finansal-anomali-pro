"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Şifreler eşleşmiyor",
        description: "Lütfen şifreleri aynı girdiğinizden emin olun.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Burada gerçek bir kayıt işlemi yapılacak
      // Şimdilik sadece simüle ediyoruz
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Kayıt başarılı",
        description: "Hesabınız oluşturuldu. Giriş yapabilirsiniz.",
      })
      onClose()
    } catch (error) {
      toast({
        title: "Kayıt başarısız",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Kayıt Ol</DialogTitle>
          <DialogDescription>
            Yeni bir hesap oluşturarak finansal anomali tespit sistemini kullanmaya başlayın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ad Soyad" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@sirket.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
