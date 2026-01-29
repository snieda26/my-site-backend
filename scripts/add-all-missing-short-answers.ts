import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import * as schema from '../src/core/database/schema';

const postgres = require('postgres');

dotenv.config({ path: '.env' });

let connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');
connectionString = connectionString.split('?')[0];

const { questions } = schema;

const shortAnswers: Record<string, { en: string; ua: string }> = {
  // ===== ANGULAR =====
  'component-lifecycle-methods-in-angular': {
    en: `Angular components have lifecycle hooks that allow you to tap into key moments:

- **ngOnChanges** - Called when input properties change
- **ngOnInit** - Called once after first ngOnChanges
- **ngDoCheck** - Called during every change detection
- **ngAfterContentInit/Checked** - After content projection
- **ngAfterViewInit/Checked** - After view initialization
- **ngOnDestroy** - Cleanup before component destruction

Use \`ngOnInit\` for initialization logic and \`ngOnDestroy\` for cleanup (unsubscribing).`,
    ua: `Компоненти Angular мають хуки життєвого циклу для ключових моментів:

- **ngOnChanges** - Викликається при зміні input-властивостей
- **ngOnInit** - Викликається один раз після першого ngOnChanges
- **ngDoCheck** - Викликається при кожній перевірці змін
- **ngAfterContentInit/Checked** - Після проекції контенту
- **ngAfterViewInit/Checked** - Після ініціалізації view
- **ngOnDestroy** - Очищення перед знищенням компонента

Використовуйте \`ngOnInit\` для ініціалізації та \`ngOnDestroy\` для очищення (відписки).`
  },
  'difference-between-angularjs-and-angular': {
    en: `**AngularJS (1.x)** and **Angular (2+)** are fundamentally different frameworks:

| AngularJS | Angular |
|-----------|---------|
| JavaScript | TypeScript |
| Two-way binding with \`$scope\` | Component-based architecture |
| Controllers & \`ng-controller\` | Components with decorators |
| Digest cycle | Zone.js change detection |
| No mobile support | Mobile-first approach |

Angular is a complete rewrite with better performance, modularity, and modern tooling.`,
    ua: `**AngularJS (1.x)** та **Angular (2+)** — принципово різні фреймворки:

| AngularJS | Angular |
|-----------|---------|
| JavaScript | TypeScript |
| Двостороння прив'язка з \`$scope\` | Компонентна архітектура |
| Контролери та \`ng-controller\` | Компоненти з декораторами |
| Digest cycle | Zone.js для виявлення змін |
| Без підтримки мобільних | Mobile-first підхід |

Angular — повністю переписаний з кращою продуктивністю та модульністю.`
  },
  'difference-between-template-driven-and-reactive-forms-in-angular': {
    en: `**Template-driven forms** use directives like \`ngModel\` in templates:
\`\`\`html
<input [(ngModel)]="name" required>
\`\`\`

**Reactive forms** are defined programmatically in the component:
\`\`\`typescript
this.form = new FormGroup({
  name: new FormControl('', Validators.required)
});
\`\`\`

| Template-driven | Reactive |
|-----------------|----------|
| Simple, quick setup | More control, testable |
| Async validation harder | Easy async validation |
| Less scalable | Better for complex forms |`,
    ua: `**Template-driven форми** використовують директиви як \`ngModel\` в шаблонах:
\`\`\`html
<input [(ngModel)]="name" required>
\`\`\`

**Reactive форми** визначаються програмно в компоненті:
\`\`\`typescript
this.form = new FormGroup({
  name: new FormControl('', Validators.required)
});
\`\`\`

| Template-driven | Reactive |
|-----------------|----------|
| Простіші, швидке налаштування | Більше контролю, тестовані |
| Складніша асинхронна валідація | Легка асинхронна валідація |
| Менш масштабовані | Краще для складних форм |`
  },
  'injector-hierarchy-in-angular': {
    en: `Angular uses a **hierarchical dependency injection** system:

1. **Root Injector** - Services with \`providedIn: 'root'\` (singleton)
2. **Module Injector** - Services in \`providers\` array of NgModule
3. **Component Injector** - Services in component's \`providers\`

\`\`\`typescript
@Injectable({ providedIn: 'root' }) // Singleton
@Component({
  providers: [MyService] // New instance per component
})
\`\`\`

Child injectors inherit from parents but can override with own instances.`,
    ua: `Angular використовує **ієрархічну систему впровадження залежностей**:

1. **Root Injector** - Сервіси з \`providedIn: 'root'\` (singleton)
2. **Module Injector** - Сервіси в масиві \`providers\` NgModule
3. **Component Injector** - Сервіси в \`providers\` компонента

\`\`\`typescript
@Injectable({ providedIn: 'root' }) // Singleton
@Component({
  providers: [MyService] // Новий екземпляр на компонент
})
\`\`\`

Дочірні інжектори наслідують від батьківських, але можуть перевизначати.`
  },
  'what-are-directives-and-what-types-exist-in-angular': {
    en: `**Directives** are classes that add behavior to DOM elements:

1. **Component Directives** - Directives with templates (\`@Component\`)

2. **Structural Directives** - Change DOM structure (prefix \`*\`):
   - \`*ngIf\`, \`*ngFor\`, \`*ngSwitch\`

3. **Attribute Directives** - Change appearance/behavior:
   - \`[ngClass]\`, \`[ngStyle]\`, custom directives

\`\`\`typescript
@Directive({ selector: '[highlight]' })
export class HighlightDirective {
  @HostListener('mouseenter') onHover() { ... }
}
\`\`\``,
    ua: `**Директиви** — класи, що додають поведінку DOM-елементам:

1. **Компонентні директиви** - Директиви з шаблонами (\`@Component\`)

2. **Структурні директиви** - Змінюють структуру DOM (префікс \`*\`):
   - \`*ngIf\`, \`*ngFor\`, \`*ngSwitch\`

3. **Атрибутні директиви** - Змінюють вигляд/поведінку:
   - \`[ngClass]\`, \`[ngStyle]\`, кастомні директиви

\`\`\`typescript
@Directive({ selector: '[highlight]' })
export class HighlightDirective {
  @HostListener('mouseenter') onHover() { ... }
}
\`\`\``
  },
  'what-are-modules-in-angular-and-how-are-they-used': {
    en: `**NgModules** organize Angular applications into cohesive blocks:

\`\`\`typescript
@NgModule({
  declarations: [MyComponent], // Components, directives, pipes
  imports: [CommonModule],     // Other modules to use
  exports: [MyComponent],      // What others can use
  providers: [MyService],      // Services for this module
  bootstrap: [AppComponent]    // Root component (AppModule only)
})
export class MyModule { }
\`\`\`

Modules enable **lazy loading** for better performance by loading features on demand.`,
    ua: `**NgModules** організовують Angular-додатки в логічні блоки:

\`\`\`typescript
@NgModule({
  declarations: [MyComponent], // Компоненти, директиви, пайпи
  imports: [CommonModule],     // Інші модулі для використання
  exports: [MyComponent],      // Що можуть використовувати інші
  providers: [MyService],      // Сервіси для цього модуля
  bootstrap: [AppComponent]    // Кореневий компонент (тільки AppModule)
})
export class MyModule { }
\`\`\`

Модулі дозволяють **lazy loading** для кращої продуктивності через завантаження на вимогу.`
  },
  'what-is-ngzone-in-angular': {
    en: `**NgZone** is Angular's execution context that triggers change detection automatically.

Angular patches async APIs (setTimeout, promises, events) using **Zone.js** to know when to update the view.

\`\`\`typescript
// Run outside Angular (no change detection)
this.ngZone.runOutsideAngular(() => {
  setInterval(() => this.tick++, 100);
});

// Force change detection
this.ngZone.run(() => {
  this.data = newData;
});
\`\`\`

Use \`runOutsideAngular\` for performance-critical code that doesn't need UI updates.`,
    ua: `**NgZone** — контекст виконання Angular, що автоматично запускає виявлення змін.

Angular патчить асинхронні API (setTimeout, promises, події) через **Zone.js**, щоб знати коли оновлювати view.

\`\`\`typescript
// Виконання поза Angular (без change detection)
this.ngZone.runOutsideAngular(() => {
  setInterval(() => this.tick++, 100);
});

// Примусове виявлення змін
this.ngZone.run(() => {
  this.data = newData;
});
\`\`\`

Використовуйте \`runOutsideAngular\` для критичного до продуктивності коду.`
  },
  'what-is-rxjs-and-how-is-it-integrated-in-angular': {
    en: `**RxJS** (Reactive Extensions for JavaScript) is a library for reactive programming using **Observables**.

Angular uses RxJS extensively:
- **HttpClient** returns Observables
- **Router** events are Observables
- **Forms** valueChanges are Observables

\`\`\`typescript
this.http.get('/api/data').pipe(
  map(data => transform(data)),
  catchError(err => of(fallback)),
  takeUntil(this.destroy$)
).subscribe(result => this.data = result);
\`\`\`

Key operators: \`map\`, \`filter\`, \`switchMap\`, \`mergeMap\`, \`debounceTime\`.`,
    ua: `**RxJS** (Reactive Extensions for JavaScript) — бібліотека для реактивного програмування з **Observables**.

Angular активно використовує RxJS:
- **HttpClient** повертає Observables
- **Router** події — Observables
- **Forms** valueChanges — Observables

\`\`\`typescript
this.http.get('/api/data').pipe(
  map(data => transform(data)),
  catchError(err => of(fallback)),
  takeUntil(this.destroy$)
).subscribe(result => this.data = result);
\`\`\`

Ключові оператори: \`map\`, \`filter\`, \`switchMap\`, \`mergeMap\`, \`debounceTime\`.`
  },
  'what-is-subject-and-what-types-of-subjects-exist-in-rxjs': {
    en: `**Subject** is both an Observable and Observer — it can emit and subscribe to values.

Types of Subjects:

| Type | Behavior |
|------|----------|
| **Subject** | No initial value, emits only new values |
| **BehaviorSubject** | Has initial value, emits latest to new subscribers |
| **ReplaySubject** | Replays N last values to new subscribers |
| **AsyncSubject** | Emits only last value on completion |

\`\`\`typescript
const behavior$ = new BehaviorSubject<number>(0);
behavior$.next(1);
behavior$.subscribe(v => console.log(v)); // Gets 1
\`\`\``,
    ua: `**Subject** — це одночасно Observable і Observer — може емітити та підписуватися на значення.

Типи Subject:

| Тип | Поведінка |
|-----|-----------|
| **Subject** | Без початкового значення, емітить тільки нові |
| **BehaviorSubject** | Має початкове значення, емітить останнє новим підписникам |
| **ReplaySubject** | Повторює N останніх значень новим підписникам |
| **AsyncSubject** | Емітить тільки останнє значення при завершенні |

\`\`\`typescript
const behavior$ = new BehaviorSubject<number>(0);
behavior$.next(1);
behavior$.subscribe(v => console.log(v)); // Отримає 1
\`\`\``
  },

  // ===== ARCHITECTURE =====
  'atomic-design-architecture': {
    en: `**Atomic Design** organizes UI components in 5 hierarchical levels:

1. **Atoms** - Basic building blocks (Button, Input, Label)
2. **Molecules** - Simple groups of atoms (SearchField = Input + Button)
3. **Organisms** - Complex UI sections (Header, ProductCard)
4. **Templates** - Page layouts without real content
5. **Pages** - Templates with actual content

Benefits: **Consistency**, **reusability**, **scalable design system**.`,
    ua: `**Atomic Design** організовує UI компоненти в 5 ієрархічних рівнів:

1. **Атоми** - Базові блоки (Button, Input, Label)
2. **Молекули** - Прості групи атомів (SearchField = Input + Button)
3. **Організми** - Складні секції UI (Header, ProductCard)
4. **Шаблони** - Макети сторінок без реального контенту
5. **Сторінки** - Шаблони з актуальним контентом

Переваги: **Консистентність**, **перевикористання**, **масштабована дизайн-система**.`
  },
  'feature-sliced-design-fsd-must-know-frontend-architecture': {
    en: `**Feature-Sliced Design (FSD)** is a frontend architecture methodology:

\`\`\`
src/
├── app/        # App initialization, providers
├── pages/      # Page components
├── widgets/    # Complex UI blocks
├── features/   # User interactions (addToCart)
├── entities/   # Business entities (User, Product)
├── shared/     # Reusable code (UI kit, utils)
\`\`\`

**Rules:**
- Upper layers can only import from lower layers
- Each slice is independent
- Public API through index files`,
    ua: `**Feature-Sliced Design (FSD)** — методологія архітектури фронтенду:

\`\`\`
src/
├── app/        # Ініціалізація, провайдери
├── pages/      # Компоненти сторінок
├── widgets/    # Складні UI блоки
├── features/   # Взаємодії користувача (addToCart)
├── entities/   # Бізнес-сутності (User, Product)
├── shared/     # Перевикористовуваний код (UI kit, utils)
\`\`\`

**Правила:**
- Верхні шари імпортують тільки з нижніх
- Кожен slice незалежний
- Публічний API через index файли`
  },
  'microfrontend-architecture': {
    en: `**Microfrontends** split a monolithic frontend into independent, deployable pieces.

**Implementation approaches:**
- **Module Federation** (Webpack 5) - Runtime integration
- **Single-SPA** - Framework-agnostic orchestration
- **iframes** - Complete isolation
- **Web Components** - Standards-based

**Benefits:** Independent deployments, team autonomy, tech flexibility
**Challenges:** Shared state, consistent UX, performance overhead`,
    ua: `**Мікрофронтенди** розділяють монолітний фронтенд на незалежні частини.

**Підходи реалізації:**
- **Module Federation** (Webpack 5) - Runtime інтеграція
- **Single-SPA** - Фреймворк-агностична оркестрація
- **iframes** - Повна ізоляція
- **Web Components** - На основі стандартів

**Переваги:** Незалежні деплої, автономність команд, гнучкість технологій
**Виклики:** Спільний стан, консистентний UX, накладні витрати на продуктивність`
  },
  'modular-architecture': {
    en: `**Modular Architecture** organizes code into self-contained modules with clear boundaries.

\`\`\`
src/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── index.ts  # Public API
│   ├── products/
│   └── checkout/
\`\`\`

**Principles:**
- **High cohesion** - Related code together
- **Low coupling** - Minimal dependencies between modules
- **Encapsulation** - Hide implementation details
- **Single responsibility** - One purpose per module`,
    ua: `**Модульна архітектура** організовує код у самодостатні модулі з чіткими межами.

\`\`\`
src/
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── index.ts  # Публічний API
│   ├── products/
│   └── checkout/
\`\`\`

**Принципи:**
- **Висока зв'язність** - Пов'язаний код разом
- **Низька зчепленість** - Мінімум залежностей між модулями
- **Інкапсуляція** - Приховування деталей реалізації
- **Єдина відповідальність** - Одна мета на модуль`
  },

  // ===== GENERAL =====
  'how-browser-works-when-entering-request-and-rendering-stages': {
    en: `When you enter a URL, the browser goes through these stages:

1. **DNS Lookup** - Resolve domain to IP address
2. **TCP Connection** - Three-way handshake
3. **TLS Handshake** - For HTTPS connections
4. **HTTP Request** - Send GET request
5. **Server Response** - Receive HTML
6. **Parsing** - Build DOM and CSSOM
7. **Render Tree** - Combine DOM + CSSOM
8. **Layout** - Calculate positions and sizes
9. **Paint** - Draw pixels to screen
10. **Composite** - Layer composition`,
    ua: `Коли ви вводите URL, браузер проходить ці етапи:

1. **DNS Lookup** - Резолв домену в IP-адресу
2. **TCP Connection** - Трьохстороннє рукостискання
3. **TLS Handshake** - Для HTTPS з'єднань
4. **HTTP Request** - Відправка GET запиту
5. **Server Response** - Отримання HTML
6. **Parsing** - Побудова DOM та CSSOM
7. **Render Tree** - Об'єднання DOM + CSSOM
8. **Layout** - Розрахунок позицій та розмірів
9. **Paint** - Малювання пікселів на екран
10. **Composite** - Композиція шарів`
  },
  'how-http-works-and-what-an-http-request-consists-of': {
    en: `**HTTP** (HyperText Transfer Protocol) is a request-response protocol.

**Request structure:**
\`\`\`
GET /api/users HTTP/1.1      # Method + Path + Version
Host: example.com            # Headers
Content-Type: application/json
Authorization: Bearer token

{"name": "John"}             # Body (for POST/PUT)
\`\`\`

**Methods:** GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
**Status codes:** 2xx (success), 3xx (redirect), 4xx (client error), 5xx (server error)`,
    ua: `**HTTP** (HyperText Transfer Protocol) — протокол запит-відповідь.

**Структура запиту:**
\`\`\`
GET /api/users HTTP/1.1      # Метод + Шлях + Версія
Host: example.com            # Заголовки
Content-Type: application/json
Authorization: Bearer token

{"name": "John"}             # Тіло (для POST/PUT)
\`\`\`

**Методи:** GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
**Статус-коди:** 2xx (успіх), 3xx (редірект), 4xx (помилка клієнта), 5xx (помилка сервера)`
  },
  'how-https-works-and-difference-from-http': {
    en: `**HTTPS** = HTTP + **TLS/SSL** encryption.

**TLS Handshake process:**
1. Client sends supported cipher suites
2. Server responds with certificate
3. Client verifies certificate
4. Key exchange (asymmetric → symmetric)
5. Encrypted communication begins

**Differences from HTTP:**
| HTTP | HTTPS |
|------|-------|
| Port 80 | Port 443 |
| Plain text | Encrypted |
| No verification | Certificate validation |
| Faster (no handshake) | Slightly slower |`,
    ua: `**HTTPS** = HTTP + **TLS/SSL** шифрування.

**Процес TLS Handshake:**
1. Клієнт надсилає підтримувані шифри
2. Сервер відповідає сертифікатом
3. Клієнт перевіряє сертифікат
4. Обмін ключами (асиметричний → симетричний)
5. Починається зашифрована комунікація

**Відмінності від HTTP:**
| HTTP | HTTPS |
|------|-------|
| Порт 80 | Порт 443 |
| Відкритий текст | Зашифровано |
| Без верифікації | Валідація сертифіката |
| Швидший (без handshake) | Трохи повільніший |`
  },
  'how-to-debug-application-and-find-memory-leaks': {
    en: `**Debugging memory leaks:**

1. **Chrome DevTools Memory tab:**
   - Take heap snapshots before/after actions
   - Compare snapshots to find retained objects
   - Look for detached DOM elements

2. **Performance Monitor:**
   - Watch JS heap size over time
   - Identify growing memory patterns

**Common leak causes:**
- Event listeners not removed
- Closures holding references
- Forgotten timers/intervals
- Detached DOM nodes
- Growing arrays/caches`,
    ua: `**Дебагінг витоків пам'яті:**

1. **Chrome DevTools вкладка Memory:**
   - Робіть heap snapshots до/після дій
   - Порівнюйте snapshots для пошуку утриманих об'єктів
   - Шукайте відокремлені DOM елементи

2. **Performance Monitor:**
   - Спостерігайте за розміром JS heap
   - Ідентифікуйте патерни зростання пам'яті

**Поширені причини витоків:**
- Event listeners не видалені
- Замикання утримують посилання
- Забуті таймери/інтервали
- Відокремлені DOM вузли
- Зростаючі масиви/кеші`
  },
  'http2-vs-http3-protocol-evolution': {
    en: `**HTTP/2** improvements over HTTP/1.1:
- **Multiplexing** - Multiple requests over single connection
- **Header compression** (HPACK)
- **Server push**
- **Binary protocol**

**HTTP/3** (QUIC-based) improvements:
- **UDP instead of TCP** - Faster connection setup
- **0-RTT resumption** - Instant reconnection
- **No head-of-line blocking** - Per-stream flow control
- **Built-in encryption**

HTTP/3 reduces latency, especially on unstable networks.`,
    ua: `**HTTP/2** покращення над HTTP/1.1:
- **Мультиплексування** - Багато запитів через одне з'єднання
- **Стиснення заголовків** (HPACK)
- **Server push**
- **Бінарний протокол**

**HTTP/3** (на базі QUIC) покращення:
- **UDP замість TCP** - Швидше встановлення з'єднання
- **0-RTT resumption** - Миттєве перепідключення
- **Без head-of-line blocking** - Per-stream flow control
- **Вбудоване шифрування**

HTTP/3 зменшує затримку, особливо на нестабільних мережах.`
  },
  'immutability-and-mutability-in-javascript': {
    en: `**Immutability** means data cannot be changed after creation.

\`\`\`javascript
// Mutable (bad for predictability)
const arr = [1, 2, 3];
arr.push(4); // Mutates original

// Immutable (good)
const newArr = [...arr, 4]; // New array
const newObj = { ...obj, key: value }; // New object
\`\`\`

**Benefits of immutability:**
- Predictable state changes
- Easy change detection (reference comparison)
- Simpler debugging
- Required for React/Redux optimizations`,
    ua: `**Імутабельність** означає, що дані не можуть змінюватися після створення.

\`\`\`javascript
// Мутабельний (погано для передбачуваності)
const arr = [1, 2, 3];
arr.push(4); // Мутує оригінал

// Імутабельний (добре)
const newArr = [...arr, 4]; // Новий масив
const newObj = { ...obj, key: value }; // Новий об'єкт
\`\`\`

**Переваги імутабельності:**
- Передбачувані зміни стану
- Легке виявлення змін (порівняння посилань)
- Простіший дебагінг
- Необхідна для оптимізацій React/Redux`
  },
  'modern-browser-architecture-processes-and-threads': {
    en: `Modern browsers use **multi-process architecture:**

**Processes:**
- **Browser Process** - UI, tabs, storage
- **Renderer Process** - One per tab/site (security isolation)
- **GPU Process** - Hardware acceleration
- **Plugin Process** - Flash, etc.
- **Network Process** - HTTP requests

**Renderer Process threads:**
- **Main thread** - JavaScript, DOM, layout
- **Compositor thread** - Smooth scrolling, animations
- **Raster threads** - Paint layers to bitmaps
- **Worker threads** - Web Workers`,
    ua: `Сучасні браузери використовують **багатопроцесну архітектуру:**

**Процеси:**
- **Browser Process** - UI, вкладки, сховище
- **Renderer Process** - Один на вкладку/сайт (ізоляція безпеки)
- **GPU Process** - Апаратне прискорення
- **Plugin Process** - Flash тощо
- **Network Process** - HTTP запити

**Потоки Renderer Process:**
- **Main thread** - JavaScript, DOM, layout
- **Compositor thread** - Плавний скролінг, анімації
- **Raster threads** - Малювання шарів у бітмапи
- **Worker threads** - Web Workers`
  },
  'owasp-browser-vulnerabilities': {
    en: `**OWASP Top 10** browser-related vulnerabilities:

1. **XSS** (Cross-Site Scripting) - Injection of malicious scripts
2. **CSRF** (Cross-Site Request Forgery) - Unauthorized actions
3. **Clickjacking** - Hidden UI elements trick users
4. **Open Redirects** - Phishing via URL manipulation
5. **Insecure Storage** - Sensitive data in localStorage

**Protections:**
- Content Security Policy (CSP)
- HttpOnly/Secure cookies
- SameSite cookie attribute
- X-Frame-Options header
- Input sanitization`,
    ua: `**OWASP Top 10** вразливості, пов'язані з браузером:

1. **XSS** (Cross-Site Scripting) - Ін'єкція шкідливих скриптів
2. **CSRF** (Cross-Site Request Forgery) - Несанкціоновані дії
3. **Clickjacking** - Приховані UI елементи обманюють користувачів
4. **Open Redirects** - Фішинг через маніпуляцію URL
5. **Insecure Storage** - Чутливі дані в localStorage

**Захисти:**
- Content Security Policy (CSP)
- HttpOnly/Secure cookies
- SameSite атрибут cookie
- X-Frame-Options заголовок
- Санітизація введення`
  },
  'parsing-pipeline-from-bytes-to-dom-and-cssom': {
    en: `**Browser parsing pipeline:**

1. **Bytes → Characters** - Decode using charset (UTF-8)
2. **Characters → Tokens** - Tokenization (< → start tag, etc.)
3. **Tokens → Nodes** - Create DOM/CSSOM nodes
4. **Nodes → Tree** - Build DOM and CSSOM trees

**Parallel processes:**
- HTML parsing builds **DOM**
- CSS parsing builds **CSSOM**
- JavaScript can **block** parsing (unless async/defer)

\`\`\`
Bytes → Characters → Tokens → Nodes → DOM/CSSOM
\`\`\``,
    ua: `**Парсинг пайплайн браузера:**

1. **Байти → Символи** - Декодування через charset (UTF-8)
2. **Символи → Токени** - Токенізація (< → start tag, тощо)
3. **Токени → Вузли** - Створення DOM/CSSOM вузлів
4. **Вузли → Дерево** - Побудова DOM та CSSOM дерев

**Паралельні процеси:**
- HTML парсинг будує **DOM**
- CSS парсинг будує **CSSOM**
- JavaScript може **блокувати** парсинг (якщо не async/defer)

\`\`\`
Bytes → Characters → Tokens → Nodes → DOM/CSSOM
\`\`\``
  },
  'resource-loading-strategies-preload-prefetch-modulepreload': {
    en: `**Resource hints** optimize loading performance:

| Hint | Purpose | Priority |
|------|---------|----------|
| \`preload\` | Critical resources for current page | High |
| \`prefetch\` | Resources for future navigation | Low |
| \`modulepreload\` | ES modules preloading | High |

\`\`\`html
<link rel="preload" href="critical.css" as="style">
<link rel="prefetch" href="next-page.js">
<link rel="modulepreload" href="app.mjs">
\`\`\`

Use \`preload\` for fonts, critical CSS, hero images.
Use \`prefetch\` for resources likely needed soon.`,
    ua: `**Resource hints** оптимізують продуктивність завантаження:

| Hint | Призначення | Пріоритет |
|------|-------------|-----------|
| \`preload\` | Критичні ресурси поточної сторінки | Високий |
| \`prefetch\` | Ресурси для майбутньої навігації | Низький |
| \`modulepreload\` | Попереднє завантаження ES модулів | Високий |

\`\`\`html
<link rel="preload" href="critical.css" as="style">
<link rel="prefetch" href="next-page.js">
<link rel="modulepreload" href="app.mjs">
\`\`\`

Використовуйте \`preload\` для шрифтів, критичного CSS, hero-зображень.
Використовуйте \`prefetch\` для ресурсів, які скоро знадобляться.`
  },
  'server-sent-events-polling-and-long-polling-what-they-are-and-when-to-use': {
    en: `**Real-time communication patterns:**

| Pattern | Description | Use Case |
|---------|-------------|----------|
| **Polling** | Regular requests at intervals | Simple updates |
| **Long Polling** | Hold request until data available | Chat, notifications |
| **SSE** | Server pushes data (one-way) | Live feeds, dashboards |
| **WebSocket** | Bidirectional connection | Games, collaboration |

\`\`\`javascript
// SSE
const source = new EventSource('/events');
source.onmessage = (e) => console.log(e.data);
\`\`\``,
    ua: `**Патерни real-time комунікації:**

| Патерн | Опис | Використання |
|--------|------|--------------|
| **Polling** | Регулярні запити з інтервалом | Прості оновлення |
| **Long Polling** | Утримувати запит до появи даних | Чат, нотифікації |
| **SSE** | Сервер надсилає дані (односторонній) | Live-стрічки, дашборди |
| **WebSocket** | Двонаправлене з'єднання | Ігри, колаборація |

\`\`\`javascript
// SSE
const source = new EventSource('/events');
source.onmessage = (e) => console.log(e.data);
\`\`\``
  },
  'types-of-frontend-testing': {
    en: `**Frontend testing pyramid:**

1. **Unit Tests** - Test isolated functions/components
   - Tools: Jest, Vitest, Testing Library

2. **Integration Tests** - Test component interactions
   - Tools: Testing Library, Cypress Component

3. **E2E Tests** - Test full user flows
   - Tools: Cypress, Playwright, Selenium

4. **Visual Regression** - Screenshot comparison
   - Tools: Percy, Chromatic, BackstopJS

5. **Performance Tests** - Lighthouse, Web Vitals

Aim for: 70% unit, 20% integration, 10% E2E.`,
    ua: `**Піраміда тестування фронтенду:**

1. **Unit Tests** - Тестування ізольованих функцій/компонентів
   - Інструменти: Jest, Vitest, Testing Library

2. **Integration Tests** - Тестування взаємодії компонентів
   - Інструменти: Testing Library, Cypress Component

3. **E2E Tests** - Тестування повних користувацьких сценаріїв
   - Інструменти: Cypress, Playwright, Selenium

4. **Visual Regression** - Порівняння скріншотів
   - Інструменти: Percy, Chromatic, BackstopJS

5. **Performance Tests** - Lighthouse, Web Vitals

Ціль: 70% unit, 20% integration, 10% E2E.`
  },
  'v8-architecture-from-code-to-machine-instructions': {
    en: `**V8 Engine** (Chrome, Node.js) execution pipeline:

1. **Parser** → AST (Abstract Syntax Tree)
2. **Ignition** (Interpreter) → Bytecode
3. **Sparkplug** → Quick non-optimized machine code
4. **TurboFan** (JIT Compiler) → Optimized machine code

**Optimization process:**
- V8 collects type feedback during execution
- "Hot" functions get optimized by TurboFan
- Deoptimization if assumptions break

**Hidden Classes** and **Inline Caching** are key optimizations.`,
    ua: `**V8 Engine** (Chrome, Node.js) пайплайн виконання:

1. **Parser** → AST (Abstract Syntax Tree)
2. **Ignition** (Інтерпретатор) → Байткод
3. **Sparkplug** → Швидкий неоптимізований машинний код
4. **TurboFan** (JIT Компілятор) → Оптимізований машинний код

**Процес оптимізації:**
- V8 збирає type feedback під час виконання
- "Гарячі" функції оптимізуються TurboFan
- Деоптимізація якщо припущення порушуються

**Hidden Classes** та **Inline Caching** — ключові оптимізації.`
  },
  'ways-to-optimize-applications': {
    en: `**Frontend optimization strategies:**

**Loading:**
- Code splitting & lazy loading
- Tree shaking
- Compression (gzip, Brotli)
- CDN for static assets

**Rendering:**
- Virtual scrolling for long lists
- \`will-change\` for animations
- CSS containment
- Avoid layout thrashing

**JavaScript:**
- Debounce/throttle events
- Web Workers for heavy tasks
- Memoization
- Avoid memory leaks

**Images:** WebP/AVIF, lazy loading, responsive images`,
    ua: `**Стратегії оптимізації фронтенду:**

**Завантаження:**
- Code splitting та lazy loading
- Tree shaking
- Стиснення (gzip, Brotli)
- CDN для статичних ресурсів

**Рендеринг:**
- Віртуальний скролінг для довгих списків
- \`will-change\` для анімацій
- CSS containment
- Уникайте layout thrashing

**JavaScript:**
- Debounce/throttle подій
- Web Workers для важких задач
- Мемоізація
- Уникайте витоків пам'яті

**Зображення:** WebP/AVIF, lazy loading, responsive images`
  },
  'what-are-cookies-and-how-to-work-with-them': {
    en: `**Cookies** are small data pieces stored by browser for a domain.

\`\`\`javascript
// Set cookie
document.cookie = "name=value; max-age=3600; path=/; secure; httpOnly; sameSite=strict";

// Read cookies
const cookies = document.cookie; // "name=value; other=data"
\`\`\`

**Attributes:**
- \`max-age\` / \`expires\` - Lifetime
- \`secure\` - HTTPS only
- \`httpOnly\` - No JS access (security)
- \`sameSite\` - CSRF protection (strict/lax/none)
- \`path\` / \`domain\` - Scope`,
    ua: `**Cookies** — невеликі дані, що зберігаються браузером для домену.

\`\`\`javascript
// Встановити cookie
document.cookie = "name=value; max-age=3600; path=/; secure; httpOnly; sameSite=strict";

// Читати cookies
const cookies = document.cookie; // "name=value; other=data"
\`\`\`

**Атрибути:**
- \`max-age\` / \`expires\` - Час життя
- \`secure\` - Тільки HTTPS
- \`httpOnly\` - Без доступу з JS (безпека)
- \`sameSite\` - CSRF захист (strict/lax/none)
- \`path\` / \`domain\` - Область дії`
  },
  'what-is-cdn-and-why-is-it-needed': {
    en: `**CDN** (Content Delivery Network) is a distributed network of servers that delivers content from the nearest location.

**Benefits:**
- **Lower latency** - Content served from nearby edge servers
- **Reduced server load** - Traffic distributed
- **High availability** - Redundancy across locations
- **DDoS protection** - Absorbs attack traffic

**Use cases:**
- Static assets (JS, CSS, images)
- Video streaming
- API caching
- Entire website delivery`,
    ua: `**CDN** (Content Delivery Network) — розподілена мережа серверів, що доставляє контент з найближчої локації.

**Переваги:**
- **Менша затримка** - Контент з найближчих edge-серверів
- **Зменшене навантаження** - Трафік розподілено
- **Висока доступність** - Резервування між локаціями
- **DDoS захист** - Поглинає атакуючий трафік

**Використання:**
- Статичні ресурси (JS, CSS, зображення)
- Відео стрімінг
- Кешування API
- Доставка всього сайту`
  },
  'what-is-critical-rendering-path-crp-in-browser': {
    en: `**Critical Rendering Path (CRP)** is the sequence of steps browser takes to convert HTML/CSS/JS to pixels:

1. **DOM Construction** - Parse HTML
2. **CSSOM Construction** - Parse CSS
3. **Render Tree** - Combine visible DOM + CSSOM
4. **Layout** - Calculate geometry
5. **Paint** - Fill pixels

**Optimization:**
- Minimize critical resources
- Defer non-critical CSS/JS
- Inline critical CSS
- Use \`async\`/\`defer\` for scripts`,
    ua: `**Critical Rendering Path (CRP)** — послідовність кроків браузера для перетворення HTML/CSS/JS у пікселі:

1. **DOM Construction** - Парсинг HTML
2. **CSSOM Construction** - Парсинг CSS
3. **Render Tree** - Об'єднання видимого DOM + CSSOM
4. **Layout** - Розрахунок геометрії
5. **Paint** - Заповнення пікселів

**Оптимізація:**
- Мінімізуйте критичні ресурси
- Відкладайте некритичний CSS/JS
- Вбудовуйте критичний CSS
- Використовуйте \`async\`/\`defer\` для скриптів`
  },
  'what-is-progressive-rendering-in-web-development': {
    en: `**Progressive Rendering** techniques display content as it loads:

1. **Lazy Loading** - Load images/components on demand
2. **Skeleton Screens** - Show placeholders during load
3. **Progressive Images** - Load low-res first, then full
4. **Streaming HTML** - Send HTML chunks (React 18 Suspense)
5. **Above-the-fold prioritization** - Load visible content first

**Benefits:**
- Faster perceived performance
- Better user experience
- Reduced initial payload`,
    ua: `**Progressive Rendering** — техніки відображення контенту по мірі завантаження:

1. **Lazy Loading** - Завантаження зображень/компонентів на вимогу
2. **Skeleton Screens** - Плейсхолдери під час завантаження
3. **Progressive Images** - Спочатку низька якість, потім повна
4. **Streaming HTML** - Відправка HTML чанками (React 18 Suspense)
5. **Above-the-fold пріоритезація** - Спочатку видимий контент

**Переваги:**
- Швидша сприйнята продуктивність
- Кращий користувацький досвід
- Менший початковий payload`
  },
  'what-is-shadow-dom-in-web-development': {
    en: `**Shadow DOM** provides encapsulated DOM and styles for web components.

\`\`\`javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      <style>p { color: red; }</style>
      <p>Encapsulated!</p>
    \`;
  }
}
\`\`\`

**Benefits:**
- **Style isolation** - CSS doesn't leak in/out
- **DOM encapsulation** - Internal structure hidden
- **Scoped selectors** - No conflicts with page styles`,
    ua: `**Shadow DOM** забезпечує інкапсульовані DOM та стилі для веб-компонентів.

\`\`\`javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      <style>p { color: red; }</style>
      <p>Інкапсульовано!</p>
    \`;
  }
}
\`\`\`

**Переваги:**
- **Ізоляція стилів** - CSS не витікає всередину/назовні
- **Інкапсуляція DOM** - Внутрішня структура прихована
- **Scoped селектори** - Без конфліктів зі стилями сторінки`
  },
  'what-is-the-difference-between-authorization-and-authentication': {
    en: `**Authentication** = "Who are you?" (Identity verification)
**Authorization** = "What can you do?" (Permission check)

| Authentication | Authorization |
|----------------|---------------|
| Verifies identity | Checks permissions |
| Login credentials | Access control |
| First step | After authentication |
| 401 Unauthorized | 403 Forbidden |

**Example:**
- Authentication: Login with email/password
- Authorization: Can this user delete posts?`,
    ua: `**Автентифікація** = "Хто ви?" (Перевірка особи)
**Авторизація** = "Що ви можете робити?" (Перевірка дозволів)

| Автентифікація | Авторизація |
|----------------|-------------|
| Перевіряє особу | Перевіряє дозволи |
| Облікові дані входу | Контроль доступу |
| Перший крок | Після автентифікації |
| 401 Unauthorized | 403 Forbidden |

**Приклад:**
- Автентифікація: Вхід з email/паролем
- Авторизація: Чи може цей користувач видаляти пости?`
  },
  'what-is-three-way-handshake': {
    en: `**Three-way handshake** establishes TCP connection:

1. **SYN** - Client sends synchronization request
   \`Client → Server: SYN, seq=x\`

2. **SYN-ACK** - Server acknowledges and syncs back
   \`Server → Client: SYN-ACK, seq=y, ack=x+1\`

3. **ACK** - Client confirms, connection established
   \`Client → Server: ACK, seq=x+1, ack=y+1\`

After this, data transfer begins. This ensures both sides are ready and sequence numbers are synchronized.`,
    ua: `**Трьохстороннє рукостискання** встановлює TCP з'єднання:

1. **SYN** - Клієнт надсилає запит синхронізації
   \`Client → Server: SYN, seq=x\`

2. **SYN-ACK** - Сервер підтверджує та синхронізується назад
   \`Server → Client: SYN-ACK, seq=y, ack=x+1\`

3. **ACK** - Клієнт підтверджує, з'єднання встановлено
   \`Client → Server: ACK, seq=x+1, ack=y+1\`

Після цього починається передача даних. Це гарантує готовність обох сторін та синхронізацію sequence numbers.`
  },
  'when-reflow-and-repaint-occur-in-browser': {
    en: `**Reflow** (Layout) - Recalculates positions and dimensions
**Repaint** - Redraws pixels without layout change

**Triggers reflow:**
- Adding/removing DOM elements
- Changing dimensions (width, height, padding)
- Reading layout properties (\`offsetWidth\`, \`getBoundingClientRect\`)
- Window resize

**Triggers repaint only:**
- Color changes
- Visibility changes
- Background changes

**Optimization:** Batch DOM reads/writes, use \`transform\` for animations.`,
    ua: `**Reflow** (Layout) - Перерахунок позицій та розмірів
**Repaint** - Перемальовування пікселів без зміни layout

**Викликає reflow:**
- Додавання/видалення DOM елементів
- Зміна розмірів (width, height, padding)
- Читання layout властивостей (\`offsetWidth\`, \`getBoundingClientRect\`)
- Зміна розміру вікна

**Викликає тільки repaint:**
- Зміна кольору
- Зміна видимості
- Зміна фону

**Оптимізація:** Групуйте DOM читання/запис, використовуйте \`transform\` для анімацій.`
  },

  // ===== HTML-CSS =====
  'css-aspect-ratio': {
    en: `**aspect-ratio** CSS property sets preferred width-to-height ratio:

\`\`\`css
.video {
  aspect-ratio: 16 / 9;
  width: 100%;
  /* Height calculated automatically */
}

.square {
  aspect-ratio: 1; /* Same as 1/1 */
}
\`\`\`

**Use cases:**
- Responsive images/videos
- Placeholder boxes
- Card layouts
- Maintaining proportions without padding hack`,
    ua: `**aspect-ratio** CSS властивість встановлює бажане співвідношення ширина/висота:

\`\`\`css
.video {
  aspect-ratio: 16 / 9;
  width: 100%;
  /* Висота розраховується автоматично */
}

.square {
  aspect-ratio: 1; /* Те саме що 1/1 */
}
\`\`\`

**Використання:**
- Адаптивні зображення/відео
- Плейсхолдер блоки
- Карткові макети
- Збереження пропорцій без padding hack`
  },
  'css-clearing-methods': {
    en: `**CSS clearing methods** for float layouts:

1. **clear property:**
\`\`\`css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

2. **overflow method:**
\`\`\`css
.container { overflow: auto; }
\`\`\`

3. **display: flow-root** (modern):
\`\`\`css
.container { display: flow-root; }
\`\`\`

Modern layouts (Flexbox, Grid) don't need clearing.`,
    ua: `**CSS методи clearing** для float макетів:

1. **clear властивість:**
\`\`\`css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

2. **overflow метод:**
\`\`\`css
.container { overflow: auto; }
\`\`\`

3. **display: flow-root** (сучасний):
\`\`\`css
.container { display: flow-root; }
\`\`\`

Сучасні макети (Flexbox, Grid) не потребують clearing.`
  },
  'css-container-queries': {
    en: `**Container Queries** style elements based on their container's size:

\`\`\`css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

**Difference from Media Queries:**
- Media queries: viewport size
- Container queries: parent element size

Perfect for **component-based** responsive design.`,
    ua: `**Container Queries** стилізують елементи на основі розміру їх контейнера:

\`\`\`css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

**Відмінність від Media Queries:**
- Media queries: розмір viewport
- Container queries: розмір батьківського елемента

Ідеально для **компонентного** адаптивного дизайну.`
  },
  'css-in-js-problems-and-solutions': {
    en: `**CSS-in-JS** problems and solutions:

**Problems:**
- Runtime performance overhead
- Bundle size increase
- SSR complexity
- Learning curve

**Solutions:**

| Library | Approach |
|---------|----------|
| **styled-components** | Runtime CSS generation |
| **Emotion** | Similar to styled-components |
| **Linaria** | Zero-runtime (compile-time) |
| **vanilla-extract** | Zero-runtime TypeScript |
| **Tailwind CSS** | Utility-first (not CSS-in-JS) |

Zero-runtime solutions extract CSS at build time.`,
    ua: `**CSS-in-JS** проблеми та рішення:

**Проблеми:**
- Накладні витрати runtime
- Збільшення розміру бандла
- Складність SSR
- Крива навчання

**Рішення:**

| Бібліотека | Підхід |
|------------|--------|
| **styled-components** | Runtime генерація CSS |
| **Emotion** | Схоже на styled-components |
| **Linaria** | Zero-runtime (compile-time) |
| **vanilla-extract** | Zero-runtime TypeScript |
| **Tailwind CSS** | Utility-first (не CSS-in-JS) |

Zero-runtime рішення витягують CSS під час збірки.`
  },
  'css-object-fit-and-object-position': {
    en: `**object-fit** controls how replaced elements (img, video) fit their container:

\`\`\`css
img {
  width: 300px;
  height: 200px;
  object-fit: cover;      /* Crop to fill */
  object-position: top;   /* Align to top */
}
\`\`\`

**object-fit values:**
- \`fill\` - Stretch to fill (default)
- \`contain\` - Fit inside, preserve ratio
- \`cover\` - Fill container, crop excess
- \`none\` - Original size
- \`scale-down\` - Smaller of none/contain`,
    ua: `**object-fit** контролює як замінювані елементи (img, video) вписуються в контейнер:

\`\`\`css
img {
  width: 300px;
  height: 200px;
  object-fit: cover;      /* Обрізати для заповнення */
  object-position: top;   /* Вирівняти по верху */
}
\`\`\`

**object-fit значення:**
- \`fill\` - Розтягнути для заповнення (за замовчуванням)
- \`contain\` - Вписати всередину, зберегти пропорції
- \`cover\` - Заповнити контейнер, обрізати зайве
- \`none\` - Оригінальний розмір
- \`scale-down\` - Менше з none/contain`
  },
  'difference-between-css-reset-and-normalize': {
    en: `**CSS Reset** vs **Normalize.css:**

| Reset | Normalize |
|-------|-----------|
| Removes ALL default styles | Preserves useful defaults |
| Everything starts from zero | Makes defaults consistent |
| More CSS to write | Less CSS needed |
| Aggressive approach | Gentle approach |

**Reset** - Complete blank slate
**Normalize** - Consistent cross-browser defaults

Modern alternative: Use \`box-sizing: border-box\` and minimal resets.`,
    ua: `**CSS Reset** vs **Normalize.css:**

| Reset | Normalize |
|-------|-----------|
| Видаляє ВСІ стилі за замовчуванням | Зберігає корисні стилі |
| Все починається з нуля | Робить стилі консистентними |
| Більше CSS писати | Менше CSS потрібно |
| Агресивний підхід | М'який підхід |

**Reset** - Повністю чистий аркуш
**Normalize** - Консистентні крос-браузерні стилі

Сучасна альтернатива: \`box-sizing: border-box\` та мінімальні reset-и.`
  },
  'difference-between-strong-and-b-tags-in-html': {
    en: `**\`<strong>\`** vs **\`<b>\`** in HTML:

| \`<strong>\` | \`<b>\` |
|-------------|---------|
| **Semantic** importance | **Visual** bold only |
| Screen readers emphasize | No semantic meaning |
| "Important text" | "Stylistically bold" |
| SEO weight | No SEO impact |

\`\`\`html
<!-- Important content -->
<strong>Warning!</strong>

<!-- Just visually bold -->
<b>Product name</b>
\`\`\`

Prefer \`<strong>\` for meaningful emphasis, \`<b>\` for visual styling only.`,
    ua: `**\`<strong>\`** vs **\`<b>\`** в HTML:

| \`<strong>\` | \`<b>\` |
|-------------|---------|
| **Семантична** важливість | Тільки **візуальний** bold |
| Скрінрідери наголошують | Без семантичного значення |
| "Важливий текст" | "Стилістично жирний" |
| Вага для SEO | Без впливу на SEO |

\`\`\`html
<!-- Важливий контент -->
<strong>Увага!</strong>

<!-- Просто візуально жирний -->
<b>Назва продукту</b>
\`\`\`

Використовуйте \`<strong>\` для смислового наголосу, \`<b>\` тільки для візуального стилю.`
  },
  'essential-meta-tags-in-html': {
    en: `**Essential meta tags** for HTML documents:

\`\`\`html
<!-- Character encoding -->
<meta charset="UTF-8">

<!-- Viewport for responsive -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- SEO -->
<meta name="description" content="Page description">
<meta name="robots" content="index, follow">

<!-- Open Graph (social sharing) -->
<meta property="og:title" content="Title">
<meta property="og:image" content="image.jpg">

<!-- Security -->
<meta http-equiv="Content-Security-Policy" content="...">
\`\`\``,
    ua: `**Необхідні meta теги** для HTML документів:

\`\`\`html
<!-- Кодування символів -->
<meta charset="UTF-8">

<!-- Viewport для адаптивності -->
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- SEO -->
<meta name="description" content="Опис сторінки">
<meta name="robots" content="index, follow">

<!-- Open Graph (шерінг у соцмережах) -->
<meta property="og:title" content="Заголовок">
<meta property="og:image" content="image.jpg">

<!-- Безпека -->
<meta http-equiv="Content-Security-Policy" content="...">
\`\`\``
  },
  'how-to-change-color-in-svg-file': {
    en: `**Changing SVG colors:**

1. **CSS fill/stroke** (inline or external):
\`\`\`css
svg { fill: red; stroke: blue; }
\`\`\`

2. **currentColor** (inherits text color):
\`\`\`html
<svg fill="currentColor">...</svg>
\`\`\`
\`\`\`css
.icon { color: red; } /* SVG becomes red */
\`\`\`

3. **CSS filter** (for img tags):
\`\`\`css
img { filter: invert(1) sepia(1) saturate(5) hue-rotate(180deg); }
\`\`\`

4. **mask-image** technique for background SVGs`,
    ua: `**Зміна кольорів SVG:**

1. **CSS fill/stroke** (inline або зовнішній):
\`\`\`css
svg { fill: red; stroke: blue; }
\`\`\`

2. **currentColor** (наслідує колір тексту):
\`\`\`html
<svg fill="currentColor">...</svg>
\`\`\`
\`\`\`css
.icon { color: red; } /* SVG стає червоним */
\`\`\`

3. **CSS filter** (для img тегів):
\`\`\`css
img { filter: invert(1) sepia(1) saturate(5) hue-rotate(180deg); }
\`\`\`

4. **mask-image** техніка для фонових SVG`
  },
  'how-to-hide-elements-visually-but-keep-them-accessible-to-screen-readers': {
    en: `**Visually hidden but accessible** CSS pattern:

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

**Don't use:**
- \`display: none\` - Hidden from everyone
- \`visibility: hidden\` - Hidden from everyone
- \`aria-hidden="true"\` - Hidden from screen readers

Use \`.sr-only\` for skip links, form labels, and context for screen reader users.`,
    ua: `**Візуально приховано але доступно** CSS патерн:

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

**Не використовуйте:**
- \`display: none\` - Приховано від усіх
- \`visibility: hidden\` - Приховано від усіх
- \`aria-hidden="true"\` - Приховано від скрінрідерів

Використовуйте \`.sr-only\` для skip links, міток форм та контексту для скрінрідерів.`
  },
  'methods-for-style-isolation-in-css': {
    en: `**CSS style isolation methods:**

1. **CSS Modules** - Scoped class names
\`\`\`css
/* Button.module.css */
.button { } /* Becomes .Button_button_x7js2 */
\`\`\`

2. **BEM** - Naming convention
\`\`\`css
.block__element--modifier { }
\`\`\`

3. **Shadow DOM** - Browser-native encapsulation

4. **CSS-in-JS** - Scoped via JavaScript

5. **Scoped CSS** (Vue) - \`<style scoped>\`

6. **Tailwind/Atomic** - Utility classes avoid conflicts`,
    ua: `**Методи ізоляції CSS стилів:**

1. **CSS Modules** - Scoped імена класів
\`\`\`css
/* Button.module.css */
.button { } /* Стає .Button_button_x7js2 */
\`\`\`

2. **BEM** - Конвенція найменування
\`\`\`css
.block__element--modifier { }
\`\`\`

3. **Shadow DOM** - Нативна інкапсуляція браузера

4. **CSS-in-JS** - Ізоляція через JavaScript

5. **Scoped CSS** (Vue) - \`<style scoped>\`

6. **Tailwind/Atomic** - Utility класи уникають конфліктів`
  },
  'what-are-data-attributes-in-html': {
    en: `**Data attributes** store custom data on HTML elements:

\`\`\`html
<div data-user-id="123" data-role="admin">User</div>
\`\`\`

**Access in JavaScript:**
\`\`\`javascript
element.dataset.userId  // "123"
element.dataset.role    // "admin"
element.getAttribute('data-user-id')
\`\`\`

**Access in CSS:**
\`\`\`css
[data-role="admin"] { color: red; }
div::before { content: attr(data-user-id); }
\`\`\`

Use for: passing data to JS, CSS hooks, testing selectors.`,
    ua: `**Data атрибути** зберігають кастомні дані на HTML елементах:

\`\`\`html
<div data-user-id="123" data-role="admin">User</div>
\`\`\`

**Доступ в JavaScript:**
\`\`\`javascript
element.dataset.userId  // "123"
element.dataset.role    // "admin"
element.getAttribute('data-user-id')
\`\`\`

**Доступ в CSS:**
\`\`\`css
[data-role="admin"] { color: red; }
div::before { content: attr(data-user-id); }
\`\`\`

Використання: передача даних у JS, CSS хуки, селектори для тестування.`
  },
  'what-are-vh-vw-vmin-and-vmax-in-css': {
    en: `**Viewport units** in CSS:

| Unit | Description |
|------|-------------|
| \`vw\` | 1% of viewport **width** |
| \`vh\` | 1% of viewport **height** |
| \`vmin\` | 1% of **smaller** dimension |
| \`vmax\` | 1% of **larger** dimension |

\`\`\`css
.hero { height: 100vh; }           /* Full viewport height */
.text { font-size: 5vw; }          /* Responsive text */
.square { width: 50vmin; height: 50vmin; } /* Square that fits */
\`\`\`

**Note:** \`100vh\` on mobile may include address bar. Use \`dvh\` (dynamic) for mobile.`,
    ua: `**Viewport одиниці** в CSS:

| Одиниця | Опис |
|---------|------|
| \`vw\` | 1% від **ширини** viewport |
| \`vh\` | 1% від **висоти** viewport |
| \`vmin\` | 1% від **меншого** виміру |
| \`vmax\` | 1% від **більшого** виміру |

\`\`\`css
.hero { height: 100vh; }           /* Повна висота viewport */
.text { font-size: 5vw; }          /* Адаптивний текст */
.square { width: 50vmin; height: 50vmin; } /* Квадрат що вміщується */
\`\`\`

**Примітка:** \`100vh\` на мобільних може включати адресну строку. Використовуйте \`dvh\` (dynamic) для мобільних.`
  },

  // ===== PATTERNS =====
  'abstract-factory-pattern': {
    en: `**Abstract Factory** creates families of related objects without specifying their concrete classes.

\`\`\`typescript
interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}

class DarkThemeFactory implements UIFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}

class LightThemeFactory implements UIFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}
\`\`\`

Use when you need to create consistent object families (themes, platforms).`,
    ua: `**Abstract Factory** створює сімейства пов'язаних об'єктів без вказання конкретних класів.

\`\`\`typescript
interface UIFactory {
  createButton(): Button;
  createInput(): Input;
}

class DarkThemeFactory implements UIFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}

class LightThemeFactory implements UIFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}
\`\`\`

Використовуйте коли потрібно створювати консистентні сімейства об'єктів (теми, платформи).`
  },
  'decorator-pattern': {
    en: `**Decorator** adds behavior to objects dynamically without modifying their code.

\`\`\`typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() { return 5; }
  description() { return "Coffee"; }
}

class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  cost() { return this.coffee.cost() + 2; }
  description() { return this.coffee.description() + " + milk"; }
}

const latte = new MilkDecorator(new SimpleCoffee());
// cost: 7, description: "Coffee + milk"
\`\`\``,
    ua: `**Decorator** додає поведінку об'єктам динамічно без модифікації їх коду.

\`\`\`typescript
interface Coffee {
  cost(): number;
  description(): string;
}

class SimpleCoffee implements Coffee {
  cost() { return 5; }
  description() { return "Coffee"; }
}

class MilkDecorator implements Coffee {
  constructor(private coffee: Coffee) {}
  cost() { return this.coffee.cost() + 2; }
  description() { return this.coffee.description() + " + milk"; }
}

const latte = new MilkDecorator(new SimpleCoffee());
// cost: 7, description: "Coffee + milk"
\`\`\``
  },
  'mvc-model-view-controller-and-mvp-model-view-presenter-design-patterns': {
    en: `**MVC** vs **MVP** architectural patterns:

**MVC (Model-View-Controller):**
- View observes Model directly
- Controller handles user input
- Used in: Ruby on Rails, ASP.NET MVC

**MVP (Model-View-Presenter):**
- Presenter mediates between View and Model
- View is passive (no Model knowledge)
- Better testability
- Used in: Android (legacy), WinForms

| MVC | MVP |
|-----|-----|
| View ↔ Model | View ↔ Presenter ↔ Model |
| Less testable | More testable |
| Simpler | More boilerplate |`,
    ua: `**MVC** vs **MVP** архітектурні патерни:

**MVC (Model-View-Controller):**
- View спостерігає Model напряму
- Controller обробляє введення користувача
- Використовується в: Ruby on Rails, ASP.NET MVC

**MVP (Model-View-Presenter):**
- Presenter посередник між View та Model
- View пасивний (не знає про Model)
- Краща тестовність
- Використовується в: Android (legacy), WinForms

| MVC | MVP |
|-----|-----|
| View ↔ Model | View ↔ Presenter ↔ Model |
| Менш тестовний | Більш тестовний |
| Простіший | Більше boilerplate |`
  },
  'what-are-grasp-patterns': {
    en: `**GRASP** (General Responsibility Assignment Software Patterns):

1. **Information Expert** - Assign responsibility to class with needed data
2. **Creator** - B creates A if B contains/aggregates A
3. **Controller** - Handle system events in controller class
4. **Low Coupling** - Minimize dependencies
5. **High Cohesion** - Keep related behavior together
6. **Polymorphism** - Use polymorphism for type-based behavior
7. **Pure Fabrication** - Create classes not in domain when needed
8. **Indirection** - Add intermediate objects to reduce coupling
9. **Protected Variations** - Encapsulate instability points`,
    ua: `**GRASP** (General Responsibility Assignment Software Patterns):

1. **Information Expert** - Призначити відповідальність класу з потрібними даними
2. **Creator** - B створює A якщо B містить/агрегує A
3. **Controller** - Обробляти системні події в контролері
4. **Low Coupling** - Мінімізувати залежності
5. **High Cohesion** - Тримати пов'язану поведінку разом
6. **Polymorphism** - Поліморфізм для поведінки на основі типу
7. **Pure Fabrication** - Створювати класи поза доменом за потреби
8. **Indirection** - Додавати проміжні об'єкти для зменшення зв'язності
9. **Protected Variations** - Інкапсулювати точки нестабільності`
  },

  // ===== REDUX =====
  'redux-middleware': {
    en: `**Redux middleware** intercepts actions between dispatch and reducer.

\`\`\`typescript
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Apply middleware
const store = createStore(
  reducer,
  applyMiddleware(loggerMiddleware, thunk)
);
\`\`\`

**Common middleware:**
- **redux-thunk** - Async actions
- **redux-saga** - Complex async flows
- **redux-logger** - Action logging`,
    ua: `**Redux middleware** перехоплює actions між dispatch та reducer.

\`\`\`typescript
const loggerMiddleware = store => next => action => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Застосування middleware
const store = createStore(
  reducer,
  applyMiddleware(loggerMiddleware, thunk)
);
\`\`\`

**Поширені middleware:**
- **redux-thunk** - Асинхронні дії
- **redux-saga** - Складні асинхронні потоки
- **redux-logger** - Логування actions`
  },
  'redux-thunk': {
    en: `**Redux Thunk** allows dispatching functions (thunks) instead of plain action objects.

\`\`\`typescript
// Thunk action creator
const fetchUser = (id: string) => async (dispatch, getState) => {
  dispatch({ type: 'USER_LOADING' });
  
  try {
    const user = await api.getUser(id);
    dispatch({ type: 'USER_LOADED', payload: user });
  } catch (error) {
    dispatch({ type: 'USER_ERROR', payload: error });
  }
};

// Usage
dispatch(fetchUser('123'));
\`\`\`

Thunks enable async logic with access to \`dispatch\` and \`getState\`.`,
    ua: `**Redux Thunk** дозволяє відправляти функції (thunks) замість простих action об'єктів.

\`\`\`typescript
// Thunk action creator
const fetchUser = (id: string) => async (dispatch, getState) => {
  dispatch({ type: 'USER_LOADING' });
  
  try {
    const user = await api.getUser(id);
    dispatch({ type: 'USER_LOADED', payload: user });
  } catch (error) {
    dispatch({ type: 'USER_ERROR', payload: error });
  }
};

// Використання
dispatch(fetchUser('123'));
\`\`\`

Thunks дозволяють асинхронну логіку з доступом до \`dispatch\` та \`getState\`.`
  },
  'redux-vs-context-api': {
    en: `**Redux** vs **Context API:**

| Feature | Redux | Context API |
|---------|-------|-------------|
| Boilerplate | More | Less |
| DevTools | Excellent | Limited |
| Middleware | Yes (thunk, saga) | No |
| Performance | Optimized selectors | Re-renders all consumers |
| Learning curve | Steeper | Easier |

**Use Context for:** Theme, locale, simple global state
**Use Redux for:** Complex state, many updates, time-travel debugging

Modern alternative: **Zustand**, **Jotai** - simpler than Redux.`,
    ua: `**Redux** vs **Context API:**

| Функція | Redux | Context API |
|---------|-------|-------------|
| Boilerplate | Більше | Менше |
| DevTools | Відмінні | Обмежені |
| Middleware | Так (thunk, saga) | Ні |
| Продуктивність | Оптимізовані селектори | Ре-рендер всіх споживачів |
| Крива навчання | Крутіша | Легша |

**Context для:** Тема, локаль, простий глобальний стан
**Redux для:** Складний стан, багато оновлень, time-travel дебагінг

Сучасна альтернатива: **Zustand**, **Jotai** - простіші ніж Redux.`
  },

  // ===== VUE =====
  'composables-in-vuejs': {
    en: `**Composables** are reusable composition functions in Vue 3:

\`\`\`typescript
// useCounter.ts
import { ref } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  
  return { count, increment, decrement };
}

// Component
const { count, increment } = useCounter(10);
\`\`\`

Composables replace Vue 2 mixins with better:
- TypeScript support
- Clear data flow
- No naming conflicts`,
    ua: `**Composables** — перевикористовувані composition функції у Vue 3:

\`\`\`typescript
// useCounter.ts
import { ref } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  
  return { count, increment, decrement };
}

// Компонент
const { count, increment } = useCounter(10);
\`\`\`

Composables замінюють mixins Vue 2 з кращою:
- Підтримкою TypeScript
- Чітким потоком даних
- Без конфліктів імен`
  },
  'how-does-virtual-dom-work-in-vuejs': {
    en: `**Virtual DOM** in Vue is a JavaScript representation of the real DOM:

1. **Render** - Component renders Virtual DOM tree (VNodes)
2. **Diff** - Vue compares new VNodes with previous
3. **Patch** - Only changed nodes update real DOM

\`\`\`javascript
// Virtual node structure
{
  type: 'div',
  props: { class: 'container' },
  children: [
    { type: 'span', children: 'Hello' }
  ]
}
\`\`\`

**Optimizations:**
- Static hoisting (skip static nodes)
- Patch flags (track dynamic parts)
- Tree flattening`,
    ua: `**Virtual DOM** у Vue — JavaScript представлення реального DOM:

1. **Render** - Компонент рендерить Virtual DOM дерево (VNodes)
2. **Diff** - Vue порівнює нові VNodes з попередніми
3. **Patch** - Тільки змінені вузли оновлюють реальний DOM

\`\`\`javascript
// Структура віртуального вузла
{
  type: 'div',
  props: { class: 'container' },
  children: [
    { type: 'span', children: 'Hello' }
  ]
}
\`\`\`

**Оптимізації:**
- Static hoisting (пропуск статичних вузлів)
- Patch flags (відстеження динамічних частин)
- Tree flattening`
  },
  'how-to-add-fallback-content-for-slots-in-vue': {
    en: `**Slot fallback content** is default content when no slot content is provided:

\`\`\`vue
<!-- ChildComponent.vue -->
<template>
  <button>
    <slot>Default Text</slot>
  </button>
</template>

<!-- Usage -->
<ChildComponent />           <!-- Shows: "Default Text" -->
<ChildComponent>Click Me</ChildComponent>  <!-- Shows: "Click Me" -->

<!-- Named slot fallback -->
<template>
  <header>
    <slot name="header">Default Header</slot>
  </header>
</template>
\`\`\``,
    ua: `**Fallback контент слота** — стандартний контент коли слот не заповнено:

\`\`\`vue
<!-- ChildComponent.vue -->
<template>
  <button>
    <slot>Текст за замовчуванням</slot>
  </button>
</template>

<!-- Використання -->
<ChildComponent />           <!-- Показує: "Текст за замовчуванням" -->
<ChildComponent>Натисни</ChildComponent>  <!-- Показує: "Натисни" -->

<!-- Fallback іменованого слота -->
<template>
  <header>
    <slot name="header">Header за замовчуванням</slot>
  </header>
</template>
\`\`\``
  },
  'how-to-efficiently-pass-data-between-components': {
    en: `**Data passing** methods in Vue:

1. **Props** (parent → child):
\`\`\`vue
<Child :data="value" />
\`\`\`

2. **Events/Emit** (child → parent):
\`\`\`vue
emit('update', newValue)
\`\`\`

3. **v-model** (two-way):
\`\`\`vue
<Child v-model="value" />
\`\`\`

4. **Provide/Inject** (deep passing):
\`\`\`typescript
provide('key', value)
const value = inject('key')
\`\`\`

5. **Pinia/Vuex** (global state)

Choose based on component relationship depth.`,
    ua: `**Передача даних** методи у Vue:

1. **Props** (батько → дитина):
\`\`\`vue
<Child :data="value" />
\`\`\`

2. **Events/Emit** (дитина → батько):
\`\`\`vue
emit('update', newValue)
\`\`\`

3. **v-model** (двостороння):
\`\`\`vue
<Child v-model="value" />
\`\`\`

4. **Provide/Inject** (глибока передача):
\`\`\`typescript
provide('key', value)
const value = inject('key')
\`\`\`

5. **Pinia/Vuex** (глобальний стан)

Вибирайте на основі глибини зв'язку компонентів.`
  },
  'main-directives-in-vuejs': {
    en: `**Vue built-in directives:**

| Directive | Purpose |
|-----------|---------|
| \`v-if\` / \`v-else\` / \`v-else-if\` | Conditional rendering |
| \`v-show\` | Toggle visibility (CSS) |
| \`v-for\` | List rendering |
| \`v-bind\` (\`:\`) | Bind attributes |
| \`v-on\` (\`@\`) | Event listeners |
| \`v-model\` | Two-way binding |
| \`v-slot\` (\`#\`) | Named slots |
| \`v-pre\` | Skip compilation |
| \`v-once\` | Render once |
| \`v-memo\` | Memoize template (Vue 3.2+) |`,
    ua: `**Вбудовані директиви Vue:**

| Директива | Призначення |
|-----------|-------------|
| \`v-if\` / \`v-else\` / \`v-else-if\` | Умовний рендеринг |
| \`v-show\` | Перемикання видимості (CSS) |
| \`v-for\` | Рендеринг списків |
| \`v-bind\` (\`:\`) | Прив'язка атрибутів |
| \`v-on\` (\`@\`) | Обробники подій |
| \`v-model\` | Двостороння прив'язка |
| \`v-slot\` (\`#\`) | Іменовані слоти |
| \`v-pre\` | Пропустити компіляцію |
| \`v-once\` | Рендер один раз |
| \`v-memo\` | Мемоізація шаблону (Vue 3.2+) |`
  },
  'provideinject-in-vuejs': {
    en: `**Provide/Inject** passes data through component tree without prop drilling:

\`\`\`typescript
// Parent component
import { provide, ref } from 'vue';

const theme = ref('dark');
provide('theme', theme);

// Deep child component
import { inject } from 'vue';

const theme = inject('theme', 'light'); // 'light' is default
\`\`\`

**Key points:**
- Reactivity preserved with \`ref\`/\`reactive\`
- Optional default value
- Good for themes, localization, services
- Alternative to Vuex/Pinia for some cases`,
    ua: `**Provide/Inject** передає дані через дерево компонентів без prop drilling:

\`\`\`typescript
// Батьківський компонент
import { provide, ref } from 'vue';

const theme = ref('dark');
provide('theme', theme);

// Глибокий дочірній компонент
import { inject } from 'vue';

const theme = inject('theme', 'light'); // 'light' за замовчуванням
\`\`\`

**Ключові моменти:**
- Реактивність зберігається з \`ref\`/\`reactive\`
- Опціональне значення за замовчуванням
- Добре для тем, локалізації, сервісів
- Альтернатива Vuex/Pinia для деяких випадків`
  },
  'teleport-in-vuejs': {
    en: `**Teleport** renders component content to a different DOM location:

\`\`\`vue
<template>
  <button @click="showModal = true">Open Modal</button>
  
  <Teleport to="body">
    <div v-if="showModal" class="modal">
      Modal content rendered at body level!
    </div>
  </Teleport>
</template>
\`\`\`

**Use cases:**
- Modals/dialogs (avoid z-index issues)
- Tooltips/popovers
- Notifications
- Any UI that needs to escape parent CSS

The \`to\` attribute accepts CSS selector or DOM element.`,
    ua: `**Teleport** рендерить контент компонента в іншому місці DOM:

\`\`\`vue
<template>
  <button @click="showModal = true">Відкрити модальне</button>
  
  <Teleport to="body">
    <div v-if="showModal" class="modal">
      Контент модального рендериться на рівні body!
    </div>
  </Teleport>
</template>
\`\`\`

**Використання:**
- Модальні вікна/діалоги (уникнення z-index проблем)
- Тултіпи/поповери
- Нотифікації
- Будь-який UI що має вийти з батьківського CSS

Атрибут \`to\` приймає CSS селектор або DOM елемент.`
  },
  'v-model-in-vuejs': {
    en: `**v-model** provides two-way data binding:

\`\`\`vue
<!-- Basic usage -->
<input v-model="text" />

<!-- Equivalent to -->
<input :value="text" @input="text = $event.target.value" />

<!-- Custom component v-model -->
<CustomInput v-model="text" />

// CustomInput.vue
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

<input 
  :value="modelValue"
  @input="$emit('update:modelValue', $event.target.value)"
/>
\`\`\`

**Modifiers:** \`.lazy\`, \`.number\`, \`.trim\``,
    ua: `**v-model** забезпечує двосторонню прив'язку даних:

\`\`\`vue
<!-- Базове використання -->
<input v-model="text" />

<!-- Еквівалентно -->
<input :value="text" @input="text = $event.target.value" />

<!-- v-model кастомного компонента -->
<CustomInput v-model="text" />

// CustomInput.vue
defineProps(['modelValue'])
defineEmits(['update:modelValue'])

<input 
  :value="modelValue"
  @input="$emit('update:modelValue', $event.target.value)"
/>
\`\`\`

**Модифікатори:** \`.lazy\`, \`.number\`, \`.trim\``
  },
  'vue-components-and-their-lifecycles': {
    en: `**Vue 3 lifecycle hooks:**

\`\`\`typescript
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

onBeforeMount(() => { /* Before DOM insert */ });
onMounted(() => { /* DOM ready, fetch data */ });
onBeforeUpdate(() => { /* Before re-render */ });
onUpdated(() => { /* After re-render */ });
onBeforeUnmount(() => { /* Cleanup start */ });
onUnmounted(() => { /* Fully destroyed */ });
\`\`\`

Use \`onMounted\` for DOM access and API calls.
Use \`onUnmounted\` for cleanup (listeners, timers).`,
    ua: `**Vue 3 хуки життєвого циклу:**

\`\`\`typescript
import { 
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

onBeforeMount(() => { /* Перед вставкою в DOM */ });
onMounted(() => { /* DOM готовий, fetch даних */ });
onBeforeUpdate(() => { /* Перед ре-рендером */ });
onUpdated(() => { /* Після ре-рендеру */ });
onBeforeUnmount(() => { /* Початок очищення */ });
onUnmounted(() => { /* Повністю знищено */ });
\`\`\`

Використовуйте \`onMounted\` для доступу до DOM та API запитів.
Використовуйте \`onUnmounted\` для очищення (listeners, timers).`
  },
  'what-are-attribute-bindings-in-vue': {
    en: `**Attribute bindings** in Vue use \`v-bind\` or shorthand \`:\`:

\`\`\`vue
<!-- Dynamic attribute -->
<img :src="imageUrl" :alt="imageAlt" />

<!-- Boolean attribute -->
<button :disabled="isDisabled">Submit</button>

<!-- Multiple attributes -->
<div v-bind="{ id: itemId, class: itemClass }"></div>

<!-- Dynamic attribute name -->
<div :[attributeName]="value"></div>

<!-- Class binding -->
<div :class="{ active: isActive, 'text-bold': isBold }"></div>

<!-- Style binding -->
<div :style="{ color: textColor, fontSize: size + 'px' }"></div>
\`\`\``,
    ua: `**Прив'язка атрибутів** у Vue використовує \`v-bind\` або скорочення \`:\`:

\`\`\`vue
<!-- Динамічний атрибут -->
<img :src="imageUrl" :alt="imageAlt" />

<!-- Булевий атрибут -->
<button :disabled="isDisabled">Submit</button>

<!-- Кілька атрибутів -->
<div v-bind="{ id: itemId, class: itemClass }"></div>

<!-- Динамічна назва атрибута -->
<div :[attributeName]="value"></div>

<!-- Прив'язка класу -->
<div :class="{ active: isActive, 'text-bold': isBold }"></div>

<!-- Прив'язка стилю -->
<div :style="{ color: textColor, fontSize: size + 'px' }"></div>
\`\`\``
  },
  'what-are-props-in-vue': {
    en: `**Props** pass data from parent to child components:

\`\`\`vue
<!-- Parent -->
<UserCard :name="userName" :age="25" :is-admin="true" />

<!-- Child: UserCard.vue -->
<script setup>
const props = defineProps({
  name: { type: String, required: true },
  age: { type: Number, default: 18 },
  isAdmin: Boolean
});
</script>

<template>
  <div>{{ name }}, {{ age }}</div>
</template>
\`\`\`

**Key rules:**
- Props are **read-only** (one-way data flow)
- Use \`kebab-case\` in templates, \`camelCase\` in JS`,
    ua: `**Props** передають дані від батьківського до дочірнього компонента:

\`\`\`vue
<!-- Батько -->
<UserCard :name="userName" :age="25" :is-admin="true" />

<!-- Дитина: UserCard.vue -->
<script setup>
const props = defineProps({
  name: { type: String, required: true },
  age: { type: Number, default: 18 },
  isAdmin: Boolean
});
</script>

<template>
  <div>{{ name }}, {{ age }}</div>
</template>
\`\`\`

**Ключові правила:**
- Props **тільки для читання** (односторонній потік даних)
- Використовуйте \`kebab-case\` в шаблонах, \`camelCase\` в JS`
  },
  'what-are-slots-in-vue': {
    en: `**Slots** allow parent to inject content into child component:

\`\`\`vue
<!-- Child: Card.vue -->
<template>
  <div class="card">
    <slot name="header">Default Header</slot>
    <slot></slot> <!-- Default slot -->
    <slot name="footer"></slot>
  </div>
</template>

<!-- Parent usage -->
<Card>
  <template #header>
    <h1>Custom Header</h1>
  </template>
  
  <p>Main content goes here</p>
  
  <template #footer>
    <button>Action</button>
  </template>
</Card>
\`\`\`

**Scoped slots** pass data back to parent.`,
    ua: `**Slots** дозволяють батьку вставляти контент у дочірній компонент:

\`\`\`vue
<!-- Дитина: Card.vue -->
<template>
  <div class="card">
    <slot name="header">Header за замовчуванням</slot>
    <slot></slot> <!-- Слот за замовчуванням -->
    <slot name="footer"></slot>
  </div>
</template>

<!-- Використання батьком -->
<Card>
  <template #header>
    <h1>Кастомний Header</h1>
  </template>
  
  <p>Основний контент тут</p>
  
  <template #footer>
    <button>Дія</button>
  </template>
</Card>
\`\`\`

**Scoped slots** передають дані назад до батька.`
  }
};

async function updateShortAnswers() {
  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log('🚀 Updating all missing short answers...\n');

  let updated = 0;
  let notFound = 0;

  for (const [slug, answers] of Object.entries(shortAnswers)) {
    try {
      const result = await db
        .update(questions)
        .set({
          shortAnswerEn: answers.en,
          shortAnswerUa: answers.ua,
        })
        .where(eq(questions.slug, slug))
        .returning({ id: questions.id });

      if (result.length > 0) {
        console.log(`✅ ${slug}`);
        updated++;
      } else {
        console.log(`❌ Not found: ${slug}`);
        notFound++;
      }
    } catch (error) {
      console.error(`❌ Error updating ${slug}:`, error);
      notFound++;
    }
  }

  console.log(`\n✅ Updated: ${updated} | ❌ Not found: ${notFound}`);

  await client.end();
  process.exit(0);
}

updateShortAnswers();
