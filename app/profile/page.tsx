"use client"

import { StoreProvider } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileContent } from "@/components/profile/profile-content"

export default function ProfilePage() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-cream">
        <Header />
        <main className="pt-24 md:pt-32">
          <ProfileContent />
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}
