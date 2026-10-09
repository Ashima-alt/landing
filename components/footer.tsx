import Link from "next/link"

export function Footer() {
  return (
    <footer id="contact" className="vm-footer">
      <div className="vm-shell py-14 md:py-20">
        <div className="vm-footer-grid">
          <div>
            <Link href="/" className="inline-block">
              <span className="font-serif text-lg sm:text-xl tracking-[0.24em] uppercase">
                Valore Milano
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-cream/75 text-sm leading-loose">
              Посуда и аксессуары для кухни и сервировки. Внимание к деталям каждый день.
            </p>
          </div>

          <nav aria-label="Навигация в подвале">
            <h2 className="vm-footer-title">
              Навигация
            </h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/catalog" className="inline-block py-1 text-cream/80">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/#about" className="inline-block py-1 text-cream/80">
                  О бренде
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="vm-footer-title">
              Контакты
            </h2>
            <ul className="space-y-3 text-sm text-cream/80 leading-loose">
              <li>Грозный, Россия</li>
              <li>+7 (938) 000‑00‑00</li>
              <li className="break-words">info@example.ru</li>
            </ul>
          </div>
        </div>

        <div className="vm-footer-bottom">
          <p className="text-cream/70 text-xs leading-relaxed">
            © {new Date().getFullYear()} Valore Milano. Все права защищены.
          </p>
          <a href="#top" className="inline-flex items-center gap-2 py-2 text-xs text-cream/80">
            Наверх
            <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
