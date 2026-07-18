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

const juniorQuickLessons = {
  math: { ru: { title: "Математика: дроби", intro: "Дробь показывает часть целого. Числитель сверху показывает количество частей, знаменатель снизу - на сколько частей разделили целое.", formula: "1/2 = одна из двух частей", questions: [{ text: "Что показывает знаменатель дроби 3/5?", options: ["На сколько частей разделили", "Сколько частей взяли", "Номер страницы"], answer: 0 }, { text: "Какая дробь больше?", options: ["1/2", "1/4", "Они равны"], answer: 0 }, { text: "Чему равна половина от 10?", options: ["5", "2", "20"], answer: 0 }] }, kk: { title: "Математика: бөлшектер", intro: "Бөлшек бүтіннің бір бөлігін көрсетеді. Алымы - алынған бөлік саны, бөлімі - бүтіннің неше бөлікке бөлінгені.", formula: "1/2 = екі бөліктің бірі", questions: [{ text: "3/5 бөлшегінің бөлімі нені көрсетеді?", options: ["Неше бөлікке бөлінгенін", "Неше бөлік алынғанын", "Бет нөмірін"], answer: 0 }, { text: "Қай бөлшек үлкен?", options: ["1/2", "1/4", "Тең"], answer: 0 }, { text: "10 санының жартысы неге тең?", options: ["5", "2", "20"], answer: 0 }] } },
  science: { ru: { title: "Естествознание: вещества", intro: "Вещества окружают нас. У них бывают твёрдое, жидкое и газообразное состояния.", formula: "твёрдое - жидкое - газ", questions: [{ text: "В каком состоянии вода в стакане?", options: ["Жидком", "Твёрдом", "Газообразном"], answer: 0 }, { text: "Лёд - это...", options: ["Твёрдая вода", "Газ", "Металл"], answer: 0 }, { text: "Что происходит с водой при кипении?", options: ["Она превращается в пар", "Она исчезает", "Она становится льдом"], answer: 0 }] }, kk: { title: "Жаратылыстану: заттар", intro: "Заттар бізді қоршайды. Олардың қатты, сұйық және газ күйі болады.", formula: "қатты - сұйық - газ", questions: [{ text: "Стақандағы су қандай күйде?", options: ["Сұйық", "Қатты", "Газ"], answer: 0 }, { text: "Мұз дегеніміз...", options: ["Қатты су", "Газ", "Металл"], answer: 0 }, { text: "Су қайнағанда не болады?", options: ["Бу пайда болады", "Жоғалады", "Мұзға айналады"], answer: 0 }] } },
  kazakh: { ru: { title: "Казахский язык: слова", intro: "Слова помогают назвать предмет, действие или признак. Учимся замечать их в предложении.", formula: "Кім? Не? Не істеді?", questions: [{ text: "Выбери слово-предмет.", options: ["Кітап", "Жүгіреді", "Әдемі"], answer: 0 }, { text: "Выбери слово-действие.", options: ["Оқиды", "Мектеп", "Көк"], answer: 0 }, { text: "На какой вопрос отвечает слово " + '«кітап»' + "?", options: ["Не?", "Кім?", "Не істеді?"], answer: 0 }] }, kk: { title: "Қазақ тілі: сөздер", intro: "Сөздер затты, қимылды немесе белгіні атайды. Оларды сөйлемнен табуды үйренеміз.", formula: "Кім? Не? Не істеді?", questions: [{ text: "Затты білдіретін сөзді таңда.", options: ["Кітап", "Жүгіреді", "Әдемі"], answer: 0 }, { text: "Қимылды білдіретін сөзді таңда.", options: ["Оқиды", "Мектеп", "Көк"], answer: 0 }, { text: "«Кітап» сөзі қай сұраққа жауап береді?", options: ["Не?", "Кім?", "Не істеді?"], answer: 0 }] } },
  history: { ru: { title: "История Казахстана: источники", intro: "Историю изучают по источникам: предметам, документам, фотографиям и рассказам.", formula: "источник -> факт -> вывод", questions: [{ text: "Что может быть историческим источником?", options: ["Старинная монета", "Будущее", "Сон"], answer: 0 }, { text: "Что помогает узнать фото?", options: ["Как выглядело прошлое", "Только погоду завтра", "Только математику"], answer: 0 }, { text: "Зачем изучать историю?", options: ["Понимать прошлое страны", "Не учиться", "Только играть"], answer: 0 }] }, kk: { title: "Қазақстан тарихы: деректер", intro: "Тарихты заттар, құжаттар, фотосуреттер және әңгімелер арқылы зерттейді.", formula: "дерек -> факт -> қорытынды", questions: [{ text: "Тарихи дерекке не жатады?", options: ["Ескі тиын", "Болашақ", "Түс"], answer: 0 }, { text: "Фотосурет нені білуге көмектеседі?", options: ["Өткеннің көрінісін", "Ертеңгі ауа райын", "Тек математиканы"], answer: 0 }, { text: "Тарихты не үшін оқимыз?", options: ["Елдің өткенін түсіну үшін", "Оқымас үшін", "Тек ойнау үшін"], answer: 0 }] } },
  geography: { ru: { title: "География: карта", intro: "Карта уменьшенно показывает поверхность Земли. Условные знаки помогают её читать.", formula: "карта = местность в масштабе", questions: [{ text: "Что показывает карта?", options: ["Местность", "Только буквы", "Только время"], answer: 0 }, { text: "Глобус - это модель...", options: ["Земли", "Луны", "Телефона"], answer: 0 }, { text: "Для чего нужны условные знаки?", options: ["Понимать карту", "Украшать тетрадь", "Считать"], answer: 0 }] }, kk: { title: "География: карта", intro: "Карта Жер бетін кішірейтіп көрсетеді. Шартты белгілер оны оқуға көмектеседі.", formula: "карта = масштабтағы жер", questions: [{ text: "Карта нені көрсетеді?", options: ["Жергілікті жерді", "Тек әріптерді", "Тек уақытты"], answer: 0 }, { text: "Глобус ненің үлгісі?", options: ["Жердің", "Айдың", "Телефонның"], answer: 0 }, { text: "Шартты белгілер не үшін керек?", options: ["Картаны түсіну үшін", "Дәптерді безендіру үшін", "Санау үшін"], answer: 0 }] } },
  informatics: { ru: { title: "Информатика: алгоритм", intro: "Алгоритм - это точная последовательность действий для выполнения задачи.", formula: "начало -> шаги -> результат", questions: [{ text: "Что такое алгоритм?", options: ["Порядок действий", "Компьютерная игра", "Только рисунок"], answer: 0 }, { text: "Каким должен быть алгоритм?", options: ["Понятным и последовательным", "Случайным", "Очень длинным всегда"], answer: 0 }, { text: "Что будет первым шагом алгоритма?", options: ["Начало", "Результат", "Конец"], answer: 0 }] }, kk: { title: "Информатика: алгоритм", intro: "Алгоритм - тапсырманы орындауға арналған әрекеттердің нақты реті.", formula: "басы -> қадамдар -> нәтиже", questions: [{ text: "Алгоритм дегеніміз не?", options: ["Әрекеттер реті", "Компьютерлік ойын", "Тек сурет"], answer: 0 }, { text: "Алгоритм қандай болуы керек?", options: ["Түсінікті және ретімен", "Кездейсоқ", "Әрдайым өте ұзын"], answer: 0 }, { text: "Алгоритмнің бірінші қадамы?", options: ["Басы", "Нәтиже", "Соңы"], answer: 0 }] } }
} as const;

const juniorSubjectCards = [
  { id: "math", icon: "∑", title: "Математика", text: "Числа, дроби, задачи" },
  { id: "science", icon: "◌", title: "Естествознание", text: "Живая и неживая природа" },
  { id: "kazakh", icon: "Қ", title: "Казахский язык", text: "Слова, речь, текст" },
  { id: "russian", icon: "Я", title: "Русский язык", text: "Грамматика и текст" },
  { id: "english", icon: "Aa", title: "Английский", text: "Слова и общение" },
  { id: "history", icon: "⌛", title: "История Казахстана", text: "События и источники" },
  { id: "geography", icon: "⌖", title: "География", text: "Карта и Земля" },
  { id: "informatics", icon: "▣", title: "Информатика", text: "Алгоритмы и цифровой мир" }
] as const;

const lessons: Lesson[] = [
  { id: 1, title: "Электрический ток", subtitle: "Что заставляет лампу гореть", icon: "ϟ", color: "yellow", building: "Станция тока", why: "Чтобы понять, как работают зарядка, фонарик и домашняя проводка.", description: "Электрический ток - это упорядоченное движение заряженных частиц. В металлах движутся электроны.", questions: [
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

const seniorSubjectCards = [
  { id: "physics", icon: "ϟ", title: "Физика", text: "Энергополис: 8 тем и практика", status: "Открыто" },
  { id: "algebra", icon: "∑", title: "Алгебра", text: "Уравнения, функции, неравенства", status: "Скоро" },
  { id: "chemistry", icon: "⚗", title: "Химия", text: "Реакции, атомы, вещества", status: "Скоро" },
  { id: "english", icon: "Aa", title: "Английский", text: "Грамматика, слова, разговор", status: "Скоро" },
  { id: "russian", icon: "Я", title: "Русский язык", text: "Орфография, грамматика, текст", status: "Скоро" },
  { id: "biology", icon: "⌬", title: "Биология", text: "Клетка, организм, экология", status: "Открыто" },
  { id: "exam", icon: "★", title: "Госэкзамен", text: "Пробные задания и слабые темы", status: "Скоро" }
];

const baseQuickLessons = {
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

const biologyQuickLessons = { biology: { ru: { title: "Биология: живая клетка", intro: "Клетка - самая маленькая живая система. У неё есть оболочка, цитоплазма и ядро, которое хранит важную информацию.", formula: "клетки -> ткани -> органы -> организм", questions: [{ text: "Что является основной единицей живого?", options: ["Клетка", "Камень", "Облако"], answer: 0 }, { text: "Что хранит информацию в клетке?", options: ["Ядро", "Лист", "Песок"], answer: 0 }, { text: "Из клеток образуются...", options: ["Ткани", "Только звёзды", "Дороги"], answer: 0 }] }, kk: { title: "Биология: тірі жасуша", intro: "Жасуша - тірі ағзаның ең кіші жүйесі. Оның қабықшасы, цитоплазмасы және маңызды ақпарат сақтайтын ядросы бар.", formula: "жасуша -> ұлпа -> мүше -> ағза", questions: [{ text: "Тірі ағзаның негізгі бірлігі не?", options: ["Жасуша", "Тас", "Бұлт"], answer: 0 }, { text: "Жасушада ақпаратты не сақтайды?", options: ["Ядро", "Жапырақ", "Құм"], answer: 0 }, { text: "Жасушалардан не түзіледі?", options: ["Ұлпалар", "Тек жұлдыздар", "Жолдар"], answer: 0 }] } } } as const;
const quickLessons = { ...baseQuickLessons, ...juniorQuickLessons, ...biologyQuickLessons };
const subjectCards = [...seniorSubjectCards, ...juniorSubjectCards];

const subjectLabels = {
  physics: { kkTitle: "Физика", kkText: "Энергополис: 8 тақырып және практика" },
  algebra: { kkTitle: "Алгебра", kkText: "Теңдеулер, функциялар, теңсіздіктер" },
  chemistry: { kkTitle: "Химия", kkText: "Реакциялар, атомдар, заттар" },
  english: { kkTitle: "Ағылшын тілі", kkText: "Грамматика, сөздер, сөйлесу" },
  russian: { kkTitle: "Орыс тілі", kkText: "Емле, грамматика, мәтін" },
  biology: { kkTitle: "Биология", kkText: "Жасуша, ағза, экология" },
  exam: { kkTitle: "Мемлекеттік емтихан", kkText: "Сынақ тапсырмалары және әлсіз тақырыптар" },
  math: { kkTitle: "Математика", kkText: "Сандар, бөлшектер, есептер" },
  science: { kkTitle: "Жаратылыстану", kkText: "Тірі және өлі табиғат" },
  kazakh: { kkTitle: "Қазақ тілі", kkText: "Сөздер, сөйлеу, мәтін" },
  history: { kkTitle: "Қазақстан тарихы", kkText: "Оқиғалар және деректер" },
  geography: { kkTitle: "География", kkText: "Карта және Жер" },
  informatics: { kkTitle: "Информатика", kkText: "Алгоритмдер және цифрлық әлем" }
} as const;

const gradePrograms = {
  5: { ru: "Естествознание, математика, русский и английский: база, наблюдения и первые эксперименты.", kk: "Жаратылыстану, математика, қазақ және ағылшын тілі: негіздер, бақылау және алғашқы тәжірибелер." },
  6: { ru: "Математика, естествознание, языки: дроби, пропорции, вещества и простые тексты.", kk: "Математика, жаратылыстану, тілдер: бөлшектер, пропорциялар, заттар және қарапайым мәтіндер." },
  7: { ru: "Алгебра, геометрия, физика, химия и языки: начинаем предметные маршруты.", kk: "Алгебра, геометрия, физика, химия және тілдер: пәндік бағыттарды бастаймыз." },
  8: { ru: "Алгебра, физика, химия и языки: формулы, реакции и практические задачи.", kk: "Алгебра, физика, химия және тілдер: формулалар, реакциялар және практикалық тапсырмалар." },
  9: { ru: "Казахстанская программа 9 класса: физика, алгебра, химия, английский, русский и подготовка к экзамену.", kk: "Қазақстанның 9-сынып бағдарламасы: физика, алгебра, химия, ағылшын, орыс тілі және емтиханға дайындық." },
  10: { ru: "Профильная подготовка: углублённые задачи, естественные науки и подготовка к следующим экзаменам.", kk: "Бейіндік дайындық: тереңдетілген тапсырмалар, жаратылыстану ғылымдары және келесі емтихандарға дайындық." }
} as const;

const buildOptions = [
  { id: "lab", ru: "Лаборатория", kk: "Зертхана", mark: "Л" },
  { id: "library", ru: "Библиотека", kk: "Кітапхана", mark: "К" },
  { id: "arena", ru: "Арена знаний", kk: "Білім аренасы", mark: "А" },
  { id: "garden", ru: "Сад идей", kk: "Идеялар бағы", mark: "И" }
] as const;

const cityRoles = [
  { id: "builder", ru: "Строитель", kk: "Құрылысшы" },
  { id: "researcher", ru: "Исследователь", kk: "Зерттеуші" },
  { id: "mentor", ru: "Наставник", kk: "Ұстаз" }
] as const;

const avatarOptions = [
  { id: "bars", ru: "Барс", kk: "Барыс" },
  { id: "ayan", ru: "Аян", kk: "Аян" },
  { id: "aisha", ru: "Айша", kk: "Айша" }
] as const;

const cityNpcs = [
  { lot: 2, ru: "Привет! Построй библиотеку, и я дам тебе книжную миссию.", kk: "Сәлем! Кітапхана салсаң, саған кітап миссиясын беремін." },
  { lot: 9, ru: "Здесь будет научный фестиваль. Загляни в лабораторию!", kk: "Мұнда ғылыми фестиваль болады. Зертханаға кіріп шық!" },
  { lot: 4, ru: "Я тренирую команду для Арены знаний. Присоединяйся!", kk: "Мен Білім аренасына команда дайындап жатырмын. Қосыл!" },
  { lot: 7, ru: "В саду идей можно отдохнуть и получить новую миссию.", kk: "Идеялар бағында демалып, жаңа миссия алуға болады." },
  { lot: 11, ru: "Город растёт! Нам нужна ещё одна лаборатория.", kk: "Қала өсіп жатыр! Бізге тағы бір зертхана керек." }
] as const;

type CityLot = { buildingId: (typeof buildOptions)[number]["id"]; readyAt: number };

const extraQuestions: Record<number, Lesson["questions"]> = {
  1: [{ text: "Что создаёт ток в простой цепи?", options: ["Источник энергии", "Линейка", "Стекло"], answer: 0, hint: "Вспомни батарейку." }, { text: "Проводник - это материал, который...", options: ["проводит ток", "не пропускает ток", "всегда светится"], answer: 0, hint: "Например, медь." }],
  2: [{ text: "Как обозначают напряжение?", options: ["U", "I", "P"], answer: 0, hint: "Эта буква используется в формуле закона Ома." }, { text: "У батарейки 1,5 В. Число 1,5 показывает...", options: ["напряжение", "сопротивление", "массу"], answer: 0, hint: "Единица В - вольт." }],
  3: [{ text: "Как обозначают сопротивление?", options: ["R", "U", "A"], answer: 0, hint: "Эта буква есть в формуле I = U / R." }, { text: "Какой материал имеет большое сопротивление?", options: ["Резина", "Медь", "Алюминий"], answer: 0, hint: "Из него делают изоляцию проводов." }],
  4: [{ text: "U = 9 В, R = 3 Ом. Чему равен ток?", options: ["3 А", "6 А", "27 А"], answer: 0, hint: "I = U / R, раздели 9 на 3." }, { text: "Если напряжение увеличить, а R не менять, ток...", options: ["увеличится", "уменьшится", "исчезнет"], answer: 0, hint: "Посмотри на числитель формулы." }],
  5: [{ text: "U = 10 В, I = 2 А. Мощность равна...", options: ["20 Вт", "5 Вт", "12 Вт"], answer: 0, hint: "P = U x I." }, { text: "Что означает мощность 60 Вт?", options: ["Энергия расходуется быстрее, чем у 40 Вт", "Это напряжение", "Это сопротивление"], answer: 0, hint: "Сравни две лампы." }],
  6: [{ text: "Если добавить лампу последовательно, общее сопротивление...", options: ["увеличится", "уменьшится", "не изменится"], answer: 0, hint: "Сопротивления складываются." }, { text: "Ток в последовательной цепи везде...", options: ["одинаковый", "разный", "нулевой"], answer: 0, hint: "У него только один путь." }],
  7: [{ text: "В параллельной цепи ветви работают...", options: ["независимо", "только вместе", "по очереди"], answer: 0, hint: "Так устроено освещение дома." }, { text: "Сколько ветвей может быть в параллельной цепи?", options: ["Две и больше", "Только одна", "Ни одной"], answer: 0, hint: "Это несколько дорог для тока." }],
  8: [{ text: "Если мощность не меняется, а время растёт, работа...", options: ["увеличивается", "уменьшается", "равна нулю"], answer: 0, hint: "A = P x t." }, { text: "Что измеряет электросчётчик дома?", options: ["Расход энергии", "Сопротивление", "Температуру"], answer: 0, hint: "Обычно в кВт·ч." }]
};

function shuffleQuestionOptions(questions: Lesson["questions"]) {
  return questions.map((question) => {
    const options = question.options.map((option, index) => ({ option, isCorrect: index === question.answer }));
    for (let index = options.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [options[index], options[swapIndex]] = [options[swapIndex], options[index]];
    }
    return { ...question, options: options.map((item) => item.option), answer: options.findIndex((item) => item.isCorrect) };
  });
}

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
  const [grade, setGrade] = useState<keyof typeof gradePrograms>(9);
  const [showTeacher, setShowTeacher] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<(typeof buildOptions)[number]["id"]>("lab");
  const [cityLots, setCityLots] = useState<Record<number, CityLot>>({});
  const [clock, setClock] = useState(Date.now());
  const [cityRole, setCityRole] = useState<(typeof cityRoles)[number]["id"]>("builder");
  const [dragLot, setDragLot] = useState<number | null>(null);
  const [cityMode, setCityMode] = useState<"build" | "walk">("build");
  const [avatarId, setAvatarId] = useState<(typeof avatarOptions)[number]["id"]>("bars");
  const [avatarLot, setAvatarLot] = useState(0);
  const [npcMessage, setNpcMessage] = useState("");
  const [moves, setMoves] = useState(0);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);
  const [activityCount, setActivityCount] = useState(0);
  const [showSecretHero, setShowSecretHero] = useState(false);
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
    const savedGrade = Number(localStorage.getItem("bilim-city-grade"));
    if (savedGrade >= 5 && savedGrade <= 10) setGrade(savedGrade as keyof typeof gradePrograms);
    const savedLots = localStorage.getItem("bilim-city-lots");
    if (savedLots) {
      const parsedLots = JSON.parse(savedLots) as Record<number, CityLot | (typeof buildOptions)[number]["id"]>;
      const migratedLots = Object.fromEntries(Object.entries(parsedLots).map(([lot, value]) => [lot, typeof value === "string" ? { buildingId: value, readyAt: 0 } : value])) as Record<number, CityLot>;
      setCityLots(migratedLots);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.grade = String(grade);
  }, [grade]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lots = Array.from(document.querySelectorAll<HTMLButtonElement>(".build-lot"));
    const cleanups = lots.map((element, lot) => {
      const onStart = () => { if (element.classList.contains("built")) startBuildingRemoval(lot); };
      const onStop = () => stopBuildingRemoval();
      element.addEventListener("pointerdown", onStart);
      element.addEventListener("pointerup", onStop);
      element.addEventListener("pointerleave", onStop);
      return () => { element.removeEventListener("pointerdown", onStart); element.removeEventListener("pointerup", onStop); element.removeEventListener("pointerleave", onStop); };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [cityLots]);

  useEffect(() => {
    if (activityCount === 0 || activityCount % 8 !== 0) return;
    setShowSecretHero(true);
    const timer = window.setTimeout(() => setShowSecretHero(false), 3000);
    return () => window.clearTimeout(timer);
  }, [activityCount]);

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
    setShowGreeting(false);
    setActive({ ...lesson, questions: shuffleQuestionOptions([...lesson.questions, ...extraQuestions[lesson.id]]) }); setStep(0); setAnswers([]); setHint(false); setFeedback(null); setShowTest(false);
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

  function changeGrade(nextGrade: number) {
    const selectedGrade = nextGrade as keyof typeof gradePrograms;
    setGrade(selectedGrade);
    localStorage.setItem("bilim-city-grade", String(selectedGrade));
  }

  function buildOnLot(lot: number) {
    const nextLots = { ...cityLots, [lot]: { buildingId: selectedBuilding, readyAt: Date.now() + 12000 } };
    setCityLots(nextLots);
    localStorage.setItem("bilim-city-lots", JSON.stringify(nextLots));
    playConstructionSound();
    setActivityCount((count) => count + 1);
  }

  function moveBuilding(targetLot: number) {
    if (dragLot === null || dragLot === targetLot || cityLots[targetLot]) return;
    const nextLots = { ...cityLots, [targetLot]: cityLots[dragLot] };
    delete nextLots[dragLot];
    setCityLots(nextLots);
    localStorage.setItem("bilim-city-lots", JSON.stringify(nextLots));
    setDragLot(null);
    setMoves((count) => count + 1);
    setActivityCount((count) => count + 1);
  }

  function removeBuilding(lot: number) {
    const nextLots = { ...cityLots };
    delete nextLots[lot];
    setCityLots(nextLots);
    localStorage.setItem("bilim-city-lots", JSON.stringify(nextLots));
  }

  function startBuildingRemoval(lot: number) {
    if (!cityLots[lot]) return;
    const timer = window.setTimeout(() => { removeBuilding(lot); setHoldTimer(null); }, 850);
    setHoldTimer(timer);
  }

  function stopBuildingRemoval() {
    if (holdTimer !== null) window.clearTimeout(holdTimer);
    setHoldTimer(null);
  }

  function moveAvatar(lot: number) {
    setAvatarLot(lot);
    setActivityCount((count) => count + 1);
    const npc = cityNpcs.find((character) => character.lot === lot);
    setNpcMessage(npc ? (isKazakh ? npc.kk : npc.ru) : (isKazakh ? "Қаланы зерттеп жүрсің. Ғимараттар мен тұрғындар саған миссия береді." : "Ты исследуешь город. Здания и жители будут давать тебе миссии."));
  }

  function playConstructionSound() {
    const AudioContext = window.AudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    [0, 0.18, 0.36].forEach((delay, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(110 + index * 35, context.currentTime + delay);
      gain.gain.setValueAtTime(0.001, context.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + delay + 0.13);
      oscillator.connect(gain); gain.connect(context.destination); oscillator.start(context.currentTime + delay); oscillator.stop(context.currentTime + delay + 0.14);
    });
    window.setTimeout(() => context.close(), 700);
  }

  function openQuickLesson(subjectId: keyof typeof quickLessons) {
    setShowGreeting(false);
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

  return <main className={`app-shell ${darkTheme ? "theme-dark" : ""}`}><header><div className="brand"><div className="brand-mark">B</div><div><strong>Bilim City</strong><span>Энергополис</span></div></div><div className="header-stats"><button className="teacher-entry" onClick={() => setShowTeacher(true)}>{isKazakh ? "Мұғалімдерге" : "Учителям"}</button><div className="settings-wrap"><button className="settings-toggle" onClick={() => setShowSettings(!showSettings)} aria-expanded={showSettings} aria-label={isKazakh ? "Баптаулар" : "Настройки"} title={isKazakh ? "Баптаулар" : "Настройки"}>⚙</button>{showSettings && <section className="settings-panel"><strong>{isKazakh ? "Баптаулар" : "Настройки"}</strong><span>{isKazakh ? "Сынып" : "Класс"}</span><select className="grade-select" value={grade} onChange={(event) => changeGrade(Number(event.target.value))}>{[5, 6, 7, 8, 9, 10].map((item) => <option value={item} key={item}>{item} {isKazakh ? "сынып" : "класс"}</option>)}</select><span>{isKazakh ? "Тіл" : "Язык"}</span><div className="language-toggle" aria-label="Выбор языка"><button className={language === "kk" ? "active" : ""} onClick={() => changeLanguage("kk")}>KZ</button><button className={language === "ru" ? "active" : ""} onClick={() => changeLanguage("ru")}>RU</button></div><span>{isKazakh ? "Фон" : "Фон"}</span><button className="settings-theme" onClick={toggleTheme}>{darkTheme ? (isKazakh ? "Ашық фон" : "Светлый фон") : (isKazakh ? "Қара фон" : "Тёмный фон")}</button></section>}</div><span className="energy">⚡ {energy}</span><span className="avatar">{student.slice(0, 1).toUpperCase()}</span></div></header>
    {showGreeting && <div className="greeting-backdrop"><section className="greeting-card" role="dialog" aria-modal="true"><img src="/mascot/bilim-leopard.png" alt="Барс Bilim City" /><div><p className="eyebrow">{isKazakh ? "СЕНІҢ ҰСТАЗЫҢ" : "ТВОЙ НАСТАВНИК"}</p><h2>{isKazakh ? `Сәлем, ${student}!` : `Привет, ${student}!`}</h2><p>{isKazakh ? "Күнің сәтті өтсін. Бүгін бір тақырыпты талдап, қалаға энергия берейік." : "Хорошего дня. Давай сегодня разберем одну тему и дадим городу немного энергии."}</p><button className="primary" onClick={() => setShowGreeting(false)}>{isKazakh ? "Күнді бастау" : "Начать день"}</button></div></section></div>}
    {showSecretHero && <div className="secret-hero" role="status"><img src="/secret-hero.png" alt="Секретный герой" /><span>{isKazakh ? "ҚУАТ РЕЖИМІ!" : "РЕЖИМ СИЛЫ!"}</span></div>}
    <section className="welcome"><div><p className="eyebrow">ТВОЙ УЧЕБНЫЙ ГОРОД</p><h1>Привет, {student}!</h1><p>Сегодня ты можешь дать городу еще немного энергии.</p></div><div className="progress-card"><div><span>Прогресс района</span><strong>{progress}%</strong></div><div className="meter"><i style={{ width: `${progress}%` }} /></div><small>{completed.length} из {lessons.length} объектов запущено</small></div></section>
    <section className="program-card"><div><p className="eyebrow">{isKazakh ? "СЕНІҢ БАҒДАРЛАМАҢ" : "ТВОЯ ПРОГРАММА"}</p><h2>{grade} {isKazakh ? "сынып · Қазақстан" : "класс · Казахстан"}</h2><p>{gradePrograms[grade][language]}</p></div><button onClick={() => setShowSettings(true)}>{isKazakh ? "Сыныпты өзгерту" : "Изменить класс"}</button></section>
    <section className="subjects-section"><div className="section-head"><div><p className="eyebrow">{isKazakh ? `${grade}-СЫНЫП ПӘНДЕРІ` : `ПРЕДМЕТЫ ${grade} КЛАССА`}</p><h2>{isKazakh ? "Бағытты таңда" : "Выбери маршрут"}</h2></div><span className="map-note">{isKazakh ? "Барлық пән бір ойында" : "Все предметы в одной игре"}</span></div><div className="subject-grid">{subjectCards.map((subject) => <button key={subject.id} className={`subject-card subject-${subject.id} ${activeSubject === subject.id ? "selected" : ""}`} onClick={() => openQuickLesson(subject.id as keyof typeof quickLessons)}><span className="subject-icon">{subject.icon}</span><small>{language === "kk" ? "АШЫҚ" : "ОТКРЫТО"}</small><strong>{language === "kk" ? subjectLabels[subject.id as keyof typeof subjectLabels].kkTitle : subject.title}</strong><p>{language === "kk" ? subjectLabels[subject.id as keyof typeof subjectLabels].kkText : subject.text}</p><b className="subject-action">{language === "kk" ? "Сабақты бастау →" : "Начать урок →"}</b></button>)}</div></section>
    <section className="builder-section"><div className="section-head"><div><p className="eyebrow">{isKazakh ? "СЕНІҢ ҚАЛАҢ" : "ТВОЙ ГОРОД"}</p><h2>{isKazakh ? "Bilim City: құрылыс және серуен" : "Bilim City: строительство и прогулка"}</h2></div></div><div className="builder-toolbar"><div className="role-picker"><button className={cityMode === "build" ? "active" : ""} onClick={() => setCityMode("build")}>{isKazakh ? "Құрылыс" : "Строить"}</button><button className={cityMode === "walk" ? "active" : ""} onClick={() => setCityMode("walk")}>{isKazakh ? "Серуен" : "Гулять"}</button>{cityRoles.map((role) => <button key={role.id} className={cityRole === role.id ? "active" : ""} onClick={() => setCityRole(role.id)}>{isKazakh ? role.kk : role.ru}</button>)}</div><div className="building-picker">{cityMode === "build" ? buildOptions.map((building) => <button key={building.id} className={selectedBuilding === building.id ? "active" : ""} onClick={() => setSelectedBuilding(building.id)}><b>{building.mark}</b>{isKazakh ? building.kk : building.ru}</button>) : avatarOptions.map((avatar) => <button key={avatar.id} className={avatarId === avatar.id ? "active" : ""} onClick={() => setAvatarId(avatar.id)}><b>{avatar.id.slice(0,1).toUpperCase()}</b>{isKazakh ? avatar.kk : avatar.ru}</button>)}</div></div><div className="builder-map">{Array.from({ length: 12 }, (_, lot) => { const lotData = cityLots[lot]; const built = buildOptions.find((building) => building.id === lotData?.buildingId); const isBuilding = Boolean(lotData && lotData.readyAt > clock); const secondsLeft = lotData ? Math.max(0, Math.ceil((lotData.readyAt - clock) / 1000)) : 0; const progress = lotData ? Math.min(100, Math.max(0, ((12000 - Math.max(0, lotData.readyAt - clock)) / 12000) * 100)) : 0; return <button key={lot} draggable={cityMode === "build" && Boolean(built && !isBuilding)} className={`build-lot ${built && !isBuilding ? `built ${built.id}` : ""} ${isBuilding ? "under-construction" : ""}`} onDragStart={() => setDragLot(lot)} onDragEnd={() => setDragLot(null)} onDragOver={(event) => { if (dragLot !== null) event.preventDefault(); }} onDrop={() => moveBuilding(lot)} onDoubleClick={() => cityMode === "build" && built && !isBuilding && removeBuilding(lot)} onClick={() => cityMode === "walk" ? moveAvatar(lot) : !built && !isBuilding && buildOnLot(lot)}>{isBuilding ? <div className="build-timer"><b>{secondsLeft}</b><span>{isKazakh ? "сек. қалды" : "сек. осталось"}</span><i><em style={{ width: `${progress}%` }} /></i></div> : built ? <><b>{built.mark}</b><span>{isKazakh ? built.kk : built.ru}</span></> : <><i>+</i><span>{cityMode === "walk" ? (isKazakh ? "Бар" : "Идти") : (isKazakh ? "Салу" : "Построить")}</span></>}{avatarLot === lot && <strong className={`city-avatar ${avatarId}`}>{avatarId === "bars" ? "Б" : avatarId === "ayan" ? "А" : "А"}</strong>}{cityNpcs.filter((npc) => npc.lot === lot).map((npc) => <em className="city-npc" key={npc.lot}>●</em>)}</button>; })}</div><p className="builder-status">{npcMessage || (isKazakh ? "Серуен режимінде қала бойынша жүріп, тұрғындармен таныс." : "В режиме прогулки ходи по городу и знакомься с жителями.")}</p></section>
    <section className="mission-section"><div className="section-head"><div><p className="eyebrow">{isKazakh ? "ҚАЛА МИССИЯЛАРЫ" : "МИССИИ ГОРОДА"}</p><h2>{isKazakh ? "Тестсіз тапсырмалар" : "Задания без тестов"}</h2></div></div><div className="mission-grid"><article className={Object.keys(cityLots).length >= 2 ? "mission-done" : ""}><b>{Object.keys(cityLots).length >= 2 ? "✓" : "1"}</b><strong>{isKazakh ? "Қаланы сал" : "Построй город"}</strong><p>{isKazakh ? "Екі ғимарат сал" : "Построй два здания"}</p></article><article className={npcMessage ? "mission-done" : ""}><b>{npcMessage ? "✓" : "2"}</b><strong>{isKazakh ? "Тұрғынмен таныс" : "Познакомься с жителем"}</strong><p>{isKazakh ? "Серуен режимінде NPC-ге бар" : "В режиме прогулки приди к NPC"}</p></article><article className={moves > 0 ? "mission-done" : ""}><b>{moves > 0 ? "✓" : "3"}</b><strong>{isKazakh ? "Ауданды жоспарла" : "Спланируй район"}</strong><p>{isKazakh ? "Дайын ғимаратты басқа жерге сүйре" : "Перетащи готовое здание на другой участок"}</p></article></div></section>
    <section className="city-section"><div className="section-head"><div><p className="eyebrow">КАРТА ГОРОДА</p><h2>Энергополис</h2></div><span className="map-note">Выбери объект на карте</span></div><div className="city-map">
      <div className="river" /><div className="road r1" /><div className="road r2" />
      {lessons.map((lesson, index) => { const isDone = completed.includes(lesson.id); const unlocked = lesson.id === 1 || completed.includes(lesson.id - 1); return <button key={lesson.id} className={`map-building building-${lesson.id} ${isDone ? "done" : ""} ${!unlocked ? "locked" : ""}`} onClick={() => openLesson(lesson)} aria-label={lesson.title}><span className={`building-shape ${lesson.color}`}>{isDone ? "✓" : lesson.icon}</span><b>{lesson.building}</b><small>{isDone ? "Запущено" : unlocked ? "Открыто" : "Нужен прошлый урок"}</small>{index < lessons.length - 1 && <em>→</em>}</button>; })}
    </div></section>
    <section className="lesson-section"><div className="section-head"><div><p className="eyebrow">МАРШРУТ</p><h2>Уроки энергии</h2></div><span className="map-note">10 минут на тему</span></div><div className="lesson-grid">{lessons.map((lesson) => { const unlocked = lesson.id === 1 || completed.includes(lesson.id - 1); const done = completed.includes(lesson.id); return <button className={`lesson-card ${!unlocked ? "disabled" : ""}`} key={lesson.id} onClick={() => openLesson(lesson)}><span className={`lesson-icon ${lesson.color}`}>{done ? "✓" : lesson.icon}</span><span><small>УРОВЕНЬ {lesson.id}</small><strong>{lesson.title}</strong><p>{done ? "Объект построен" : unlocked ? lesson.subtitle : "Пройди предыдущий уровень"}</p></span><i>{unlocked ? "→" : "🔒"}</i></button>; })}</div></section>
{showTeacher && <div className="modal-backdrop"><section className="lesson-modal teacher-modal" role="dialog" aria-modal="true"><button className="close" onClick={() => setShowTeacher(false)} aria-label="Закрыть">×</button><p className="eyebrow">{isKazakh ? "МҰҒАЛІМ РЕЖИМІ" : "РЕЖИМ УЧИТЕЛЯ"}</p><h2>{isKazakh ? "Сыныпқа шолу" : "Обзор класса"}</h2><div className="teacher-stats"><div><strong>{grade}</strong><span>{isKazakh ? "сынып" : "класс"}</span></div><div><strong>6</strong><span>{isKazakh ? "пән" : "предметов"}</span></div><div><strong>{completed.length}</strong><span>{isKazakh ? "аяқталған сабақ" : "уроков пройдено"}</span></div></div><p>{isKazakh ? "Бұл демо-нұсқа. Кейін мұнда оқушылар тізімі, тапсырма құрастыру және прогресс есебі қосылады." : "Это демо-версия. Позже здесь появятся список учеников, создание заданий и отчёт по прогрессу."}</p><button className="primary" onClick={() => setShowTeacher(false)}>{isKazakh ? "Кабинетке оралу" : "Вернуться в кабинет"}</button></section></div>}
{quickSubject && <div className="modal-backdrop"><section className="lesson-modal quick-modal" role="dialog" aria-modal="true"><button className="close" onClick={() => setQuickSubject(null)} aria-label="Закрыть">×</button>{quickAnswers.length === quickLessons[quickSubject][language].questions.length ? <div className="result"><div className="result-icon">★</div><p className="eyebrow">{language === "kk" ? "САБАҚ АЯҚТАЛДЫ" : "УРОК ЗАВЕРШЕН"}</p><h2>{quickAnswers.filter((answer, index) => answer === quickLessons[quickSubject][language].questions[index].answer).length} / {quickLessons[quickSubject][language].questions.length}</h2><p>{language === "kk" ? "Керемет! Келесі тақырыпты таңда." : "Отлично! Выбери следующую тему."}</p><button className="primary" onClick={() => setQuickSubject(null)}>{language === "kk" ? "Пәндерге оралу" : "Вернуться к предметам"}</button></div> : <><p className="eyebrow">{language === "kk" ? `${grade}-СЫНЫП · ҚАЗАҚСТАН` : `${grade} КЛАСС · КАЗАХСТАН`}</p><h2>{quickLessons[quickSubject][language].title}</h2><div className="meaning"><strong>{language === "kk" ? "Қысқа түсіндіру" : "Короткое объяснение"}</strong><p>{quickLessons[quickSubject][language].intro}</p></div><div className="quick-formula">{quickLessons[quickSubject][language].formula}</div><div className="question"><span>{language === "kk" ? "ТАПСЫРМА" : "ЗАДАНИЕ"} {quickStep + 1}/{quickLessons[quickSubject][language].questions.length}</span><h3>{quickLessons[quickSubject][language].questions[quickStep].text}</h3><div className="answers">{quickLessons[quickSubject][language].questions[quickStep].options.map((option, index) => { const chosen = quickAnswers[quickStep] === index; const state = chosen ? (index === quickLessons[quickSubject][language].questions[quickStep].answer ? "correct" : "wrong") : ""; return <button className={state} key={option} onClick={() => answerQuickLesson(index)}>{option}</button>; })}</div></div></>}</section></div>}
    {active && <div className="modal-backdrop" role="presentation"><section className="lesson-modal" role="dialog" aria-modal="true" aria-label={active.title}><button className="close" onClick={() => setActive(null)} aria-label="Закрыть">×</button>{answers.length === active.questions.length ? <div className="result"><div className="result-icon">{correct === active.questions.length ? "⚡" : "✦"}</div><p className="eyebrow">МИССИЯ ЗАВЕРШЕНА</p><h2>{correct} из {active.questions.length} верно</h2><p>{correct === active.questions.length ? `${active.building} снабжает город энергией.` : "Ты прошел уровень. Вернись позже и попробуй улучшить результат."}</p><div className="reward">+120 энергии</div><button className="primary" onClick={() => setActive(null)}>Вернуться в город</button></div> : <><div className="modal-top"><span className={`lesson-icon ${active.color}`}>{active.icon}</span><div><p className="eyebrow">УРОВЕНЬ {active.id} · {step + 1}/3</p><h2>{active.title}</h2></div></div><div className="meaning"><strong>Зачем это нужно?</strong><p>{active.why}</p></div><div className="explain"><p>{active.description}</p></div><section className="visual-lab" aria-label="Визуальное объяснение"><div className="visual-head"><span>АНИМАЦИЯ ЦЕПИ</span><b>Формула: {lessonVisuals[active.id - 1].formula}</b></div><div className="circuit-animation"><div className="battery"><i>+</i><i>-</i></div><div className="wire top-wire"><i /><i /><i /></div><div className="wire bottom-wire"><i /><i /><i /></div><div className="bulb"><span>⚡</span></div></div><p>{lessonVisuals[active.id - 1].caption}</p></section><section className={`lesson-stage ${showTest ? "lesson-complete" : ""}`}><img className="mascot-tip" src="/mascot/bilim-leopard.png" alt="Барс-наставник Bilim City" /><p className="eyebrow">{language === "kk" ? "САБАҚ АЯҚТАЛДЫ" : "СНАЧАЛА УРОК"}</p><h3>{language === "kk" ? "Формуланы түсініп, үлгіні қарап шық." : "Разберись с формулой и примером."}</h3><p>{language === "kk" ? `Мысал: ${lessonVisuals[active.id - 1].formula}. Енді тапсырмаларға өзің жауап бересің.` : `Пример: используй формулу ${lessonVisuals[active.id - 1].formula}. Теперь ты сможешь решать задания сам.`}</p>{!showTest && <button className="primary start-test" onClick={() => setShowTest(true)}>{language === "kk" ? "Түсіндім, тапсырмаларға өту" : "Я понял, начать задания"}</button>}</section><div className={`question ${showTest ? "" : "hidden-question"}`}><span>{language === "kk" ? "ТАПСЫРМА" : "Задание"}</span><h3>{currentQuestion?.text}</h3><div className="answers">{currentQuestion?.options.map((option, index) => { const chosen = answers[step] === index; const state = chosen ? (index === currentQuestion.answer ? "correct" : "wrong") : ""; return <button className={state} key={option} onClick={() => selectAnswer(index)}>{option}</button>; })}</div>{feedback && <div className={`answer-feedback ${feedback}`}><b>{feedback === "correct" ? "Верно!" : "Почти. Посмотри на формулу и попробуй еще раз в следующем вопросе."}</b><span>{feedback === "correct" ? "⚡ + энергия городу" : `Подсказка: ${currentQuestion?.hint}`}</span><div className="meme-strip">{feedback === "correct" ? "Мем дня: лампочка сияет, потому что ты не нажал наугад." : "Мем дня: формула не сердится. Она просит еще один спокойный шаг."}</div></div>}{hint ? <p className="hint">Подсказка: {currentQuestion?.hint}</p> : <button className="hint-btn" onClick={() => setHint(true)}>Нужна подсказка?</button>}</div></>}</section></div>}
    <footer className="site-footer"><strong>Автор: Нуралы Ильяс</strong><span>Команда QALA</span></footer>
  </main>;
}
