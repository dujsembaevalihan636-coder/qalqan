import type { Metadata } from "next";
import Link from "next/link";
import { Checker } from "@/components/Checker";

export const metadata: Metadata = {
  title: "Проверка — Qalqan",
  description:
    "Проверь подозрительное сообщение или реквизит. Красные флаги и вопросы до согласия.",
};

export default function CheckPage() {
  return (
    <div className="mx-auto max-w-[920px] px-5 pb-24 pt-24 md:px-8 md:pt-28">
      <div className="mb-10 max-w-xl">
        <p className="t-label text-[#6AACA4]">Инструмент</p>
        <h1 className="t-heading mt-4 text-[#F3EFE6]">
          Проверь сообщение
          <br />
          <span className="text-[#9E998F]">или реквизит.</span>
        </h1>
        <p className="t-body mt-5 text-[#9E998F]">
          Без регистрации. Без хранения переписки. Вердикт, красные флаги и
          вопросы, которые стоит задать.
        </p>
        <Link href="/" className="btn-ghost mt-6 inline-flex text-[13px]">
          ← К истории
        </Link>
      </div>

      <div className="check-stage">
        <div className="check-stage__chrome">
          <span>Qalqan · Analyze</span>
          <span className="check-stage__chrome-dot" />
          <span>Anonymous</span>
        </div>
        <Checker />
      </div>

      <div className="mt-10 flex flex-col gap-3 border border-[rgba(226,61,61,0.3)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-body-sm text-[#C8C2B8]">
          Уже отдал карту или сделал перевод по схеме?
        </p>
        <Link
          href="/emergency"
          className="btn-primary shrink-0 !bg-[#E23D3D] !text-white"
        >
          Я уже дал карту
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-[13px]">
        <Link href="/am-i-dropper" className="btn-ghost">
          Не дроппер ли я уже? →
        </Link>
        <Link href="/shield" className="btn-ghost">
          Щит-профиль →
        </Link>
        <Link href="/statement" className="btn-ghost">
          Заявление →
        </Link>
      </div>

      <p className="t-caption mt-8 max-w-md text-[#5C5852]">
        Это ориентир, не юридическая консультация. В беде — АФМ 1424, полиция
        102.
      </p>
    </div>
  );
}
