import type { Dict, Lang } from "./types";

const ru: Dict = {
  // nav
  "nav.home": "Главная",
  "nav.story": "История",
  "nav.check": "Проверка",
  "nav.map": "Карта",
  "nav.parents": "Родителям",
  "nav.shield": "Щит",
  "nav.stories": "Истории",
  "nav.subscribe": "Подписка",
  "nav.emergency": "Экстренно",
  "nav.enter": "Enter",
  "nav.account": "Профиль",
  "nav.menu": "Меню",
  "hero.kicker": "Қалқан · цифровой щит",
  "hero.title1": "Тебя вербуют.",
  "hero.title2": "Не отдавай карту.",
  "hero.sub": "Проверь сообщение за секунды. Живая карта угроз по Казахстану. Спокойно. По делу.",
  "hero.cta.check": "Проверить сообщение",
  "hero.cta.watch": "Смотреть истории →",
  "hero.metric.checks": "Схем в системе",
  "hero.metric.stopped": "Вовремя остановились",
  "hero.metric.regions": "Регионов на карте",
  "hero.metric.red": "Красных сигналов",
  "sub.featured": "Для родителей",
  "sub.f1": "Проверки без лимита",
  "sub.f2": "Сводка угроз по городу",
  "sub.f3": "Чек-листы для разговора с ребёнком",
  "sub.f4": "Студенческий доступ",
  "sub.f5": "Карта угроз",
  "sub.f6": "Упрощённые предупреждения",
  "nav.close": "Закрыть",

  // footer
  "footer.tagline":
    "Цифровой щит против дропперских схем и финансовых пирамид. Спокойно. По делу.",
  "footer.disclaimer":
    "Qalqan — не официальный сервис АФМ. Ориентир и предупреждение, не юридическая консультация.",
  "footer.sections": "Разделы",
  "footer.help": "Если попал в беду",
  "footer.police": "Полиция — 102",
  "footer.afm": "АФМ РК — 1424",
  "footer.law": "Ст. 232-1 УК РК — дропперство",
  "footer.copy": "коллективный щит",
  "footer.for": "Для молодёжи Казахстана",

  // common
  "common.back": "Назад",
  "common.open": "Открыть",
  "common.copy": "Скопировать",
  "common.copied": "Скопировано",
  "common.generate": "Сгенерировать",
  "common.check": "Проверить",
  "common.loading": "Загрузка…",

  // shield
  "shield.title": "Щит-профиль",
  "shield.sub":
    "Твой личный прогресс защиты. Без аккаунта — всё хранится только на этом устройстве.",
  "shield.checks": "Проверок",
  "shield.caught": "Схем распознано",
  "shield.level": "Уровень защиты",
  "shield.next": "До следующего уровня",
  "shield.levels.novice": "Новичок",
  "shield.levels.careful": "Осторожный",
  "shield.levels.defender": "Защитник",
  "shield.levels.shield": "Щит",
  "shield.tip":
    "Каждая проверка усиливает щит. Красный и жёлтый вердикт считаются «распознанной схемой».",
  "shield.cta": "Сделать проверку",
  "shield.reset": "Сбросить прогресс",

  // emergency
  "emergency.btn": "Я уже дал карту",
  "emergency.title": "Ты уже отдал карту или сделал перевод",
  "emergency.sub":
    "Спокойно. Сейчас важны первые 24 часа. Делай по шагам — без паники.",
  "emergency.now": "Прямо сейчас",
  "emergency.call": "Куда звонить",
  "emergency.say": "Что говорить",
  "emergency.step1": "Заблокируй карту в приложении банка (Kaspi / Halyk / Forte…).",
  "emergency.step2": "Позвони в банк и скажи: карта скомпрометирована, подозрение на мошенничество.",
  "emergency.step3": "Смени пароли Kaspi / банк / eGov, включи уведомления.",
  "emergency.step4": "Сохрани переписку (скриншоты) — не удаляй чат.",
  "emergency.step5": "Позвони 102 или напиши заявление (раздел «Заявление»).",
  "emergency.step6": "Расскажи взрослому. Это не «стыд» — это защита.",
  "emergency.kaspi": "Kaspi: 605 или 8 727 356 50 50",
  "emergency.halyk": "Halyk: 7111 / 8 800 080 00 00",
  "emergency.forte": "Forte: 7575",
  "emergency.bcc": "BCC: 505",
  "emergency.police": "Полиция: 102",
  "emergency.afm": "АФМ: 1424",
  "emergency.script":
    "«Здравствуйте. Меня вовлекли в схему с переводами / я передал данные карты. Прошу заблокировать карту и зафиксировать обращение о мошенничестве. Готов предоставить переписку.»",
  "emergency.statement": "Сгенерировать заявление",

  // am i dropper
  "dropper.title": "Проверь, не дроппер ли ты уже",
  "dropper.sub":
    "Введи номер карты, последние 4 цифры + банк, телефон или @ник. Сверим с народной базой засвеченных реквизитов.",
  "dropper.placeholder": "Карта / *1234 Kaspi / +7… / @nick",
  "dropper.hint":
    "Главный посыл: возможно, ты уже стал частью схемы — даже «просто принял перевод».",
  "dropper.found": "Найдено в народной базе",
  "dropper.notFound": "В базе пока нет",
  "dropper.foundBody":
    "Этот реквизит уже жаловались. Если это твоя карта — срочно блокируй и читай раздел «Я уже дал карту».",
  "dropper.notFoundBody":
    "Прямых жалоб нет — но это не гарантия. Новые схемы появляются каждый день.",
  "dropper.disclaimer": "Демо-сверка. В проде — общая база Supabase.",

  // stories
  "stories.title": "Реальные истории",
  "stories.sub":
    "Анонимные кейсы формата «был как ты → вот чем кончилось». По мотивам типичных случаев в Казахстане.",
  "stories.was": "Был как ты",
  "stories.end": "Чем кончилось",
  "stories.lesson": "Вывод",

  // statement
  "statement.title": "Красная кнопка — заявление",
  "statement.sub":
    "Готовый текст в банк и/или полицию. Вставь свои данные, скопируй, отправь.",
  "statement.toBank": "В банк",
  "statement.toPolice": "В полицию",
  "statement.name": "ФИО",
  "statement.phone": "Телефон",
  "statement.card": "Карта / счёт (можно частично)",
  "statement.bank": "Банк",
  "statement.city": "Город",
  "statement.what": "Что случилось (кратко)",
  "statement.out": "Готовый текст",
  "statement.gen": "Сгенерировать текст",

  // subscribe
  "sub.title": "Подписка Qalqan",
  "sub.sub":
    "Основной фокус — родители: еженедельные сводки угроз в вашем регионе. Студентам и пенсионерам — льготы.",
  "sub.parents": "Родителям",
  "sub.parents.desc":
    "Еженедельная сводка схем в городе ребёнка, чек-листы разговора, алерты при всплеске жалоб.",
  "sub.students": "Студентам",
  "sub.students.desc": "Полный доступ к проверкам и карте. Бесплатно / символически.",
  "sub.seniors": "Пенсионерам",
  "sub.seniors.desc": "Упрощённые предупреждения и скидка на семейный план.",
  "sub.price.parents": "1 990 ₸ / мес",
  "sub.price.students": "0–490 ₸ / мес",
  "sub.price.seniors": "990 ₸ / мес",
  "sub.cta": "Оформить (демо)",
  "sub.saved": "Условных «спасённых» сигналов",
  "sub.reviews": "Отзывы",
  "sub.demo":
    "Оплата пока не подключена — это макет тарифов для продукта. Связь: через форму на карте угроз.",
};

const kz: Dict = {
  "nav.home": "Басты",
  "nav.story": "Тарих",
  "nav.check": "Тексеру",
  "nav.map": "Карта",
  "nav.parents": "Ата-анаға",
  "nav.shield": "Қалқан",
  "nav.stories": "Оқиғалар",
  "nav.subscribe": "Жазылым",
  "nav.emergency": "Шұғыл",
  "nav.enter": "Enter",
  "nav.account": "Профиль",
  "nav.menu": "Мәзір",
  "hero.kicker": "Қалқан · цифрлық қалқан",
  "hero.title1": "Сені шақырады.",
  "hero.title2": "Картаны берме.",
  "hero.sub": "Хабарламаны секундта тексер. Қазақстан бойынша тірі қауіп картасы. Сабырлы. Нақты.",
  "hero.cta.check": "Хабарламаны тексеру",
  "hero.cta.watch": "Оқиғаларды көру →",
  "hero.metric.checks": "Жүйедегі схемалар",
  "hero.metric.stopped": "Уақытында тоқтағандар",
  "hero.metric.regions": "Картадағы өңірлер",
  "hero.metric.red": "Қызыл сигналдар",
  "sub.featured": "Ата-анаға",
  "sub.f1": "Шексіз тексеру",
  "sub.f2": "Қала бойынша қауіп жиынтығы",
  "sub.f3": "Баламен сөйлесу чек-листтері",
  "sub.f4": "Студенттік қолжетім",
  "sub.f5": "Қауіп картасы",
  "sub.f6": "Қарапайым ескертулер",
  "nav.close": "Жабу",

  "footer.tagline":
    "Дроппер схемалары мен қаржы пирамидаларына қарсы цифрлық қалқан. Сабырлы. Нақты.",
  "footer.disclaimer":
    "Qalqan — АФМ-нің ресми сервисі емес. Бағдар мен ескерту, заңгерлік кеңес емес.",
  "footer.sections": "Бөлімдер",
  "footer.help": "Қиындыққа тап болсаң",
  "footer.police": "Полиция — 102",
  "footer.afm": "АФМ ҚР — 1424",
  "footer.law": "ҚР ҚК 232-1-бап — дропперлік",
  "footer.copy": "ұжымдық қалқан",
  "footer.for": "Қазақстан жастарына",

  "common.back": "Артқа",
  "common.open": "Ашу",
  "common.copy": "Көшіру",
  "common.copied": "Көшірілді",
  "common.generate": "Жасау",
  "common.check": "Тексеру",
  "common.loading": "Жүктелуде…",

  "shield.title": "Қалқан-профиль",
  "shield.sub":
    "Жеке қорғаныс прогресің. Аккаунтсыз — тек осы құрылғыда сақталады.",
  "shield.checks": "Тексерулер",
  "shield.caught": "Анықталған схемалар",
  "shield.level": "Қорғаныс деңгейі",
  "shield.next": "Келесі деңгейге",
  "shield.levels.novice": "Жаңадан",
  "shield.levels.careful": "Сақ",
  "shield.levels.defender": "Қорғаушы",
  "shield.levels.shield": "Қалқан",
  "shield.tip":
    "Әр тексеру қалқанды күшейтеді. Қызыл және сары үкім — «анықталған схема».",
  "shield.cta": "Тексеру жасау",
  "shield.reset": "Прогресті тазалау",

  "emergency.btn": "Мен картаны беріп қойдым",
  "emergency.title": "Сен картаны бердің немесе аударым жасадың",
  "emergency.sub":
    "Сабыр сақта. Алғашқы 24 сағат маңызды. Қадам бойынша істе — үрейленбе.",
  "emergency.now": "Дәл қазір",
  "emergency.call": "Қайда қоңырау шалу",
  "emergency.say": "Не деп айту",
  "emergency.step1": "Банк қосымшасында картаны бұғатта (Kaspi / Halyk / Forte…).",
  "emergency.step2": "Банкке қоңырау шал: карта бұзылған, алаяқтық күдігі.",
  "emergency.step3": "Kaspi / банк / eGov құпиясөздерін ауыстыр, хабарламаны қосу.",
  "emergency.step4": "Сөйлесуді сақта (скрин) — чатты өшірме.",
  "emergency.step5": "102-ге қоңырау шал немесе өтініш жаз («Өтініш» бөлімі).",
  "emergency.step6": "Ересекке айт. Бұл «ұят» емес — қорғаныс.",
  "emergency.kaspi": "Kaspi: 605 немесе 8 727 356 50 50",
  "emergency.halyk": "Halyk: 7111 / 8 800 080 00 00",
  "emergency.forte": "Forte: 7575",
  "emergency.bcc": "BCC: 505",
  "emergency.police": "Полиция: 102",
  "emergency.afm": "АФМ: 1424",
  "emergency.script":
    "«Сәлеметсіз бе. Мені аударым схемасына тартты / карта деректерін бердім. Картаны бұғаттауды және алаяқтық туралы жүгінуді тіркеуді сұраймын. Сөйлесуді бере аламын.»",
  "emergency.statement": "Өтініш жасау",

  "dropper.title": "Сен әлдеқашан дроппер емессің бе?",
  "dropper.sub":
    "Карта нөмірін, соңғы 4 цифр + банк, телефон немесе @ник енгіз. Халық базасымен салыстырамыз.",
  "dropper.placeholder": "Карта / *1234 Kaspi / +7… / @nick",
  "dropper.hint":
    "Басты ой: мүмкін сен әлдеқашан схеманың бір бөлігісің — «тек аударма қабылдадым» десең де.",
  "dropper.found": "Халық базасында табылды",
  "dropper.notFound": "Базада әзірше жоқ",
  "dropper.foundBody":
    "Бұл реквизитке шағым бар. Егер бұл сенің картаң болса — дереу бұғатта және «Мен картаны бердім» бөлімін оқы.",
  "dropper.notFoundBody":
    "Тікелей шағым жоқ — бірақ бұл кепілдік емес. Жаңа схемалар күн сайын пайда болады.",
  "dropper.disclaimer": "Демо-салыстыру. Продта — ортақ Supabase базасы.",

  "stories.title": "Нақты оқиғалар",
  "stories.sub":
    "«Сендей болдым → осылай бітті» форматындағы анонимді кейстер. Қазақстандағы типтік жағдайлар негізінде.",
  "stories.was": "Сендей болдым",
  "stories.end": "Немен бітті",
  "stories.lesson": "Қорытынды",

  "statement.title": "Қызыл түйме — өтініш",
  "statement.sub":
    "Банкке және/немесе полицияға дайын мәтін. Деректеріңді енгіз, көшір, жібер.",
  "statement.toBank": "Банкке",
  "statement.toPolice": "Полицияға",
  "statement.name": "Аты-жөні",
  "statement.phone": "Телефон",
  "statement.card": "Карта / шот (жартылай да болады)",
  "statement.bank": "Банк",
  "statement.city": "Қала",
  "statement.what": "Не болды (қысқаша)",
  "statement.out": "Дайын мәтін",
  "statement.gen": "Мәтін жасау",

  "sub.title": "Qalqan жазылымы",
  "sub.sub":
    "Басты назар — ата-ана: аймағыңыздағы қауіптердің апталық жиынтығы. Студент пен зейнеткерге — жеңілдік.",
  "sub.parents": "Ата-анаға",
  "sub.parents.desc":
    "Бала қаласындағы схемалар жиынтығы, әңгіме чек-листтері, шағым өскенде хабарлама.",
  "sub.students": "Студенттерге",
  "sub.students.desc": "Тексеру мен картаға толық қолжетім. Тегін / символдық.",
  "sub.seniors": "Зейнеткерлерге",
  "sub.seniors.desc": "Қарапайым ескертулер және отбасылық жоспарға жеңілдік.",
  "sub.price.parents": "1 990 ₸ / ай",
  "sub.price.students": "0–490 ₸ / ай",
  "sub.price.seniors": "990 ₸ / ай",
  "sub.cta": "Рәсімдеу (демо)",
  "sub.saved": "Шартты «құтқарылған» сигналдар",
  "sub.reviews": "Пікірлер",
  "sub.demo":
    "Төлем әзірше қосылмаған — тариф макеті. Байланыс: қауіп картасындағы форма.",
};

export const DICTS: Record<Lang, Dict> = { ru, kz };

export function translate(lang: Lang, key: string): string {
  return DICTS[lang][key] ?? DICTS.ru[key] ?? key;
}
