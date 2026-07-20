// Full-viewport reels. Text sits in the video's designed "recess" (safe plate).

export type Recess =
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "left"
  | "right";

export type Film = {
  id: string;
  act: string;
  label: string;
  src: string;
  title: string;
  titleLine2?: string;
  body: string;
  points?: string[];
  /** Where the dark/empty recess is in the frame for overlay text */
  recess: Recess;
};

export const FILMS: Film[] = [
  {
    id: "act-recruit",
    act: "01",
    label: "Вербовка",
    src: "/videos/01-recruit.mp4",
    title: "Тебя вербуют.",
    titleLine2: "Тихо. В чате.",
    body: "«Лёгкий заработок», «прими перевод», «перекинь дальше» — так подростков втягивают в дропперство.",
    points: [
      "Обещают 10% «просто за карту»",
      "Давят: «только сегодня»",
      "Просят молчать",
    ],
    recess: "bottom-left",
  },
  {
    id: "act-flags",
    act: "02",
    label: "Красные флаги",
    src: "/videos/02-flags.mp4",
    title: "У схемы всегда",
    titleLine2: "есть запах.",
    body: "Просят карту, код из SMS или «просто принять и перевести» — это не подработка. Это чужое преступление через тебя.",
    points: [
      "Чужие деньги на твоей карте",
      "«Служба безопасности» в чате",
      "Гарантированный процент",
    ],
    recess: "bottom-right",
  },
  {
    id: "act-cost",
    act: "03",
    label: "Цена",
    src: "/videos/03-consequences.mp4",
    title: "5 000 ₸ сегодня.",
    titleLine2: "До 7 лет потом.",
    body: "Ст. 232-1 УК РК. Дропперство — уголовная ответственность, блокировка карты, судимость.",
    points: [
      "Счёт и карта под ударом",
      "Дело — не «разберёмся»",
      "Стыд — часть схемы",
    ],
    recess: "bottom-left",
  },
  {
    id: "act-shield",
    act: "04",
    label: "Щит",
    src: "/videos/04-shield.mp4",
    title: "Есть щит.",
    titleLine2: "Им можно пользоваться.",
    body: "Проверка сообщения, красные флаги, коллективная карта угроз по Казахстану. Спокойно. По делу.",
    points: [
      "Мгновенный вердикт",
      "Реквизиты по базе",
      "Сигналы по регионам",
    ],
    recess: "bottom-center",
  },
];
