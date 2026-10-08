"use client"

import Image from "next/image"

export function LifestyleSection() {
  return (
    <section id="about" className="pt-4 pb-20 md:pt-8 md:pb-28 bg-cream scroll-mt-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-20">
          <div className="max-w-md">
            <h2 className="font-serif text-3xl md:text-4xl text-sage-dark leading-tight text-balance mb-6">
              Продумано для повседневной жизни
            </h2>
            <p className="text-sage text-base leading-relaxed">
              Valore Milano — посуда и аксессуары для кухни и сервировки.
              Мы ценим простые формы, удобство в повседневных делах и красоту деталей.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/lifestyle-dining.jpg"
              alt="Атмосфера сервировки стола"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
