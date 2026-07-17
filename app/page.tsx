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
  const [language, setLanguage] = useState<"ru" | "kk">("ru");
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("bilim-city-name");
    const savedProgress = localStorage.getItem(storageKey);
    if (savedName) { setStudent(savedName); setShowGreeting(true); }
    if (savedProgress) setCompleted(JSON.parse(savedProgress));
    if (localStorage.getItem("bilim-city-language") === "kk") setLanguage("kk");
  }, []);

  const progress = Math.round((completed.length / lessons.length) * 100);
  const energy = completed.length * 120;
  const currentQuestion = active?.questions[step];
  const correct = useMemo(() => active ? answers.filter((answer, index) => answer === active.questions[index]?.answer).length : 0, [active, answers]);

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

  return <main className="app-shell"><header><div className="brand"><div className="brand-mark">B</div><div><strong>Bilim City</strong><span>Энергополис</span></div></div><div className="header-stats"><div className="language-toggle" aria-label="Выбор языка"><button className={language === "ru" ? "active" : ""} onClick={() => changeLanguage("ru")}>RU</button><button className={language === "kk" ? "active" : ""} onClick={() => changeLanguage("kk")}>KZ</button></div><span className="energy">⚡ {energy}</span><span className="avatar">{student.slice(0, 1).toUpperCase()}</span></div></header>
    {showGreeting && <div className="greeting-backdrop"><section className="greeting-card" role="dialog" aria-modal="true"><img src="/mascot/bilim-leopard.png" alt="Барс Bilim City" /><div><p className="eyebrow">ТВОЙ НАСТАВНИК</p><h2>Привет, {student}!</h2><p>Хорошего дня. Давай сегодня разберем одну тему и дадим городу немного энергии.</p><button className="primary" onClick={() => setShowGreeting(false)}>Начать день</button></div></section></div>}
    <section className="welcome"><div><p className="eyebrow">ТВОЙ УЧЕБНЫЙ ГОРОД</p><h1>Привет, {student}!</h1><p>Сегодня ты можешь дать городу еще немного энергии.</p></div><div className="progress-card"><div><span>Прогресс района</span><strong>{progress}%</strong></div><div className="meter"><i style={{ width: `${progress}%` }} /></div><small>{completed.length} из {lessons.length} объектов запущено</small></div></section>
    <section className="city-section"><div className="section-head"><div><p className="eyebrow">КАРТА ГОРОДА</p><h2>Энергополис</h2></div><span className="map-note">Выбери объект на карте</span></div><div className="city-map">
      <div className="river" /><div className="road r1" /><div className="road r2" />
      {lessons.map((lesson, index) => { const isDone = completed.includes(lesson.id); const unlocked = lesson.id === 1 || completed.includes(lesson.id - 1); return <button key={lesson.id} className={`map-building building-${lesson.id} ${isDone ? "done" : ""} ${!unlocked ? "locked" : ""}`} onClick={() => openLesson(lesson)} aria-label={lesson.title}><span className={`building-shape ${lesson.color}`}>{isDone ? "✓" : lesson.icon}</span><b>{lesson.building}</b><small>{isDone ? "Запущено" : unlocked ? "Открыто" : "Нужен прошлый урок"}</small>{index < lessons.length - 1 && <em>→</em>}</button>; })}
    </div></section>
    <section className="lesson-section"><div className="section-head"><div><p className="eyebrow">МАРШРУТ</p><h2>Уроки энергии</h2></div><span className="map-note">10 минут на тему</span></div><div className="lesson-grid">{lessons.map((lesson) => { const unlocked = lesson.id === 1 || completed.includes(lesson.id - 1); const done = completed.includes(lesson.id); return <button className={`lesson-card ${!unlocked ? "disabled" : ""}`} key={lesson.id} onClick={() => openLesson(lesson)}><span className={`lesson-icon ${lesson.color}`}>{done ? "✓" : lesson.icon}</span><span><small>УРОВЕНЬ {lesson.id}</small><strong>{lesson.title}</strong><p>{done ? "Объект построен" : unlocked ? lesson.subtitle : "Пройди предыдущий уровень"}</p></span><i>{unlocked ? "→" : "🔒"}</i></button>; })}</div></section>
    {active && <div className="modal-backdrop" role="presentation"><section className="lesson-modal" role="dialog" aria-modal="true" aria-label={active.title}><button className="close" onClick={() => setActive(null)} aria-label="Закрыть">×</button>{answers.length === active.questions.length ? <div className="result"><div className="result-icon">{correct === active.questions.length ? "⚡" : "✦"}</div><p className="eyebrow">МИССИЯ ЗАВЕРШЕНА</p><h2>{correct} из {active.questions.length} верно</h2><p>{correct === active.questions.length ? `${active.building} снабжает город энергией.` : "Ты прошел уровень. Вернись позже и попробуй улучшить результат."}</p><div className="reward">+120 энергии</div><button className="primary" onClick={() => setActive(null)}>Вернуться в город</button></div> : <><div className="modal-top"><span className={`lesson-icon ${active.color}`}>{active.icon}</span><div><p className="eyebrow">УРОВЕНЬ {active.id} · {step + 1}/3</p><h2>{active.title}</h2></div></div><div className="meaning"><strong>Зачем это нужно?</strong><p>{active.why}</p></div><div className="explain"><p>{active.description}</p></div><section className="visual-lab" aria-label="Визуальное объяснение"><div className="visual-head"><span>АНИМАЦИЯ ЦЕПИ</span><b>Формула: {lessonVisuals[active.id - 1].formula}</b></div><div className="circuit-animation"><div className="battery"><i>+</i><i>-</i></div><div className="wire top-wire"><i /><i /><i /></div><div className="wire bottom-wire"><i /><i /><i /></div><div className="bulb"><span>⚡</span></div></div><p>{lessonVisuals[active.id - 1].caption}</p></section><section className={`lesson-stage ${showTest ? "lesson-complete" : ""}`}><img className="mascot-tip" src="/mascot/bilim-leopard.png" alt="Барс-наставник Bilim City" /><p className="eyebrow">{language === "kk" ? "САБАҚ АЯҚТАЛДЫ" : "СНАЧАЛА УРОК"}</p><h3>{language === "kk" ? "Формуланы түсініп, үлгіні қарап шық." : "Разберись с формулой и примером."}</h3><p>{language === "kk" ? `Мысал: ${lessonVisuals[active.id - 1].formula}. Енді тапсырмаларға өзің жауап бересің.` : `Пример: используй формулу ${lessonVisuals[active.id - 1].formula}. Теперь ты сможешь решать задания сам.`}</p>{!showTest && <button className="primary start-test" onClick={() => setShowTest(true)}>{language === "kk" ? "Түсіндім, тапсырмаларға өту" : "Я понял, начать задания"}</button>}</section><div className={`question ${showTest ? "" : "hidden-question"}`}><span>{language === "kk" ? "ТАПСЫРМА" : "Задание"}</span><h3>{currentQuestion?.text}</h3><div className="answers">{currentQuestion?.options.map((option, index) => { const chosen = answers[step] === index; const state = chosen ? (index === currentQuestion.answer ? "correct" : "wrong") : ""; return <button className={state} key={option} onClick={() => selectAnswer(index)}>{option}</button>; })}</div>{feedback && <div className={`answer-feedback ${feedback}`}><b>{feedback === "correct" ? "Верно!" : "Почти. Посмотри на формулу и попробуй еще раз в следующем вопросе."}</b><span>{feedback === "correct" ? "⚡ + энергия городу" : `Подсказка: ${currentQuestion?.hint}`}</span><div className="meme-strip">{feedback === "correct" ? "Мем дня: лампочка сияет, потому что ты не нажал наугад." : "Мем дня: формула не сердится. Она просит еще один спокойный шаг."}</div></div>}{hint ? <p className="hint">Подсказка: {currentQuestion?.hint}</p> : <button className="hint-btn" onClick={() => setHint(true)}>Нужна подсказка?</button>}</div></>}</section></div>}
  </main>;
}
