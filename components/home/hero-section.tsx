"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { CSSProperties } from "react"
import { homeHeroImage } from "@/lib/home-presentation"

export function HeroSection() {
  return (
    <section id="top" className="vm-hero">
      <div className="vm-shell vm-hero-grid">
        <div className="vm-hero-copy">
          <div className="vm-rule mb-4 md:mb-7" aria-hidden="true" />
          <h1 className="vm-display">
            Красота
            <br />
            каждого дня
          </h1>
          <p className="vm-body vm-hero-description">
            Посуда и аксессуары для кухни и сервировки.
            Простые формы. Внимание к деталям.
          </p>
          <Link href="/catalog" className="vm-button">
            Смотреть каталог
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div
          className="vm-hero-media"
          style={{
            "--hero-fit": homeHeroImage.fit,
            "--hero-desktop-ratio": homeHeroImage.desktopRatio,
            "--hero-mobile-ratio": homeHeroImage.mobileRatio,
            "--hero-desktop-position": homeHeroImage.desktopPosition,
            "--hero-mobile-position": homeHeroImage.mobilePosition,
          } as CSSProperties}
        >
          <Image
            src={homeHeroImage.src}
            alt={homeHeroImage.alt}
            fill
            priority
            className="vm-hero-photo"
            sizes="(max-width: 389px) 72vw, (max-width: 767px) 280px, (max-width: 1440px) 55vw, 720px"
          />
        </div>
      </div>
    </section>
  )
}
