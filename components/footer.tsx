import Link from "next/link"

export function Footer() {
  return (
    <footer id="contact" className="bg-brand-blue text-cream scroll-mt-24">
      <div className="container mx-auto px-6 lg:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr] gap-10 lg:gap-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-lg sm:text-xl tracking-[0.24em] uppercase">
                Valore Milano
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-cream/70 text-sm leading-relaxed">
              Посуда и аксессуары для кухни и сервировки. Внимание к деталям каждый день.
            </p>
          </div>

          <nav aria-label="Навигация в подвале">
            <h2 className="text-xs tracking-widest uppercase mb-5 text-brand-yellow">
              Навигация
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/catalog" className="text-cream/75 hover:text-brand-yellow transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-cream/75 hover:text-brand-yellow transition-colors">
                  О бренде
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs tracking-widest uppercase mb-5 text-brand-yellow">
              Контакты
            </h2>
            <ul className="space-y-3 text-sm text-cream/75">
              <li>Грозный, Россия</li>
              <li>+7 (938) 000‑00‑00</li>
              <li className="break-words">info@example.ru</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 md:mt-12 pt-6 border-t border-cream/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-cream/60 text-xs leading-relaxed">
            © {new Date().getFullYear()} Valore Milano. Все права защищены.
          </p>
          <a href="#top" className="inline-flex items-center gap-2 py-1 text-xs text-cream/70 hover:text-brand-yellow transition-colors">
            Наверх
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
