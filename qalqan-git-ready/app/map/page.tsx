import type { Metadata } from "next";
import { ThreatMap } from "@/components/ThreatMap";
import { FlaggedRegistry } from "@/components/FlaggedRegistry";
import { ReportForm } from "@/components/ReportForm";

export const metadata: Metadata = {
  title: "Карта угроз — Qalqan",
  description: "Живая карта активных мошеннических схем по регионам Казахстана.",
};

export default function MapPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 md:px-8">
      <section className="py-12 md:py-20">
        <p className="t-label text-[#5FA8A0]">Карта угроз · живая</p>
        <h1 className="t-heading-lg mt-4 max-w-3xl text-[#F0EBE3]">
          Где в Казахстане прямо сейчас вербуют.
        </h1>
        <p className="t-body mt-5 max-w-xl text-[#A39E96]">
          Каждая проверка и каждый репорт становятся точкой. Размер — сколько
          сигналов, цвет — какая схема. Обновляется в реальном времени.
        </p>

        <div className="mt-12">
          <ThreatMap />
        </div>
      </section>

      <section className="border-t border-[rgba(240,235,227,0.08)] py-16 md:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="t-label text-[#5FA8A0]">Народный реестр</p>
          <h2 className="t-heading mt-4 text-[#F0EBE3]">
            Проверь реквизит по засвеченным.
          </h2>
          <p className="t-body mt-4 text-[#A39E96]">
            База карт, кошельков, телефонов и ников, на которые уже жаловались.
          </p>
        </div>
        <FlaggedRegistry />
      </section>

      <section className="border-t border-[rgba(240,235,227,0.08)] py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="t-label text-[#5FA8A0]">Сообщить о схеме</p>
            <h2 className="t-heading mt-4 text-[#F0EBE3]">
              Столкнулся сам? Предупреди других.
            </h2>
            <p className="t-body mt-4 max-w-md text-[#A39E96]">
              Анонимно. Сигнал попадёт на карту и в реестр — кто-то в твоём городе
              не поведётся на ту же схему.
            </p>
          </div>
          <ReportForm />
        </div>
      </section>
    </div>
  );
}
