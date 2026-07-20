import Link from "next/link";
import { GlowyWavesHero } from "@/components/GlowyWavesHero";
import { FilmStage } from "@/components/FilmStage";
import { Chapter } from "@/components/Chapter";
import { LegalAlternatives } from "@/components/LegalAlternatives";
import { ActRail } from "@/components/ActRail";
import { StickyCheck } from "@/components/StickyCheck";
import { FILMS } from "@/lib/films";

export default function Home() {
  return (
    <div>
      {/* 1) Glowy Waves Hero + live metrics */}
      <GlowyWavesHero />
      <ActRail />
      <StickyCheck />

      {/* 2) Four full-viewport video reels with text in the recess */}
      <div id="films">
        {FILMS.map((film, i) => (
          <FilmStage key={film.id} film={film} priority={i === 0} />
        ))}
      </div>

      {/* 3) Alternatives + tool CTA */}
      <div className="border-t border-[rgba(243,239,230,0.08)] bg-[#0A0A0C]">
        <Chapter act="OUTRO" label="Вместо схемы" id="act-alt">
          <div className="mb-12 max-w-2xl md:mb-16">
            <h2 id="act-alt-title" className="t-heading text-[#F3EFE6]">
              Мы не говорим только «нет».
              <br />
              Показываем, где можно по-честному.
            </h2>
            <p className="t-body mt-5 text-[#9E998F]">
              enbek.kz, «Жасыл Ел», freelance, молодёжные центры — без чужих
              карт и «процентов за перевод».
            </p>
          </div>
          <LegalAlternatives />
        </Chapter>
      </div>

      <Chapter act="TOOL" label="Инструмент" id="act-tool" className="!pb-24 md:!pb-32">
        <div className="coda flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-lg">
            <p className="t-label mb-4 text-[#6AACA4]">Проверка</p>
            <h2 id="act-tool-title" className="t-heading text-[#F3EFE6]">
              Готов? Проверь сообщение.
            </h2>
            <p className="t-body mt-4 text-[#9E998F]">
              Инструмент на отдельной странице. Без регистрации.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/check" className="btn-primary w-full sm:w-auto">
              Открыть проверку
            </Link>
            <Link
              href="/map"
              className="btn-ghost justify-center py-3 sm:justify-start"
            >
              Карта угроз →
            </Link>
          </div>
        </div>
      </Chapter>
    </div>
  );
}
