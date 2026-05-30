/* global React */
// Balogh Richárd — site content (Hungarian copy) — BUNDLE VERSION
// Resources are looked up via window.__resources at runtime (populated by bundler).
const R = (id, fallback) => (window.__resources && window.__resources[id]) || fallback;

const SITE = {
  brand: {
    name: "Balogh Richárd",
    role: "PÉNZÜGYI TANÁCSADÓ",
    location: "Országos lefedettség — személyesen: Debrecen és Budapest",
    monogram: "BR",
  },
  nav: [
    { href: "#foooldal",       label: "Főoldal" },
    { href: "#szolgaltatasok", label: "Szolgáltatások" },
    { href: "#kalkulator",     label: "Kalkulátor" },
    { href: "#tortenetunk",    label: "Történetem" },
    { href: "#kapcsolat",      label: "Kapcsolat" },
  ],
  hero: {
    eyebrow: "BÓNUSZ ÉLETPROGRAM",
    h1html: "Tervezd meg a következő <em>10 évedet</em>.",
    sub: "Segítek megépíteni azt a vagyont, amire egész életében szüksége lesz — kamatadó-mentesen, hűségbónusszal, teljes átláthatósággal.",
    primary: "Számolja ki",
    secondary: "Beszéljünk",
    get videoSrc()  { return R("heroVideo",   "assets/hero.mp4"); },
    get fallback()  { return R("heroFallback","https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1800&q=80"); },
  },
  services: {
    eyebrow: "SZOLGÁLTATÁSOK",
    title: "Miért a Bónusz Életprogram?",
    lead: "Hat valós előny, ami hosszú távon mérhető különbséget jelent — anélkül, hogy a megszokott életviteléhez hozzá kellene nyúlnia.",
    items: [
      { n: "01", title: "Magasabb hozam",
        desc: "Több eszközalap közül választhat, amelyek hosszú távon a banki betéteknél jelentősen kedvezőbb hozamot kínálnak. A portfólió az Ön kockázatviselő képességéhez igazodik.",
        get img() { return R("svc1","https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80"); } },
      { n: "02", title: "Kamatadó-mentes megtakarítás",
        desc: "A 10 éves megtakarítási idő letelte után az elért hozamra nem kell sem kamatadót, sem szociális hozzájárulást fizetnie — törvényi keretek között.",
        get img() { return R("svc2","https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80"); } },
      { n: "03", title: "Rugalmas feltételek",
        desc: "A havi befizetés szüneteltethető, a portfólió megosztható, részösszeg vagyonleltárral kivonható. A program együtt él Önnel — nem a fordítottja.",
        get img() { return R("svc3","https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=80"); } },
      { n: "04", title: "Hűségbónusz",
        desc: "A program lejárta után a tőkén felül egy külön juttatást is megkap — a kitartásáért. Ez egy plusz hozam, amit más megtakarítási formánál nem talál meg.",
        get img() { return R("svc4","https://images.unsplash.com/photo-1607863680198-23d4b2565df0?w=1200&q=80"); } },
      { n: "05", title: "Ingyenes baleseti biztosítás",
        desc: "A megtakarítás mellé baleseti haláleseti és rokkantsági fedezet jár — díjmentesen. A családja akkor sem marad fedezet nélkül, ha valami közbeszól.",
        get img() { return R("svc5","https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=80"); } },
      { n: "06", title: "Legalacsonyabb költségszerkezet",
        desc: "A piaci átlag alatti költséglevonás biztosítja, hogy a hozam nagyobb része valóban Önnél marad. Minden költség előre, fekete-fehéren látható.",
        get img() { return R("svc6","https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=1200&q=80"); } },
    ],
  },
  calculator: {
    eyebrow: "MEGTAKARÍTÁSI KALKULÁTOR",
    title: "Mutassa meg, mennyit szeretne félretenni.",
    lead: "Húzza a csúszkát a tervezett havi összegre. Az alábbi becslés a Bónusz Életprogram átlagos, hosszú távú hozamával számol — 7,2% évi átlaggal, 10 éves futamidőre.",
    annualReturn: 0.072,
    years: 10,
    minMonthly: 10000,
    maxMonthly: 200000,
    stepMonthly: 5000,
    defaultMonthly: 25000,
    bonusRatePct: 5,
    disclaimer:
      "Az itt szereplő adatok tájékoztató jellegűek és nem minősülnek ajánlattételnek. A tényleges hozam a választott eszközalaptól és a piaci viszonyoktól függően eltérhet. Részletes feltételekért keressen meg személyesen.",
  },
  timeline: {
    eyebrow: "A FOLYAMAT",
    title: "Hogyan dolgozunk együtt",
    lead: "Az első találkozótól a havi kontrollig — egy átlátható, négy lépcsős folyamat, amiben mindig Ön diktálja a tempót.",
    steps: [
      { n: "01", title: "Helyzetfelmérés",
        text: "Egy díjmentes, kötetlen beszélgetés keretében átnézzük a jelenlegi pénzügyi helyzetét, a céljait és a kockázatviselő képességét. Bizonyos kérdésekre talán Ön is most válaszol először." },
      { n: "02", title: "Személyre szabott igényfelmérés",
        text: "Az igényei alapján kidolgozok egy javaslatot — összegekkel, eszközalapokkal, lejáratokkal. Azt mutatja meg, mit tesz a pénze az Ön munkája helyett, ha hagyja." },
      { n: "03", title: "Szerződéskötés",
        text: "Csak akkor írunk alá, ha minden részlettel tisztában van. Egy megbízható biztosítói háttérrel, több mint 130 év tapasztalatával." },
      { n: "04", title: "Évenkénti felülvizsgálat",
        text: "A program nem statikus. Évente leülünk, értékeljük az eredményeket, és ha kell, finomhangoljuk a stratégiát az élete változásaihoz." },
    ],
  },
  team: {
    eyebrow: "TÖRTÉNETEM",
    title: "Aki mellett biztos kezekben van",
    lead: "[Ide jön egy rövid bemutatkozó szöveg — pár mondatban arról, hogy ki vagyok és miért érdemes velem dolgozni.]",
    members: [
      {
        role: "PÉNZÜGYI TANÁCSADÓ",
        name: "Balogh Richárd",
        bio: "[hiányzó szöveg bemutatkozáshoz]",
        get img() { return R("teamMilan","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&q=80"); },
        creds: [
          { num: "10+", lbl: "Aktív ügyfél" },
          { num: "2", lbl: "Év tapasztalat" },
          { num: "7,2%", lbl: "Átlagos hozam" },
        ],
        side: "left",
      },
    ],
  },
  contact: {
    eyebrow: "KAPCSOLAT",
    title: "Beszéljünk a terveiről.",
    lead: "Az első konzultáció díjmentes és kötelezettségmentes. Hívjon, írjon, vagy hagyjon üzenetet — 24 órán belül válaszolok személyesen.",
    items: [
      { icon: "phone",   lbl: "TELEFON", val: "..." },
      { icon: "mail",    lbl: "E-MAIL",  val: "richard.balogh@allianztanacsado.hu" },
      { icon: "map-pin", lbl: "IRODA",   val: "Debrecen" },
      { icon: "clock",   lbl: "FOGADÓÓRA", val: "?" },
    ],
  },
  footer: {
    tagline:
      "Független pénzügyi tanácsadás. A Bónusz Életprogram unit-linked életbiztosítási termék.",
    columns: [
      { head: "OLDALAK", links: [
          { label: "Főoldal",       href: "#foooldal" },
          { label: "Szolgáltatások", href: "#szolgaltatasok" },
          { label: "Kalkulátor",    href: "#kalkulator" },
          { label: "Történetem",   href: "#tortenetunk" },
          { label: "Kapcsolat",     href: "#kapcsolat" },
        ] },
      { head: "KÖVESSE", links: [
          { label: "LinkedIn", href: "#" },
          { label: "Facebook", href: "#" },
          { label: "YouTube",  href: "#" },
        ] },
    ],
    base: "© 2026 Balogh Richárd Pénzügyi Tanácsadó. Minden jog fenntartva.",
  },
  quiz: {
    eyebrow: "SZEMÉLYRE SZABOTT JAVASLAT",
    title: "Néhány kérdés a tervéről.",
    lead: "Két perc alatt válaszol — én pedig 24 órán belül összeállítok egy személyes javaslatot a megtakarítási céljához.",
    questions: [
      { id: "goal", q: "Mi a megtakarítás elsődleges célja?",
        help: "Több válasz közül egyet választhat — ez segít a megfelelő portfólió beállításában.",
        kind: "options", options: [
          { v: "retirement", label: "Nyugdíj-kiegészítés", help: "Hosszú táv, biztonságos hozam" },
          { v: "kids",       label: "Gyermek jövője",       help: "Tanulás, otthonteremtés" },
          { v: "house",      label: "Lakásvásárlás",        help: "5–15 éven belül" },
          { v: "freedom",    label: "Pénzügyi függetlenség", help: "Tartalék és szabadság" },
        ] },
      { id: "horizon", q: "Mennyi időre tervez?",
        help: "A program minimum 10 éves — de hosszabb futamidő tipikusan jobb eredményt hoz.",
        kind: "options", options: [
          { v: "10",  label: "10 év",      help: "Minimum futamidő" },
          { v: "15",  label: "15 év",      help: "Ajánlott egyensúly" },
          { v: "20",  label: "20+ év",     help: "Maximális hozampotenciál" },
          { v: "?",   label: "Még nem tudom", help: "Beszéljük át" },
        ] },
      { id: "monthly", q: "Havonta mennyit tudna félretenni?",
        help: "Tájékoztató összeg — a végleges keretet közösen alakítjuk ki.",
        kind: "options", options: [
          { v: "10-25",  label: "10 – 25 ezer Ft",  help: "Kezdő keret" },
          { v: "25-50",  label: "25 – 50 ezer Ft",  help: "Tipikus" },
          { v: "50-100", label: "50 – 100 ezer Ft", help: "Aktív vagyonépítés" },
          { v: "100+",   label: "100 ezer Ft felett", help: "Vagyonkezelés" },
        ] },
      { id: "experience", q: "Volt már megtakarítási vagy befektetési terméke?",
        help: "Akármi, ami nem készpénz vagy bankbetét.",
        kind: "options", options: [
          { v: "none",     label: "Nem, ez lenne az első", help: "Nyugodtan kezdjük az alapoknál" },
          { v: "passive",  label: "Volt, de kifutott",     help: "Új koncepciót keresek" },
          { v: "active",   label: "Igen, jelenleg is van", help: "Bővíteném vagy átrendezném" },
          { v: "investor", label: "Aktívan befektetek",    help: "Portfóliót diverzifikálnék" },
        ] },
      { id: "contact", kind: "contact",
        q: "Hová küldjem a személyes javaslatot?",
        help: "Az adatait kizárólag az Ön javaslatának összeállítására használom — harmadik félnek soha nem adom át." },
    ],
  },
};

window.SITE = SITE;
