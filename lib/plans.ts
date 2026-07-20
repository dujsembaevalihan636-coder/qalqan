export type PlanId = "parents" | "students" | "seniors";

export type Plan = {
  id: PlanId;
  titleKey: string;
  descKey: string;
  priceKey: string;
  accent: string;
};

export const PLANS: Plan[] = [
  {
    id: "parents",
    titleKey: "sub.parents",
    descKey: "sub.parents.desc",
    priceKey: "sub.price.parents",
    accent: "#6AACA4",
  },
  {
    id: "students",
    titleKey: "sub.students",
    descKey: "sub.students.desc",
    priceKey: "sub.price.students",
    accent: "#C9A227",
  },
  {
    id: "seniors",
    titleKey: "sub.seniors",
    descKey: "sub.seniors.desc",
    priceKey: "sub.price.seniors",
    accent: "#A39E96",
  },
];

export const REVIEWS = [
  {
    who: { ru: "Айгуль, мама, Алматы", kz: "Айгүл, ана, Алматы" },
    text: {
      ru: "После сводки сын сам показал переписку «про 10%». Не ругались — просто проверили вместе.",
      kz: "Жиынтықтан кейін балам өзі «10%» сөйлесуін көрсетті. Ұрыспадық — бірге тексердік.",
    },
  },
  {
    who: { ru: "Данияр, 19, Астана", kz: "Данияр, 19, Астана" },
    text: {
      ru: "Думал, «просто подработка». Красный вердикт и вопросы отрезвили за минуту.",
      kz: "«Жай ғана қосымша жұмыс» деп ойладым. Қызыл үкім мен сұрақтар бір минутта ақылға қондырды.",
    },
  },
  {
    who: { ru: "Серик, дедушка", kz: "Серік, ата" },
    text: {
      ru: "Внучке объяснили про «код из SMS» простым языком. Скидка для пенсионеров — уважение.",
      kz: "Немереге «SMS код» туралы қарапайым тілмен түсіндірдік. Зейнеткер жеңілдігі — құрмет.",
    },
  },
];

/** Демо-метрика «спасённых» — продуктовый якорь, не audit log */
export const SAVED_SIGNALS = 12840;
