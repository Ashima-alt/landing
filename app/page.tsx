"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedProducts } from "@/components/home/featured-products"
import { AboutSection } from "@/components/home/about-section"
import { CategoriesSection } from "@/components/home/categories-section"
import { LifestyleSection } from "@/components/home/lifestyle-section"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <AboutSection />
        <CategoriesSection />
        <LifestyleSection />
      </main>
      <Footer />
    </div>
  )
}
