const JOBS = [
  {
    title: "enbek.kz",
    tag: "Госпортал труда",
    desc: "Официальные вакансии и подработки, молодёжная практика, субсидируемые места.",
    href: "https://www.enbek.kz",
  },
  {
    title: "«Жасыл Ел»",
    tag: "Сезонная занятость",
    desc: "Оплачиваемые студенческие и экологические отряды с официальным оформлением.",
    href: null,
  },
  {
    title: "Freelance-биржи",
    tag: "Удалёнка по навыку",
    desc: "Дизайн, тексты, переводы, монтаж — платят за работу, а не за «прогон» через карту.",
    href: null,
  },
  {
    title: "Молодёжные центры",
    tag: "Оффлайн в городе",
    desc: "Помогают с первой легальной подработкой, стажировками и документами.",
    href: null,
  },
];

export function LegalAlternatives() {
  return (
    <div className="alt-grid stagger">
      {JOBS.map((j) => {
        const inner = (
          <>
            <p className="t-label text-[#6AACA4]">{j.tag}</p>
            <p className="t-subheading mt-3 text-[#F3EFE6]">{j.title}</p>
            <p className="t-body-sm mt-3 max-w-sm text-[#9E998F]">{j.desc}</p>
            {j.href && (
              <span className="t-label mt-6 inline-block text-[#6AACA4]">
                Открыть ↗
              </span>
            )}
          </>
        );

        return j.href ? (
          <a
            key={j.title}
            href={j.href}
            target="_blank"
            rel="noopener noreferrer"
            className="alt-grid__item"
          >
            {inner}
          </a>
        ) : (
          <div key={j.title} className="alt-grid__item">
            {inner}
          </div>
        );
      })}
    </div>
  );
}
