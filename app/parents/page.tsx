import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Родителям — Qalqan",
  description: "Признаки того, что ребёнка вербуют в дропперы, и что ему сказать.",
};

const SIGNS = [
  "Внезапно появились деньги, которые он не может внятно объяснить.",
  "Оформил новую карту Kaspi или просит родителей оформить на них.",
  "Много переписывается в Telegram с «работодателем», нервничает из-за сообщений.",
  "Говорит про «лёгкую удалёнку», «просто принять перевод», «10% с оборота».",
  "Просит никому не рассказывать про новую «подработку».",
  "Резко скрытный про телефон и банковские приложения.",
];

const SAY = [
  {
    dont: "«Ты что, дурак? Тебя разводят!»",
    do: "«Слушай, я не ругаю. Покажи, что за работа — давай вместе глянем, всё ли чисто.»",
    why: "Обвинение закрывает. Союз — открывает.",
  },
  {
    dont: "«Не смей ничего делать в интернете за деньги.»",
    do: "«Заработать — норм. Давай найдём легальный вариант, где не просят твою карту.»",
    why: "Запрет толкает делать тайком. Альтернатива снимает мотивацию рисковать.",
  },
  {
    dont: "«Разберёшься сам, ты уже взрослый.»",
    do: "«Если уже дал карту — это не конец. Сейчас вместе решим, кому позвонить.»",
    why: "Дропперы давят стыдом. Нужно знать, что дома помогут, а не накажут.",
  },
];

export default function ParentsPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-8">
      <section className="py-12 md:py-20">
        <p className="t-label text-[#5FA8A0]">Родителям</p>
        <h1 className="t-heading-lg mt-4 max-w-3xl text-[#F0EBE3]">
          Как понять, что ребёнка вербуют.
        </h1>
        <p className="t-body mt-5 max-w-xl text-[#A39E96]">
          Дропперов ищут среди 16–20-летних: обещают лёгкие деньги, а они
          становятся соучастниками по ст. 232-1 УК РК — до 7 лет. Вот на что
          смотреть и как говорить.
        </p>
      </section>

      <section className="border-t border-[rgba(240,235,227,0.08)] py-14 md:py-16">
        <h2 className="t-heading text-[#F0EBE3]">6 признаков вербовки</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {SIGNS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <span className="t-heading-sm shrink-0 text-[#5FA8A0]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="t-body pt-1 text-[#C8C2B8]">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[rgba(240,235,227,0.08)] py-14 md:py-16">
        <h2 className="t-heading text-[#F0EBE3]">Что сказать вместо ссоры</h2>
        <p className="t-body mt-4 max-w-xl text-[#A39E96]">
          Реакция решает всё. Обвинишь — замкнётся. Поддержишь — успеешь
          остановить.
        </p>
        <div className="mt-10 space-y-6">
          {SAY.map((s, i) => (
            <div key={i} className="grid gap-px bg-[rgba(240,235,227,0.1)] md:grid-cols-2">
              <div className="bg-[#0A0A0B] p-5 md:p-6">
                <p className="t-label text-[#E23D3D]">Не так</p>
                <p className="t-body mt-2 text-[#C8C2B8]">{s.dont}</p>
              </div>
              <div className="bg-[#0A0A0B] p-5 md:p-6">
                <p className="t-label text-[#5FA8A0]">А так</p>
                <p className="t-body mt-2 text-[#C8C2B8]">{s.do}</p>
                <p className="t-caption mt-3 text-[#6B6760]">{s.why}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[rgba(240,235,227,0.08)] py-14 md:py-16">
        <div className="flex flex-col items-start justify-between gap-6 border border-[rgba(240,235,227,0.1)] px-6 py-8 md:flex-row md:items-center md:px-10">
          <div>
            <h2 className="t-heading-sm max-w-xl text-[#F0EBE3]">
              Нашли подозрительную переписку? Проверьте вместе.
            </h2>
            <p className="t-body-sm mt-3 text-[#A39E96]">
              Вставьте сообщение — покажем, схема ли это, простым языком.
            </p>
          </div>
          <Link href="/check" className="btn-primary w-full shrink-0 md:w-auto">
            Открыть проверку
          </Link>
        </div>
      </section>
    </div>
  );
}
