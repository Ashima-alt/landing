"use client"

import { useCallback, useEffect, useState, type PointerEvent } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { X, ZoomIn, ZoomOut } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  const [isHoverZoomed, setIsHoverZoomed] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isViewerZoomed, setIsViewerZoomed] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelected(emblaApi.selectedScrollSnap())
    setIsHoverZoomed(false)
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
    if (!emblaApi) return
    const viewport = emblaApi.rootNode()
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

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.buttons !== 0 || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = Math.min(100, Math.max(0, ((event.clientX - rect.left) / rect.width) * 100))
    const y = Math.min(100, Math.max(0, ((event.clientY - rect.top) / rect.height) * 100))
    event.currentTarget.style.setProperty("--gallery-x", `${x}%`)
    event.currentTarget.style.setProperty("--gallery-y", `${y}%`)
    setIsHoverZoomed(true)
  }

  if (!images.length) {
    return (
      <div className="relative aspect-square overflow-hidden bg-white animate-fade-in">
        <div className="absolute inset-0 flex items-center justify-center vm-meta">
          Нет фото
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isViewerOpen} onOpenChange={(open) => {
      setIsViewerOpen(open)
      setIsHoverZoomed(false)
      setIsViewerZoomed(false)
    }}>
    <div className="vm-product-gallery space-y-5 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
      <div className="relative">
      <div
        className="vm-gallery-stage overflow-hidden bg-white touch-pan-y"
        ref={emblaRef}
        data-zoomed={isHoverZoomed}
        onPointerEnter={onPointerMove}
        onPointerMove={onPointerMove}
        onPointerLeave={() => setIsHoverZoomed(false)}
        onPointerCancel={() => setIsHoverZoomed(false)}
        onPointerDown={() => setIsHoverZoomed(false)}
      >
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="product-card-media relative min-w-0 flex-[0_0_100%] aspect-square overflow-hidden"
              data-selected={selected === index}
            >
              <div className="vm-gallery-image-layer">
              <Image
                src={mediaUrl(image.url)}
                alt={`${title} — фото ${index + 1}`}
                fill
                priority={index === 0}
                className="object-contain object-center p-3"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              </div>
            </div>
          ))}
        </div>
      </div>
      <DialogTrigger asChild>
        <button type="button" className="vm-gallery-control vm-gallery-open" aria-label={`Увеличить фото ${selected + 1}: ${title}`}>
          <ZoomIn className="size-5" aria-hidden="true" />
        </button>
      </DialogTrigger>
      </div>

      {images.length > 1 && (
        <>
          <div className="flex gap-1.5 mb-1">
            {images.map((image, i) => (
              <span
                key={image.id}
                className={cn(
                  "h-0.5 flex-1 transition-colors",
                  i === selected ? "bg-primary" : "bg-border"
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
                aria-label={`Показать фото ${index + 1}: ${title}`}
                aria-pressed={selected === index}
                className={cn(
                  "relative h-20 w-20 flex-shrink-0 overflow-hidden bg-white transition-opacity duration-300",
                  selected === index
                    ? "ring-1 ring-primary opacity-100"
                    : "opacity-65 hover:opacity-100"
                )}
              >
                <Image
                  src={mediaUrl(image.url)}
                  alt=""
                  fill
                  className="object-contain object-center p-1"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
      <DialogContent className="vm-gallery-dialog flex flex-col w-[calc(100%-2rem)] max-w-none sm:max-w-[min(1100px,calc(100%-4rem))] gap-0 rounded-none border-0 p-0 shadow-none" showCloseButton={false} aria-describedby={undefined}>
        <DialogTitle className="sr-only">{title} — фото {selected + 1}</DialogTitle>
        <div className="flex shrink-0 items-center justify-between gap-3 px-3 py-2">
          <span className="vm-meta">Фото {selected + 1} из {images.length}</span>
          <div className="flex items-center gap-1">
            <button type="button" className="vm-gallery-control" aria-label={isViewerZoomed ? "Уменьшить фото" : "Приблизить фото"} aria-pressed={isViewerZoomed} onClick={() => setIsViewerZoomed((zoomed) => !zoomed)}>
              {isViewerZoomed ? <ZoomOut className="size-5" aria-hidden="true" /> : <ZoomIn className="size-5" aria-hidden="true" />}
            </button>
            <DialogClose asChild>
              <button type="button" className="vm-gallery-control" aria-label="Закрыть просмотр фото"><X className="size-5" aria-hidden="true" /></button>
            </DialogClose>
          </div>
        </div>
        <div className="vm-gallery-viewer" data-zoomed={isViewerZoomed} tabIndex={0} role="region" aria-label="Фотография товара, при увеличении доступна прокрутка">
          <div className="vm-gallery-viewer-canvas product-card-media relative">
            <Image src={mediaUrl((images[selected] ?? images[0]).url)} alt={`${title} — фото ${selected + 1}`} fill className="object-contain object-center p-3" sizes="1100px" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
