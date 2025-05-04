"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ShieldAlert, LogIn, UserPlus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import LoginModal from "./login-modal"
import RegisterModal from "./register-modal"

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const { toast } = useToast()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-primary">Finansal Anomali Tespit Sistemi</h1>
        </Link>

        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => setShowLoginModal(true)}>
            <LogIn className="mr-2 h-4 w-4" />
            Giriş Yap
          </Button>
          <Button size="sm" onClick={() => setShowRegisterModal(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Kayıt Ol
          </Button>
          <ModeToggle />
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <RegisterModal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)} />
    </header>
  )
}
