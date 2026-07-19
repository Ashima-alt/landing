"use client"

import { useCallback, useEffect, useState, type MouseEvent } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import type { ProductImage } from "@/lib/types"
import { mediaUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: ProductImage[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: images.length > 1,
    dragFree: false,
    align: "start",
  })
  const [selected, setSelected] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    const viewport = emblaApi?.rootNode()
    if (!viewport || images.length < 2) return

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      event.preventDefault()
      if (event.deltaY > 0) emblaApi.scrollNext()
      else emblaApi.scrollPrev()
    }

    viewport.addEventListener("wheel", onWheel, { passive: false })
    return () => viewport.removeEventListener("wheel", onWheel)
  }, [emblaApi, images.length])

  const onMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!emblaApi || images.length < 2) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
    const next = Math.min(
      images.length - 1,
      Math.floor((x / rect.width) * images.length)
    )
    if (next !== emblaApi.selectedScrollSnap()) {
      emblaApi.scrollTo(next)
    }
  }

  if (!images.length) {
    return (
      <div className="relative aspect-square overflow-hidden bg-cream-dark animate-fade-in">
        <div className="absolute inset-0 flex items-center justify-center text-sage-light text-sm tracking-widest uppercase">
          Нет фото
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
      <div
        className="overflow-hidden bg-cream-dark cursor-ew-resize touch-pan-y"
        ref={emblaRef}
        onMouseMove={onMouseMove}
      >
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="relative min-w-0 flex-[0_0_100%] aspect-square"
            >
              <Image
                src={mediaUrl(image.url)}
                alt={`${title} — фото ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className="flex gap-1.5 mb-1">
            {images.map((image, i) => (
              <span
                key={image.id}
                className={cn(
                  "h-0.5 flex-1 transition-colors",
                  i === selected ? "bg-gold" : "bg-border"
                )}
              />
            ))}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden bg-cream-dark transition-all duration-300",
                  selected === index
                    ? "ring-1 ring-gold opacity-100"
                    : "opacity-55 hover:opacity-100"
                )}
              >
                <Image
                  src={mediaUrl(image.url)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
