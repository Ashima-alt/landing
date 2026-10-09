"use client"

export function LifestyleSection() {
  return (
    <section id="about" className="vm-story bg-cream">
      <div className="vm-shell">
        <div className="vm-story-grid">
          <figure className="vm-brand-plate" aria-label="Valore Milano">
            <div className="vm-brand-mark" aria-hidden="true" />
          </figure>
          <div className="vm-story-copy">
            <p className="vm-eyebrow">Философия Valore Milano</p>
            <h2 className="vm-heading">
              Ценность в каждой детали
            </h2>
            <p className="vm-body">
              Valore в переводе с итальянского означает «ценность».
              Для нас это слово объединяет внимание к качеству,
              эстетике и удобству повседневной жизни.
            </p>
            <p className="vm-body">
              Нам близки сдержанная итальянская эстетика, спокойные формы
              и выразительные детали. Мы смотрим на кухню и сервировку
              как на часть дома — пространство привычных ритуалов,
              встреч и времени, проведённого вместе.
            </p>
            <p className="vm-story-signoff">
              Дизайн как искусство повседневной жизни.
            </p>
          </div>
        </div>
        <div className="vm-principles">
          <div className="vm-principle">
            <h3>Качество</h3>
            <p>Внимание к материалам и деталям — основа нашего подхода к продукции.</p>
          </div>
          <div className="vm-principle">
            <h3>Эстетика</h3>
            <p>Гармония форм и сдержанный стиль, вдохновлённый итальянским дизайном.</p>
          </div>
          <div className="vm-principle">
            <h3>Ценность</h3>
            <p>Красота и удобство в привычных вещах, которые сопровождают каждый день.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
