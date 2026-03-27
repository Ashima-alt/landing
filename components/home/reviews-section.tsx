"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

const reviews = [
  {
    id: 1,
    name: "Елена М.",
    location: "Москва",
    rating: 5,
    text: "Невероятное качество и внимание к деталям. Посуда Valore Milano преобразила наши семейные ужины в настоящие праздники.",
    product: "Set Completo",
  },
  {
    id: 2,
    name: "Александр К.",
    location: "Санкт-Петербург",
    rating: 5,
    text: "Каждая тарелка — произведение искусства. Гости всегда восхищаются нашим столом. Это инвестиция в красоту.",
    product: "Piatto Elegante",
  },
  {
    id: 3,
    name: "Мария В.",
    location: "Милан",
    rating: 5,
    text: "Как итальянка, я знаю цену настоящему качеству. Valore Milano — это подлинное мастерство, которым можно гордиться.",
    product: "Posate Oro",
  },
]

export function ReviewsSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const review = reviews[activeIndex]

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.4em] uppercase">
            Отзывы
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-sage-dark mt-4">
            Что говорят клиенты
          </h2>
          <div className="w-16 h-px bg-gold mx-auto mt-8" />
        </div>

        {/* Review Carousel */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-serif text-xl md:text-2xl text-sage-dark leading-relaxed mb-8 min-h-[100px]">
              {'"'}{review.text}{'"'}
            </blockquote>

            {/* Author */}
            <div className="mb-12">
              <p className="text-sage-dark font-medium">{review.name}</p>
              <p className="text-sage-light text-sm">{review.location}</p>
              <p className="text-gold text-xs tracking-wider uppercase mt-2">
                {review.product}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevReview}
                className="w-12 h-12 rounded-full border border-sage-light hover:border-gold hover:text-gold flex items-center justify-center text-sage transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeIndex ? "bg-gold" : "bg-sage-light"
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextReview}
                className="w-12 h-12 rounded-full border border-sage-light hover:border-gold hover:text-gold flex items-center justify-center text-sage transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
