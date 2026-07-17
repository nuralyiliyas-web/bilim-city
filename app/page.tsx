"use client";

import { useEffect, useMemo, useState } from "react";

type Lesson = {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  description: string;
  why: string;
  building: string;
  questions: { text: string; options: string[]; answer: number; hint: string }[];
};

const lessons: Lesson[] = [
  { id: 1, title: "Электрический ток", subtitle: "Что заставляет лампу гореть", icon: "⚡", color: "yellow", building: "Станция тока", why: "Чтобы понять, как работают зарядка, фонарик и домашняя проводка.", description: "Электрический ток - это упорядоченное движение заряженных частиц. В металлах движутся электроны.", questions: [
    { text: "Что движется в металлическом проводе?", options: ["Электроны", "Атомы", "Свет"], answer: 0, hint: "Вспомни маленькие отрицательно заряженные частицы." },
    { text: "Что нужно для тока в цепи?", options: ["Разрыв цепи", "Источник энергии и замкнутая цепь", "Только лампа"], answer: 1, hint: "Подумай о батарейке и проводах без разрыва." },
    { text: "Единица силы тока?", options: ["Вольт", "Ом", "Ампер"], answer: 2, hint: "Названа в честь Андре-Мари Ампера." }
  ]},
  { id: 2, title: "Напряжение", subtitle: "Энергия для движения заряда", icon: "↯", color: "cyan", building: "Подстанция", why: "Чтобы понимать, почему у батарейки есть 1,5 В, а в розетке - 220 В.", description: "Напряжение показывает, какую работу совершает электрическое поле при перемещении заряда. Его измеряют в вольтах.", questions: [
    { text: "В чем измеряют напряжение?", options: ["Амперы", "Вольты", "Ватты"], answer: 1, hint: "Посмотри на маркировку батарейки." },
    { text: "Какой прибор измеряет напряжение?", options: ["Вольтметр", "Термометр", "Динамометр"], answer: 0, hint: "Название прибора похоже на единицу измерения." },
    { text: "Напряжение - это...", options: ["температура провода", "энергия на единицу заряда", "количество ламп"], answer: 1, hint: "Оно говорит, сколько энергии получает каждый заряд." }
  ]},
  { id: 3, title: "Сопротивление", subtitle: "Почему ток иногда замедляется", icon: "⏺", color: "coral", building: "Лаборатория материалов", why: "Чтобы выбрать безопасный провод и понять, почему нагревается спираль чайника.", description: "Сопротивление показывает, насколько проводник мешает прохождению тока. Его измеряют в омах.", questions: [
    { text: "Единица сопротивления?", options: ["Ом", "Ватт", "Ньютон"], answer: 0, hint: "Обозначается знаком Ω." },
    { text: "У длинного провода сопротивление...", options: ["больше", "меньше", "всегда равно нулю"], answer: 0, hint: "Зарядам приходится проходить более длинный путь." },
    { text: "Какой материал хорошо проводит ток?", options: ["Медь", "Резина", "Дерево"], answer: 0, hint: "Ее часто используют внутри проводов." }
  ]},
  { id: 4, title: "Закон Ома", subtitle: "Главная формула цепи", icon: "Ω", color: "purple", building: "Центр управления", why: "Чтобы рассчитывать, какой ток будет в устройстве и не перегружать цепь.", description: "Закон Ома связывает напряжение, силу тока и сопротивление: I = U / R.", questions: [
    { text: "Какая формула закона Ома?", options: ["I = U / R", "U = I / R", "R = U × I"], answer: 0, hint: "Сила тока равна напряжению, деленному на сопротивление." },
    { text: "U = 12 В, R = 4 Ом. Чему равен I?", options: ["3 А", "48 А", "8 А"], answer: 0, hint: "Раздели 12 на 4." },
    { text: "Если сопротивление растет, а напряжение постоянно, ток...", options: ["растет", "уменьшается", "не меняется"], answer: 1, hint: "Посмотри на формулу I = U / R." }
  ]},
  { id: 5, title: "Мощность", subtitle: "Сколько энергии тратит устройство", icon: "◉", color: "green", building: "Энергобашня", why: "Чтобы читать маркировки приборов и оценивать расход электричества.", description: "Мощность показывает, как быстро электрическая энергия превращается в другие виды. P = U × I.", questions: [
    { text: "В чем измеряют мощность?", options: ["В ваттах", "В омах", "В кулонах"], answer: 0, hint: "На лампочках пишут, например, 60 Вт." },
    { text: "Какая формула мощности?", options: ["P = U × I", "P = U / I", "P = R / U"], answer: 0, hint: "Умножь напряжение на силу тока." },
    { text: "Что мощнее?", options: ["Лампа 100 Вт", "Лампа 40 Вт", "Одинаково"], answer: 0, hint: "Большее число ватт означает больше энергии за секунду." }
  ]}
];

const storageKey = "bilim-city-completed";

lessons.push(
  { id: 6, title: "Последовательная цепь", subtitle: "Один путь для всего тока", icon: "⛓", color: "cyan", building: "Линия связи", why: "Чтобы понимать, почему в гирлянде одна лампа может выключить остальные.", description: "При последовательном соединении ток проходит через элементы один за другим. Сила тока везде одинакова.", questions: [
    { text: "Сколько путей у тока в последовательной цепи?", options: ["Один", "Два", "Очень много"], answer: 0, hint: "Представь одну длинную дорогу без развилок." },
    { text: "Что будет, если одна лампа в простой гирлянде перегорит?", options: ["Остальные погаснут", "Станут ярче", "Ничего"], answer: 0, hint: "Цепь разомкнется." },
    { text: "Сила тока в последовательной цепи...", options: ["одинакова на всех участках", "разная везде", "равна нулю"], answer: 0, hint: "Через каждую часть проходит один и тот же поток зарядов." },
    { text: "Общее сопротивление при последовательном соединении...", options: ["складывается", "исчезает", "всегда равно 1 Ом"], answer: 0, hint: "Каждый новый элемент добавляет препятствие току." },
    { text: "Какое соединение похоже на очередь?", options: ["Последовательное", "Параллельное", "Никакое"], answer: 0, hint: "Все идут друг за другом по одному пути." }
  ]},
  { id: 7, title: "Параллельная цепь", subtitle: "Несколько дорог для энергии", icon: "⇄", color: "purple", building: "Жилой квартал", why: "Чтобы понять, почему дома подключают приборы независимо друг от друга.", description: "При параллельном соединении у тока несколько ветвей. Если одна лампа выключится, остальные продолжают работать.", questions: [
    { text: "Сколько путей есть у тока в параллельной цепи?", options: ["Несколько", "Только один", "Ни одного"], answer: 0, hint: "В такой цепи есть развилки." },
    { text: "Почему домашние лампы соединяют параллельно?", options: ["Они работают независимо", "Так дешевле лампа", "Чтобы все гасли вместе"], answer: 0, hint: "Выключенная лампа в одной комнате не выключает весь дом." },
    { text: "Напряжение на параллельных ветвях...", options: ["одинаково", "всегда равно нулю", "исчезает"], answer: 0, hint: "Каждая ветвь подключена к одним и тем же двум точкам источника." },
    { text: "Если перегорит одна лампа в квартире, другие...", options: ["будут работать", "все погаснут", "взорвутся"], answer: 0, hint: "Вспомни отдельные ветви цепи." },
    { text: "Какое соединение безопаснее для освещения дома?", options: ["Параллельное", "Последовательное", "Без проводов"], answer: 0, hint: "Нужна независимая работа приборов." }
  ]},
  { id: 8, title: "Работа и энергия", subtitle: "Сколько энергии использует город", icon: "✦", color: "green", building: "Солнечный парк", why: "Чтобы считать расход электричества и выбирать экономные приборы.", description: "Электрическая работа показывает, сколько энергии передал ток. Ее можно вычислить: A = P × t.", questions: [
    { text: "Как найти электрическую работу?", options: ["A = P × t", "A = U / R", "A = I - U"], answer: 0, hint: "Мощность умножают на время работы." },
    { text: "В чем часто измеряют расход энергии дома?", options: ["кВт·ч", "Ом", "Ампер"], answer: 0, hint: "Эту единицу видят в квитанции за электричество." },
    { text: "Что экономнее при одинаковом времени работы?", options: ["Лампа 8 Вт", "Лампа 60 Вт", "Обе одинаково"], answer: 0, hint: "Меньшая мощность тратит меньше энергии за секунду." },
    { text: "Если прибор работает дольше, работа тока...", options: ["увеличивается", "уменьшается", "исчезает"], answer: 0, hint: "Посмотри на формулу с временем." },
    { text: "Что помогает экономить электроэнергию?", options: ["Выключать ненужный свет", "Оставлять все включенным", "Ставить больше ламп"], answer: 0, hint: "Подумай, когда энергия тратится зря." }
  ]}
);

const lessonVisuals = [
  { formula: "I = q / t", caption: "Заряд движется по замкнутой цепи и зажигает лампу." },
  { formula: "U = A / q", caption: "Батарейка передает энергию каждому электрическому заряду." },
  { formula: "R = U / I", caption: "Чем больше сопротивление, тем труднее току пройти через провод." },
  { formula: "I = U / R", caption: "Напряжение толкает ток, а сопротивление его сдерживает." },
  { formula: "P = U × I", caption: "Мощность показывает, как быстро устройство тратит энергию." },
  { formula: "R = R₁ + R₂", caption: "В последовательной цепи заряд проходит один общий маршрут." },
  { formula: "U = U₁ = U₂", caption: "В параллельной цепи энергия может идти по нескольким независимым ветвям." },
  { formula: "A = P × t", caption: "Чем дольше работает устройство, тем больше энергии берет город." }
];

const subjectCards = [
  { id: "physics", icon: "⚡", title: "Физика", text: "Энергополис: 8 тем и практика", status: "Открыто" },
  { id: "algebra", icon: "∑", title: "Алгебра", text: "Уравнения, функции, неравенства", status: "Скоро" },
  { id: "chemistry", icon: "⚗", title: "Химия", text: "Реакции, атомы, вещества", status: "Скоро" },
  { id: "english", icon: "Aa", title: "Английский", text: "Грамматика, слова, разговор", status: "Скоро" },
  { id: "russian", icon: "Я", title: "Русский язык", text: "Орфография, грамматика, текст", status: "Скоро" },
  { id: "exam", icon: "★", title: "Госэкзамен", text: "Пробные задания и слабые темы", status: "Скоро" }
];

const quickLessons = {
  physics: {
    ru: { title: "Физика: электрический ток", intro: "Ток - это упорядоченное движение заряженных частиц. В металлическом проводе движутся электроны.", formula: "I = q / t", questions: [{ text: "Что движется в металлическом проводе?", options: ["Электроны", "Атомы", "Свет"], answer: 0 }, { text: "В чем измеряют силу тока?", options: ["Ампер", "Ом", "Вольт"], answer: 0 }, { text: "Что нужно для тока?", options: ["Замкнутая цепь", "Только лампа", "Разрыв провода"], answer: 0 }] },
    kk: { title: "Физика: электр тогы", intro: "Электр тогы - зарядталған бөлшектердің реттелген қозғалысы. Металл өткізгіште электрондар қозғалады.", formula: "I = q / t", questions: [{ text: "Металл өткізгіште не қозғалады?", options: ["Электрондар", "Атомдар", "Жарық"], answer: 0 }, { text: "Ток күші немен өлшенеді?", options: ["Ампермен", "Оммен", "Вольтпен"], answer: 0 }, { text: "Ток жүруі үшін не қажет?", options: ["Тұйық тізбек", "Тек шам", "Үзілген сым"], answer: 0 }] }
  },
  algebra: {
    ru: { title: "Алгебра: квадратное уравнение", intro: "Квадратное уравнение имеет вид ax² + bx + c = 0. Его корни можно найти через дискриминант.", formula: "D = b² - 4ac", questions: [{ text: "Какой вид у квадратного уравнения?", options: ["ax² + bx + c = 0", "ax + b = 0", "a / b = c"], answer: 0 }, { text: "Чему равен дискриминант?", options: ["b² - 4ac", "a + b + c", "2ab"], answer: 0 }, { text: "Сколько корней при D > 0?", options: ["Два", "Один", "Ни одного"], answer: 0 }] },
    kk: { title: "Алгебра: квадрат теңдеу", intro: "Квадрат теңдеудің түрі ax² + bx + c = 0. Түбірлерін дискриминант арқылы табуға болады.", formula: "D = b² - 4ac", questions: [{ text: "Квадрат теңдеудің түрін таңда.", options: ["ax² + bx + c = 0", "ax + b = 0", "a / b = c"], answer: 0 }, { text: "Дискриминант неге тең?", options: ["b² - 4ac", "a + b + c", "2ab"], answer: 0 }, { text: "D > 0 болса, неше түбір бар?", options: ["Екі", "Бір", "Түбір жоқ"], answer: 0 }] }
  },
  chemistry: {
    ru: { title: "Химия: химическая реакция", intro: "Химическая реакция - превращение одних веществ в другие. При этом атомы не исчезают, а перегруппировываются.", formula: "m(реагентов) = m(продуктов)", questions: [{ text: "Что происходит в химической реакции?", options: ["Образуются новые вещества", "Исчезают атомы", "Меняется только цвет"], answer: 0 }, { text: "Как называется запись реакции?", options: ["Химическое уравнение", "Рисунок", "Алфавит"], answer: 0 }, { text: "Что сохраняется в реакции?", options: ["Масса веществ", "Число учебников", "Температура всегда"], answer: 0 }] },
    kk: { title: "Химия: химиялық реакция", intro: "Химиялық реакция - бір заттардың басқа заттарға айналуы. Атомдар жоғалмайды, қайта топтасады.", formula: "m(реагенттер) = m(өнімдер)", questions: [{ text: "Химиялық реакцияда не болады?", options: ["Жаңа заттар түзіледі", "Атомдар жоғалады", "Тек түс өзгереді"], answer: 0 }, { text: "Реакцияның жазбасы қалай аталады?", options: ["Химиялық теңдеу", "Сурет", "Әліпби"], answer: 0 }, { text: "Реакцияда не сақталады?", options: ["Заттардың массасы", "Кітап саны", "Температура әрқашан"], answer: 0 }] }
  },
  english: {
    ru: { title: "English: Present Perfect", intro: "Present Perfect связывает прошлое действие с настоящим результатом. Обычно: have/has + V3.", formula: "have / has + V3", questions: [{ text: "Выбери правильный вариант: I ___ my homework.", options: ["have finished", "finished have", "has finish"], answer: 0 }, { text: "С каким местоимением используется has?", options: ["She", "I", "They"], answer: 0 }, { text: "V3 - это...", options: ["третья форма глагола", "число три", "прилагательное"], answer: 0 }] },
    kk: { title: "Ағылшын тілі: Present Perfect", intro: "Present Perfect өткен әрекетті қазіргі нәтижемен байланыстырады. Құрылымы: have/has + V3.", formula: "have / has + V3", questions: [{ text: "Дұрыс нұсқаны таңда: I ___ my homework.", options: ["have finished", "finished have", "has finish"], answer: 0 }, { text: "Has қай есімдікпен қолданылады?", options: ["She", "I", "They"], answer: 0 }, { text: "V3 дегеніміз не?", options: ["Етістіктің үшінші түрі", "Үш саны", "Сын есім"], answer: 0 }] }
  },
  russian: {
    ru: { title: "Русский язык: запятая", intro: "Запятая помогает разделять части сложного предложения и делает мысль понятной.", formula: "[часть 1], [часть 2]", questions: [{ text: "Где нужна запятая: Я знаю ___ что ты придешь.", options: ["перед что", "после знаю", "не нужна"], answer: 0 }, { text: "Зачем нужна запятая?", options: ["Разделять части предложения", "Украшать слово", "Считать буквы"], answer: 0 }, { text: "Какое предложение сложное?", options: ["Я пришел, и урок начался.", "Идет дождь.", "Тихий вечер."], answer: 0 }] },
    kk: { title: "Орыс тілі: үтір", intro: "Үтір құрмалас сөйлем бөліктерін ажыратады және ойды түсінікті етеді.", formula: "[1-бөлік], [2-бөлік]", questions: [{ text: "Үтір қай жерде керек: Я знаю ___ что ты придешь.", options: ["что сөзінің алдында", "знаю сөзінен кейін", "керек емес"], answer: 0 }, { text: "Үтір не үшін керек?", options: ["Сөйлем бөліктерін ажырату үшін", "Сөзді әшекейлеу үшін", "Әріп санау үшін"], answer: 0 }, { text: "Қайсысы құрмалас сөйлем?", options: ["Я пришел, и урок начался.", "Идет дождь.", "Тихий вечер."], answer: 0 }] }
  },
  exam: {
    ru: { title: "Госэкзамен: диагностический старт", intro: "Диагностика показывает, какие темы стоит повторить. Решай спокойно: важнее понять ошибку, чем угадать.", formula: "знания + практика = уверенность", questions: [{ text: "Как лучше готовиться к экзамену?", options: ["Регулярно маленькими шагами", "Все за одну ночь", "Не решать задания"], answer: 0 }, { text: "Что делать после ошибки?", options: ["Разобрать ее", "Сразу забыть", "Сдаться"], answer: 0 }, { text: "Что показывает диагностика?", options: ["Слабые темы", "Любимый цвет", "Рост"], answer: 0 }] },
    kk: { title: "Мемлекеттік емтихан: бастапқы диагностика", intro: "Диагностика қай тақырыптарды қайталау керегін көрсетеді. Сабырмен шеш: қатені түсіну маңызды.", formula: "білім + практика = сенімділік", questions: [{ text: "Емтиханға қалай дайындалған дұрыс?", options: ["Күнде аз-аздан", "Бір түнде бәрін", "Тапсырма шешпеу"], answer: 0 }, { text: "Қателескеннен кейін не істеу керек?", options: ["Қатені талдау", "Ұмыту", "Берілу"], answer: 0 }, { text: "Диагностика нені көрсетеді?", options: ["Әлсіз тақырыптарды", "Сүйікті түсті", "Бойды"], answer: 0 }] }
  }
};

const subjectLabels = {
  physics: { kkTitle: "Физика", kkText: "Энергополис: 8 тақырып және практика" },
  algebra: { kkTitle: "Алгебра", kkText: "Теңдеулер, функциялар, теңсіздіктер" },
  chemistry: { kkTitle: "Химия", kkText: "Реакциялар, атомдар, заттар" },
  english: { kkTitle: "Ағылшын тілі", kkText: "Грамматика, сөздер, сөйлесу" },
  russian: { kkTitle: "Орыс тілі", kkText: "Емле, грамматика, мәтін" },
  exam: { kkTitle: "Мемлекеттік емтихан", kkText: "Сынақ тапсырмалары және әлсіз тақырыптар" }
} as const;

export default function Home() {
  const [name, setName] = useState("");
  const [student, setStudent] = useState("");
  const [completed, setCompleted] = useState<number[]>([]);
  const [active, setActive] = useState<Lesson | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [hint, setHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [showTest, setShowTest] = useState(false);
  const [language, setLanguage] = useState<"ru" | "kk">("kk");
  const [darkTheme, setDarkTheme] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [activeSubject, setActiveSubject] = useState("");
  const [quickSubject, setQuickSubject] = useState<keyof typeof quickLessons | null>(null);
  const [quickStep, setQuickStep] = useState(0);
  const [quickAnswers, setQuickAnswers] = useState<number[]>([]);

  useEffect(() => {
    const savedName = localStorage.getItem("bilim-city-name");
    const savedProgress = localStorage.getItem(storageKey);
    if (savedName) { setStudent(savedName); setShowGreeting(true); }
    if (savedProgress) setCompleted(JSON.parse(savedProgress));
    if (localStorage.getItem("bilim-city-language") === "ru") setLanguage("ru");
    if (localStorage.getItem("bilim-city-theme") === "dark") setDarkTheme(true);
  }, []);

  const progress = Math.round((completed.length / lessons.length) * 100);
  const energy = completed.length * 120;
  const currentQuestion = active?.questions[step];
  const correct = useMemo(() => active ? answers.filter((answer, index) => answer === active.questions[index]?.answer).length : 0, [active, answers]);
  const isKazakh = language === "kk";

  function enterCity(event: React.FormEvent) {
    event.preventDefault();
    const cleanName = name.trim() || "Исследователь";
    localStorage.setItem("bilim-city-name", cleanName);
    setStudent(cleanName);
    setShowGreeting(true);
  }

  function openLesson(lesson: Lesson) {
    if (lesson.id > 1 && !completed.includes(lesson.id - 1)) return;
    setActive(lesson); setStep(0); setAnswers([]); setHint(false); setFeedback(null); setShowTest(false);
  }

  function changeLanguage(nextLanguage: "ru" | "kk") {
    localStorage.setItem("bilim-city-language", nextLanguage);
    setLanguage(nextLanguage);
  }

  function toggleTheme() {
    const nextTheme = !darkTheme;
    setDarkTheme(nextTheme);
    localStorage.setItem("bilim-city-theme", nextTheme ? "dark" : "light");
  }

  function openQuickLesson(subjectId: keyof typeof quickLessons) {
    setActiveSubject(subjectId); setQuickSubject(subjectId); setQuickStep(0); setQuickAnswers([]);
  }

  function answerQuickLesson(answer: number) {
    if (!quickSubject || quickAnswers[quickStep] !== undefined) return;
    const lesson = quickLessons[quickSubject][language];
    const nextAnswers = [...quickAnswers, answer];
    setQuickAnswers(nextAnswers);
    playFeedbackSound(answer === lesson.questions[quickStep].answer);
    window.setTimeout(() => {
      if (quickStep < lesson.questions.length - 1) setQuickStep(quickStep + 1);
    }, 550);
  }

  function playFeedbackSound(isCorrect: boolean) {
    const AudioContext = window.AudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = isCorrect ? "sine" : "square";
    oscillator.frequency.setValueAtTime(isCorrect ? 660 : 180, context.currentTime);
    if (isCorrect) oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.14);
    gain.gain.setValueAtTime(0.12, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.23);
    window.setTimeout(() => context.close(), 300);
  }

  function selectAnswer(answer: number) {
    if (!active || answers[step] !== undefined) return;
    const isCorrect = answer === active.questions[step].answer;
    playFeedbackSound(isCorrect);
    setFeedback(isCorrect ? "correct" : "wrong");
    const next = [...answers, answer];
    setAnswers(next);
    window.setTimeout(() => {
      if (step < active.questions.length - 1) { setStep(step + 1); setHint(false); setFeedback(null); }
      else {
        if (!completed.includes(active.id)) {
          const nextCompleted = [...completed, active.id];
          setCompleted(nextCompleted); localStorage.setItem(storageKey, JSON.stringify(nextCompleted));
        }
      }
    }, 700);
  }

  if (!student) return <main className="login-shell"><section className="login-card"><div className="mark">B</div><p className="eyebrow">BILIM CITY</p><h1>Построй город.<br />Пойми мир.</h1><p className="lead">Короткие игровые уроки физики для 9 класса.</p><form onSubmit={enterCity}><label htmlFor="name">Как тебя зовут?</label><input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Например, Аян" maxLength={24} autoFocus /><button type="submit">Войти в город <span>→</span></button></form><p className="small">Демо-версия. Прогресс хранится на этом устройстве.</p></section><div className="login-city" aria-hidden="true"><img className="login-mascot" src="/mascot/bilim-leopard.png" alt="" /><div className="sun" /><div className="building b1" /><div className="building b2" /><div className="building b3" /><div className="hill" /></div></main>;

  return <main className={`app-shell ${darkTheme ? "theme-dark" : ""}`}><header><div className="brand"><div className="brand-mark">B</div><div><strong>Bilim City</strong><span>{isKazakh ? "Энергополис" : "Энергополис"}</span></div></div><div className="header-stats"><div className="settings-wrap"><button className="settings-toggle" onClick={() => setShowSettings(!showSettings)} aria-expanded={showSettings} aria-label={isKazakh ? "Баптаулар" : "Настройки"} title={isKazakh ? "Баптаулар" : "Настройки"}>⚙</button>{showSettings && <section className="settings-panel"><strong>{isKazakh ? "Баптаулар" : "Настройки"}</strong><span>{isKazakh ? "Тіл" : "Язык"}</span><div className="language-toggle" aria-label="Выбор языка"><button className={language === "kk" ? "active" : ""} onClick={() => changeLanguage("kk")}>KZ</button><button className={language === "ru" ? "active" : ""} onClick={() => changeLanguage("ru")}>RU</button></div><span>{isKazakh ? "Фон" : "Фон"}</span><button className="settings-theme" onClick={toggleTheme}>{darkTheme ? (isKazakh ? "Ашық фон" : "Светлый фон") : (isKazakh ? "Қара фон" : "Тёмный фон")}</button></section>}</div><span className="energy">⚡ {energy}</span><span className="avatar">{student.slice(0, 1).toUpperCase()}</span></div></header>
    {showGreeting && <div className="greeting-backdrop"><section className="greeting-card" role="dialog" aria-modal="true"><img src="/mascot/bilim-leopard.png" alt="Барс Bilim City" /><div><p className="eyebrow">{isKazakh ? "СЕНІҢ ҰСТАЗЫҢ" : "ТВОЙ НАСТАВНИК"}</p><h2>{isKazakh ? `Сәлем, ${student}!` : `Привет, ${student}!`}</h2><p>{isKazakh ? "Күнің сәтті өтсін. Бүгін бір тақырыпты талдап, қалаға энергия берейік." : "Хорошего дня. Давай сегодня разберем одну тему и дадим городу немного энергии."}</p><button className="primary" onClick={() => setShowGreeting(false)}>{isKazakh ? "Күнді бастау" : "Начать день"}</button></div></section></div>}
    <section className="welcome"><div><p className="eyebrow">ТВОЙ УЧЕБНЫЙ ГОРОД</p><h1>Привет, {student}!</h1><p>Сегодня ты можешь дать городу еще немного энергии.</p></div><div className="progress-card"><div><span>Прогресс района</span><strong>{progress}%</strong></div><div className="meter"><i style={{ width: `${progress}%` }} /></div><small>{completed.length} из {lessons.length} объектов запущено</small></div></section>
    <section className="subjects-section"><div className="section-head"><div><p className="eyebrow">{language === "kk" ? "9-СЫНЫП ПӘНДЕРІ" : "ПРЕДМЕТЫ 9 КЛАССА"}</p><h2>{language === "kk" ? "Бағытты таңда" : "Выбери маршрут"}</h2></div><span className="map-note">{language === "kk" ? "Барлық пән бір ойында" : "Все предметы в одной игре"}</span></div><div className="subject-grid">{subjectCards.map((subject) => <button key={subject.id} className={`subject-card subject-${subject.id} ${activeSubject === subject.id ? "selected" : ""}`} onClick={() => openQuickLesson(subject.id as keyof typeof quickLessons)}><span className="subject-icon">{subject.icon}</span><small>{language === "kk" ? "АШЫҚ" : "ОТКРЫТО"}</small><strong>{language === "kk" ? subjectLabels[subject.id as keyof typeof subjectLabels].kkTitle : subject.title}</strong><p>{language === "kk" ? subjectLabels[subject.id as keyof typeof subjectLabels].kkText : subject.text}</p><b className="subject-action">{language === "kk" ? "Сабақты бастау →" : "Начать урок →"}</b></button>)}</div></section>
    <section className="city-section"><div className="section-head"><div><p className="eyebrow">КАРТА ГОРОДА</p><h2>Энергополис</h2></div><span className="map-note">Выбери объект на карте</span></div><div className="city-map">
      <div className="river" /><div className="road r1" /><div className="road r2" />
      {lessons.map((lesson, index) => { const isDone = completed.includes(lesson.id); const unlocked = lesson.id === 1 || completed.includes(lesson.id - 1); return <button key={lesson.id} className={`map-building building-${lesson.id} ${isDone ? "done" : ""} ${!unlocked ? "locked" : ""}`} onClick={() => openLesson(lesson)} aria-label={lesson.title}><span className={`building-shape ${lesson.color}`}>{isDone ? "✓" : lesson.icon}</span><b>{lesson.building}</b><small>{isDone ? "Запущено" : unlocked ? "Открыто" : "Нужен прошлый урок"}</small>{index < lessons.length - 1 && <em>→</em>}</button>; })}
    </div></section>
    <section className="lesson-section"><div className="section-head"><div><p className="eyebrow">МАРШРУТ</p><h2>Уроки энергии</h2></div><span className="map-note">10 минут на тему</span></div><div className="lesson-grid">{lessons.map((lesson) => { const unlocked = lesson.id === 1 || completed.includes(lesson.id - 1); const done = completed.includes(lesson.id); return <button className={`lesson-card ${!unlocked ? "disabled" : ""}`} key={lesson.id} onClick={() => openLesson(lesson)}><span className={`lesson-icon ${lesson.color}`}>{done ? "✓" : lesson.icon}</span><span><small>УРОВЕНЬ {lesson.id}</small><strong>{lesson.title}</strong><p>{done ? "Объект построен" : unlocked ? lesson.subtitle : "Пройди предыдущий уровень"}</p></span><i>{unlocked ? "→" : "🔒"}</i></button>; })}</div></section>
{quickSubject && <div className="modal-backdrop"><section className="lesson-modal quick-modal" role="dialog" aria-modal="true"><button className="close" onClick={() => setQuickSubject(null)} aria-label="Закрыть">×</button>{quickAnswers.length === quickLessons[quickSubject][language].questions.length ? <div className="result"><div className="result-icon">★</div><p className="eyebrow">{language === "kk" ? "САБАҚ АЯҚТАЛДЫ" : "УРОК ЗАВЕРШЕН"}</p><h2>{quickAnswers.filter((answer, index) => answer === quickLessons[quickSubject][language].questions[index].answer).length} / {quickLessons[quickSubject][language].questions.length}</h2><p>{language === "kk" ? "Керемет! Келесі тақырыпты таңда." : "Отлично! Выбери следующую тему."}</p><button className="primary" onClick={() => setQuickSubject(null)}>{language === "kk" ? "Пәндерге оралу" : "Вернуться к предметам"}</button></div> : <><p className="eyebrow">{language === "kk" ? "9-СЫНЫП · ҚАЗАҚСТАН" : "9 КЛАСС · КАЗАХСТАН"}</p><h2>{quickLessons[quickSubject][language].title}</h2><div className="meaning"><strong>{language === "kk" ? "Қысқа түсіндіру" : "Короткое объяснение"}</strong><p>{quickLessons[quickSubject][language].intro}</p></div><div className="quick-formula">{quickLessons[quickSubject][language].formula}</div><div className="question"><span>{language === "kk" ? "ТАПСЫРМА" : "ЗАДАНИЕ"} {quickStep + 1}/3</span><h3>{quickLessons[quickSubject][language].questions[quickStep].text}</h3><div className="answers">{quickLessons[quickSubject][language].questions[quickStep].options.map((option, index) => { const chosen = quickAnswers[quickStep] === index; const state = chosen ? (index === quickLessons[quickSubject][language].questions[quickStep].answer ? "correct" : "wrong") : ""; return <button className={state} key={option} onClick={() => answerQuickLesson(index)}>{option}</button>; })}</div></div></>}</section></div>}
    {active && <div className="modal-backdrop" role="presentation"><section className="lesson-modal" role="dialog" aria-modal="true" aria-label={active.title}><button className="close" onClick={() => setActive(null)} aria-label="Закрыть">×</button>{answers.length === active.questions.length ? <div className="result"><div className="result-icon">{correct === active.questions.length ? "⚡" : "✦"}</div><p className="eyebrow">МИССИЯ ЗАВЕРШЕНА</p><h2>{correct} из {active.questions.length} верно</h2><p>{correct === active.questions.length ? `${active.building} снабжает город энергией.` : "Ты прошел уровень. Вернись позже и попробуй улучшить результат."}</p><div className="reward">+120 энергии</div><button className="primary" onClick={() => setActive(null)}>Вернуться в город</button></div> : <><div className="modal-top"><span className={`lesson-icon ${active.color}`}>{active.icon}</span><div><p className="eyebrow">УРОВЕНЬ {active.id} · {step + 1}/3</p><h2>{active.title}</h2></div></div><div className="meaning"><strong>Зачем это нужно?</strong><p>{active.why}</p></div><div className="explain"><p>{active.description}</p></div><section className="visual-lab" aria-label="Визуальное объяснение"><div className="visual-head"><span>АНИМАЦИЯ ЦЕПИ</span><b>Формула: {lessonVisuals[active.id - 1].formula}</b></div><div className="circuit-animation"><div className="battery"><i>+</i><i>-</i></div><div className="wire top-wire"><i /><i /><i /></div><div className="wire bottom-wire"><i /><i /><i /></div><div className="bulb"><span>⚡</span></div></div><p>{lessonVisuals[active.id - 1].caption}</p></section><section className={`lesson-stage ${showTest ? "lesson-complete" : ""}`}><img className="mascot-tip" src="/mascot/bilim-leopard.png" alt="Барс-наставник Bilim City" /><p className="eyebrow">{language === "kk" ? "САБАҚ АЯҚТАЛДЫ" : "СНАЧАЛА УРОК"}</p><h3>{language === "kk" ? "Формуланы түсініп, үлгіні қарап шық." : "Разберись с формулой и примером."}</h3><p>{language === "kk" ? `Мысал: ${lessonVisuals[active.id - 1].formula}. Енді тапсырмаларға өзің жауап бересің.` : `Пример: используй формулу ${lessonVisuals[active.id - 1].formula}. Теперь ты сможешь решать задания сам.`}</p>{!showTest && <button className="primary start-test" onClick={() => setShowTest(true)}>{language === "kk" ? "Түсіндім, тапсырмаларға өту" : "Я понял, начать задания"}</button>}</section><div className={`question ${showTest ? "" : "hidden-question"}`}><span>{language === "kk" ? "ТАПСЫРМА" : "Задание"}</span><h3>{currentQuestion?.text}</h3><div className="answers">{currentQuestion?.options.map((option, index) => { const chosen = answers[step] === index; const state = chosen ? (index === currentQuestion.answer ? "correct" : "wrong") : ""; return <button className={state} key={option} onClick={() => selectAnswer(index)}>{option}</button>; })}</div>{feedback && <div className={`answer-feedback ${feedback}`}><b>{feedback === "correct" ? "Верно!" : "Почти. Посмотри на формулу и попробуй еще раз в следующем вопросе."}</b><span>{feedback === "correct" ? "⚡ + энергия городу" : `Подсказка: ${currentQuestion?.hint}`}</span><div className="meme-strip">{feedback === "correct" ? "Мем дня: лампочка сияет, потому что ты не нажал наугад." : "Мем дня: формула не сердится. Она просит еще один спокойный шаг."}</div></div>}{hint ? <p className="hint">Подсказка: {currentQuestion?.hint}</p> : <button className="hint-btn" onClick={() => setHint(true)}>Нужна подсказка?</button>}</div></>}</section></div>}
    <footer className="site-footer"><strong>Автор: Нуралы Ильяс</strong><span>Команда QALA</span></footer>
  </main>;
}
