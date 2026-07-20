-- Qalqan — демо-данные (15 репортов + 10 засвеченных реквизитов).
-- Выполни после schema.sql. Совпадает с lib/seed.ts (fallback без Supabase).

insert into reports (created_at, scheme_type, region, verdict, source) values
  (now() - interval '2 hours',  'dropper',  'Алматы',            'red',    'check'),
  (now() - interval '5 hours',  'dropper',  'Алматы',            'red',    'manual_report'),
  (now() - interval '8 hours',  'fake_job', 'Астана',            'red',    'check'),
  (now() - interval '11 hours', 'pyramid',  'Шымкент',           'yellow', 'check'),
  (now() - interval '14 hours', 'dropper',  'Шымкент',           'red',    'check'),
  (now() - interval '20 hours', 'phishing', 'Караганда',         'red',    'manual_report'),
  (now() - interval '23 hours', 'fake_job', 'Караганда',         'yellow', 'check'),
  (now() - interval '28 hours', 'pyramid',  'Актобе',            'red',    'check'),
  (now() - interval '33 hours', 'dropper',  'Астана',            'red',    'check'),
  (now() - interval '40 hours', 'phishing', 'Павлодар',          'yellow', 'manual_report'),
  (now() - interval '46 hours', 'dropper',  'Усть-Каменогорск',  'red',    'check'),
  (now() - interval '52 hours', 'fake_job', 'Алматы',            'red',    'check'),
  (now() - interval '60 hours', 'pyramid',  'Тараз',             'yellow', 'check'),
  (now() - interval '70 hours', 'dropper',  'Костанай',          'red',    'manual_report'),
  (now() - interval '80 hours', 'phishing', 'Атырау',            'red',    'check');

insert into flagged_accounts (created_at, value, kind, report_count, note) values
  (now() - interval '3 hours',  '4400 4302 1122 3344', 'card',      7,  '«Прими перевод и оставь 10%» — классический дроп'),
  (now() - interval '6 hours',  '@easy_money_kz',      'telegram',  12, 'Вербует школьников под «удалённую работу»'),
  (now() - interval '9 hours',  '+7 707 555 21 43',    'phone',     5,  'Звонит от имени «службы безопасности Kaspi»'),
  (now() - interval '15 hours', '5169 4931 0088 7766', 'card',      9,  'Карта-дроп, счёт заморожен АФМ'),
  (now() - interval '19 hours', '@rabota_almaty_2026', 'telegram',  8,  '«500к в месяц без опыта», просит фото карты'),
  (now() - interval '26 hours', '+7 771 342 88 90',    'phone',     4,  'Инвест-пирамида, обещает 30% в месяц'),
  (now() - interval '31 hours', 'invest.pro.kz',       'instagram', 6,  'Пирамида под видом «крипто-платформы»'),
  (now() - interval '44 hours', 'TBn9...x7Qk (USDT)',  'wallet',    3,  'Кошелёк для «депозита», деньги не возвращают'),
  (now() - interval '55 hours', '@work_dostyk',        'telegram',  10, 'Массовая вербовка дропов по вузам'),
  (now() - interval '66 hours', '4405 6201 9911 0022', 'card',      5,  '«Твоя карта нужна на один перевод»');
