/**
 * React Complete Section - All 36 Questions
 * Comprehensive batch addition with concise bilingual content
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const client = postgres(connectionString.split('?')[0])
const db = drizzle(client, { schema })

const questions = [
  {
    slug: 'what-is-react',
    titleEn: 'What is React?',
    titleUa: 'Що таке React?',
    descriptionEn: 'JavaScript library for building UIs',
    descriptionUa: 'JavaScript бібліотека для створення UI',
    difficulty: 'EASY' as const,
    order: 1,
    contentMarkdownEn: `React is a JavaScript library for creating user interfaces. Component-based, uses Virtual DOM, declarative approach. Developed by Facebook. Works on web and mobile (React Native).`,
    contentMarkdownUa: `React є JavaScript бібліотекою для створення користувацьких інтерфейсів. Компонентний підхід, використовує Virtual DOM, декларативний підхід. Розроблена Facebook. Працює на вебі та мобільних (React Native).`,
  },
  {
    slug: 'virtual-dom',
    titleEn: 'Virtual DOM',
    titleUa: 'Virtual DOM',
    descriptionEn: 'Lightweight DOM copy in memory',
    descriptionUa: 'Легка копія DOM в памяті',
    difficulty: 'MEDIUM' as const,
    order: 2,
    contentMarkdownEn: `Lightweight copy of real DOM in RAM. React updates it first, then compares (diffing) and precisely updates real DOM (reconciliation). O(n) heuristic algorithm. Uses keys for list optimization.`,
    contentMarkdownUa: `Легка копія реального DOM в RAM. React оновлює його спочатку, потім порівнює (diffing) та точно оновлює реальний DOM (reconciliation). O(n) евристичний алгоритм. Використовує ключі для оптимізації списків.`,
  },
  {
    slug: 'react-fiber',
    titleEn: 'React Fiber',
    titleUa: 'React Fiber',
    descriptionEn: 'New reconciliation engine',
    descriptionUa: 'Новий движок reconciliation',
    difficulty: 'HARD' as const,
    order: 3,
    contentMarkdownEn: `New reconciliation mechanism in React 16+. Incremental rendering: breaks work into tasks. Update priorities. Can interrupt and resume render. Foundation for Concurrent Mode. Render Phase (reconciliation) + Commit Phase (DOM updates).`,
    contentMarkdownUa: `Новий механізм reconciliation в React 16+. Інкрементальний рендеринг: розбиває роботу на задачі. Пріоритети оновлень. Може переривати та відновлювати рендер. Основа для Concurrent Mode. Render Phase (reconciliation) + Commit Phase (оновлення DOM).`,
  },
  {
    slug: 'react-key',
    titleEn: 'key Prop',
    titleUa: 'key Проп',
    descriptionEn: 'Unique identifier for list elements',
    descriptionUa: 'Унікальний ідентифікатор для елементів списку',
    difficulty: 'MEDIUM' as const,
    order: 4,
    contentMarkdownEn: `Special prop for unique identification in lists. Helps React track element changes, additions, removals. Optimizes rendering. Don't use index as key when order changes. Must be stable and unique among siblings.`,
    contentMarkdownUa: `Спеціальний проп для унікальної ідентифікації в списках. Допомагає React відслідковувати зміни, додавання, видалення елементів. Оптимізує рендеринг. Не використовуйте індекс як key коли порядок змінюється. Повинен бути стабільним та унікальним серед сусідів.`,
  },
  {
    slug: 'react-batching',
    titleEn: 'Batching',
    titleUa: 'Batching (Пакування)',
    descriptionEn: 'Combining multiple state updates',
    descriptionUa: 'Обєднання множинних оновлень стану',
    difficulty: 'MEDIUM' as const,
    order: 5,
    contentMarkdownEn: `Process of combining multiple setState calls into one to minimize re-renders. Improves performance. React 18: automatic batching everywhere (even in async). Before React 18: only in event handlers.`,
    contentMarkdownUa: `Процес обєднання множинних викликів setState в один для мінімізації ре-рендерів. Покращує продуктивність. React 18: автоматичне batching всюди (навіть в async). До React 18: тільки в обробниках подій.`,
  },
  {
    slug: 'jsx',
    titleEn: 'JSX',
    titleUa: 'JSX',
    descriptionEn: 'JavaScript XML syntax extension',
    descriptionUa: 'Розширення синтаксису JavaScript XML',
    difficulty: 'EASY' as const,
    order: 6,
    contentMarkdownEn: `Syntax extension for JavaScript. Looks like HTML but is JavaScript. Compiled to React.createElement() by Babel. camelCase attributes (className, onClick). Must have one root element or Fragment.`,
    contentMarkdownUa: `Розширення синтаксису для JavaScript. Виглядає як HTML але є JavaScript. Компілюється в React.createElement() Babel. camelCase атрибути (className, onClick). Повинен мати один кореневий елемент або Fragment.`,
  },
  {
    slug: 'use-state',
    titleEn: 'useState Hook',
    titleUa: 'Хук useState',
    descriptionEn: 'State management in functional components',
    descriptionUa: 'Керування станом у функціональних компонентах',
    difficulty: 'EASY' as const,
    order: 7,
    contentMarkdownEn: `Hook for adding state to functional components. Returns [state, setState]. setState triggers re-render. Use function form for updates based on previous state. Can pass initializer function for expensive calculations.`,
    contentMarkdownUa: `Хук для додавання стану до функціональних компонентів. Повертає [state, setState]. setState викликає ре-рендер. Використовуйте функціональну форму для оновлень базуючись на попередньому стані. Можна передати функцію ініціалізатор для дорогих обчислень.`,
  },
  {
    slug: 'use-effect',
    titleEn: 'useEffect Hook',
    titleUa: 'Хук useEffect',
    descriptionEn: 'Side effects in functional components',
    descriptionUa: 'Побічні ефекти у функціональних компонентах',
    difficulty: 'MEDIUM' as const,
    order: 8,
    contentMarkdownEn: `Hook for side effects. Executes after render. Dependencies array controls when it runs. Return cleanup function. Async after browser paint. Used for API calls, subscriptions, timers.`,
    contentMarkdownUa: `Хук для побічних ефектів. Виконується після рендеру. Масив залежностей контролює коли він запускається. Повертає функцію очищення. Асинхронний після browser paint. Використовується для API викликів, підписок, таймерів.`,
  },
  {
    slug: 'use-layout-effect',
    titleEn: 'useLayoutEffect Hook',
    titleUa: 'Хук useLayoutEffect',
    descriptionEn: 'Synchronous effect before browser paint',
    descriptionUa: 'Синхронний ефект перед browser paint',
    difficulty: 'MEDIUM' as const,
    order: 9,
    contentMarkdownEn: `Like useEffect but synchronous. Executes after DOM updates but BEFORE browser paints. Blocks rendering. Use for DOM measurements, synchronous style changes. Prefer useEffect for most cases.`,
    contentMarkdownUa: `Як useEffect але синхронний. Виконується після оновлень DOM але ПЕРЕД browser paint. Блокує рендеринг. Використовуйте для вимірювань DOM, синхронних змін стилів. Віддавайте перевагу useEffect для більшості випадків.`,
  },
  {
    slug: 'use-ref',
    titleEn: 'useRef Hook',
    titleUa: 'Хук useRef',
    descriptionEn: 'Reference to DOM or mutable value',
    descriptionUa: 'Посилання на DOM або мутабельне значення',
    difficulty: 'EASY' as const,
    order: 10,
    contentMarkdownEn: `Stores reference to DOM element or mutable value. Doesn't trigger re-render when changed. ref.current. Use for DOM access, storing timers, previous values.`,
    contentMarkdownUa: `Зберігає посилання на DOM елемент або мутабельне значення. Не викликає ре-рендер при зміні. ref.current. Використовуйте для доступу до DOM, зберігання таймерів, попередніх значень.`,
  },
  {
    slug: 'use-imperative-handle',
    titleEn: 'useImperativeHandle Hook',
    titleUa: 'Хук useImperativeHandle',
    descriptionEn: 'Customize ref exposure',
    descriptionUa: 'Налаштувати експозицію ref',
    difficulty: 'HARD' as const,
    order: 11,
    contentMarkdownEn: `Controls which methods/properties are accessible to parent via ref. Used with forwardRef. Encapsulates internals. Good for custom inputs, modals. Advanced pattern.`,
    contentMarkdownUa: `Контролює які методи/властивості доступні батькові через ref. Використовується з forwardRef. Інкапсулює внутрішнє. Добре для кастомних інпутів, модалів. Просунутий шаблон.`,
  },
  {
    slug: 'use-callback',
    titleEn: 'useCallback Hook',
    titleUa: 'Хук useCallback',
    descriptionEn: 'Memoize functions',
    descriptionUa: 'Мемоїзація функцій',
    difficulty: 'MEDIUM' as const,
    order: 12,
    contentMarkdownEn: `Memoizes functions between renders. Returns same reference if dependencies unchanged. Prevents child re-renders with React.memo. Use when passing to optimized components or as dependency.`,
    contentMarkdownUa: `Мемоїзує функції між рендерами. Повертає те саме посилання якщо залежності не змінилися. Запобігає дочірнім ре-рендерам з React.memo. Використовуйте при передачі оптимізованим компонентам або як залежність.`,
  },
  {
    slug: 'use-memo',
    titleEn: 'useMemo Hook',
    titleUa: 'Хук useMemo',
    descriptionEn: 'Memoize expensive calculations',
    descriptionUa: 'Мемоїзація дорогих обчислень',
    difficulty: 'MEDIUM' as const,
    order: 13,
    contentMarkdownEn: `Memoizes computation result. Recalculates only when dependencies change. Avoids expensive operations on every render. Use for heavy calculations, not simple ones. Returns value (vs useCallback returns function).`,
    contentMarkdownUa: `Мемоїзує результат обчислення. Перераховує тільки коли залежності змінюються. Уникає дорогих операцій на кожному рендері. Використовуйте для важких обчислень, не простих. Повертає значення (на відміну від useCallback повертає функцію).`,
  },
  {
    slug: 'react-memo',
    titleEn: 'React.memo',
    titleUa: 'React.memo',
    descriptionEn: 'Memoize functional components',
    descriptionUa: 'Мемоїзація функціональних компонентів',
    difficulty: 'MEDIUM' as const,
    order: 14,
    contentMarkdownEn: `Higher-order component that memoizes functional components. Prevents re-render if props unchanged. Shallow comparison by default. Can provide custom comparison. Functional equivalent of PureComponent.`,
    contentMarkdownUa: `Компонент вищого порядку що мемоїзує функціональні компоненти. Запобігає ре-рендеру якщо пропи не змінилися. Поверхневе порівняння за замовчуванням. Можна надати кастомне порівняння. Функціональний еквівалент PureComponent.`,
  },
  {
    slug: 'use-reducer',
    titleEn: 'useReducer Hook',
    titleUa: 'Хук useReducer',
    descriptionEn: 'Alternative to useState for complex state',
    descriptionUa: 'Альтернатива useState для складного стану',
    difficulty: 'MEDIUM' as const,
    order: 15,
    contentMarkdownEn: `Hook for managing state via reducer function. Like Redux pattern. Good for complex state logic, multiple sub-values. (state, action) => newState. dispatch() triggers updates. More predictable than useState for complex cases.`,
    contentMarkdownUa: `Хук для керування станом через функцію reducer. Як шаблон Redux. Добрий для складної логіки стану, множинних під-значень. (state, action) => newState. dispatch() викликає оновлення. Більш передбачуваний ніж useState для складних випадків.`,
  },
  {
    slug: 'react-lazy-suspense',
    titleEn: 'React.lazy and Suspense',
    titleUa: 'React.lazy та Suspense',
    descriptionEn: 'Code splitting and lazy loading',
    descriptionUa: 'Code splitting та lazy loading',
    difficulty: 'MEDIUM' as const,
    order: 16,
    contentMarkdownEn: `React.lazy: dynamic component import. Suspense: fallback UI while loading. Code splitting. Improves first load time. Works with React Router. const Comp = lazy(() => import('./Comp')).`,
    contentMarkdownUa: `React.lazy: динамічний імпорт компонента. Suspense: fallback UI під час завантаження. Code splitting. Покращує час першого завантаження. Працює з React Router. const Comp = lazy(() => import('./Comp')).`,
  },
  {
    slug: 'context-use-context',
    titleEn: 'Context and useContext',
    titleUa: 'Context та useContext',
    descriptionEn: 'Global state without prop drilling',
    descriptionUa: 'Глобальний стан без prop drilling',
    difficulty: 'MEDIUM' as const,
    order: 17,
    contentMarkdownEn: `Pass data through component tree without props. createContext(), Provider, useContext(). Good for theme, auth, language. Avoid for frequently changing values. All consumers re-render when value changes.`,
    contentMarkdownUa: `Передача даних через дерево компонентів без пропів. createContext(), Provider, useContext(). Добре для теми, аутентифікації, мови. Уникайте для часто змінюваних значень. Всі споживачі ре-рендеряться коли значення змінюється.`,
  },
  {
    slug: 'hooks-rules',
    titleEn: 'Rules of Hooks',
    titleUa: 'Правила Хуків',
    descriptionEn: 'How to correctly use hooks',
    descriptionUa: 'Як правильно використовувати хуки',
    difficulty: 'MEDIUM' as const,
    order: 18,
    contentMarkdownEn: `1. Only call at top level (not in conditions, loops, nested functions). 2. Only call in functional components or custom hooks. React relies on call order. eslint-plugin-react-hooks helps catch violations.`,
    contentMarkdownUa: `1. Викликайте тільки на верхньому рівні (не в умовах, циклах, вкладених функціях). 2. Викликайте тільки у функціональних компонентах або кастомних хуках. React покладається на порядок викликів. eslint-plugin-react-hooks допомагає виявити порушення.`,
  },
  {
    slug: 'custom-hooks',
    titleEn: 'Custom Hooks',
    titleUa: 'Кастомні Хуки',
    descriptionEn: 'Reusable stateful logic',
    descriptionUa: 'Повторно використовувана логіка зі станом',
    difficulty: 'MEDIUM' as const,
    order: 19,
    contentMarkdownEn: `User-defined functions using built-in hooks. Name must start with "use". Encapsulate and reuse logic. useFetch, useLocalStorage, useDebounce, useWindowSize. Avoid code duplication.`,
    contentMarkdownUa: `Визначені користувачем функції що використовують вбудовані хуки. Імя повинно починатися з "use". Інкапсулюють та повторно використовують логіку. useFetch, useLocalStorage, useDebounce, useWindowSize. Уникають дублювання коду.`,
  },
  {
    slug: 'controlled-uncontrolled',
    titleEn: 'Controlled vs Uncontrolled',
    titleUa: 'Контрольовані проти Неконтрольованих',
    descriptionEn: 'Form input patterns',
    descriptionUa: 'Шаблони форм вводу',
    difficulty: 'MEDIUM' as const,
    order: 20,
    contentMarkdownEn: `Controlled: value in state, onChange updates. React single source of truth. Uncontrolled: value in DOM, access via ref. Good for simple forms. Controlled better for validation, complex forms.`,
    contentMarkdownUa: `Контрольовані: значення в стані, onChange оновлює. React єдине джерело правди. Неконтрольовані: значення в DOM, доступ через ref. Добре для простих форм. Контрольовані краще для валідації, складних форм.`,
  },
  {
    slug: 'rendering-order',
    titleEn: 'Rendering Order',
    titleUa: 'Порядок Рендерингу',
    descriptionEn: 'Component and hook execution order',
    descriptionUa: 'Порядок виконання компонентів та хуків',
    difficulty: 'HARD' as const,
    order: 21,
    contentMarkdownEn: `Parent renders first, then children recursively. Hooks called in declaration order. Order: Component call → Hook calls → JSX → Diffing → DOM update → useLayoutEffect → Browser paint → useEffect. Hook order must be consistent.`,
    contentMarkdownUa: `Батько рендериться спочатку, потім діти рекурсивно. Хуки викликаються в порядку оголошення. Порядок: Виклик компонента → Виклики хуків → JSX → Diffing → Оновлення DOM → useLayoutEffect → Browser paint → useEffect. Порядок хуків повинен бути постійним.`,
  },
  {
    slug: 'rerender-reasons',
    titleEn: 'Re-render Reasons',
    titleUa: 'Причини Ре-рендеру',
    descriptionEn: 'What triggers component re-renders',
    descriptionUa: 'Що викликає ре-рендери компонента',
    difficulty: 'MEDIUM' as const,
    order: 22,
    contentMarkdownEn: `1. State change (setState). 2. Props change. 3. Parent re-rendered. 4. Context value change. 5. Forced update. Optimize with React.memo, useMemo, useCallback, useRef. Avoid new references on every render.`,
    contentMarkdownUa: `1. Зміна стану (setState). 2. Зміна пропів. 3. Батько ре-рендерився. 4. Зміна значення контексту. 5. Примусове оновлення. Оптимізуйте з React.memo, useMemo, useCallback, useRef. Уникайте нових посилань на кожному рендері.`,
  },
  {
    slug: 'virtualization',
    titleEn: 'Virtualization',
    titleUa: 'Віртуалізація',
    descriptionEn: 'Render only visible elements',
    descriptionUa: 'Рендер тільки видимих елементів',
    difficulty: 'HARD' as const,
    order: 23,
    contentMarkdownEn: `Technique for large lists: render only visible part. Invisible elements not created or reused. react-window, react-virtualized libraries. Huge performance improvement for 1000+ items. Dynamic loading during scroll.`,
    contentMarkdownUa: `Техніка для великих списків: рендерити тільки видиму частину. Невидимі елементи не створюються або повторно використовуються. Бібліотеки react-window, react-virtualized. Величезне покращення продуктивності для 1000+ елементів. Динамічне завантаження під час скролу.`,
  },
  {
    slug: 'hoc',
    titleEn: 'Higher-Order Component',
    titleUa: 'Компонент Вищого Порядку',
    descriptionEn: 'Function that enhances components',
    descriptionUa: 'Функція що покращує компоненти',
    difficulty: 'HARD' as const,
    order: 24,
    contentMarkdownEn: `Function taking component, returning enhanced component. Code reuse pattern. withAuth, withLogging, withLayout. Doesn't modify original. Pass props with spread. Redux connect() is HOC. Less common with hooks.`,
    contentMarkdownUa: `Функція що приймає компонент, повертає покращений компонент. Шаблон повторного використання коду. withAuth, withLogging, withLayout. Не модифікує оригінал. Передає пропи зі spread. Redux connect() є HOC. Менш поширений з хуками.`,
  },
  {
    slug: 'pure-component',
    titleEn: 'PureComponent',
    titleUa: 'PureComponent',
    descriptionEn: 'Shallow prop/state comparison',
    descriptionUa: 'Поверхневе порівняння prop/state',
    difficulty: 'MEDIUM' as const,
    order: 25,
    contentMarkdownEn: `Class component with built-in shouldComponentUpdate. Shallow comparison of props and state. Skips re-render if unchanged. For functional components use React.memo. Requires immutability for correct work.`,
    contentMarkdownUa: `Класовий компонент з вбудованим shouldComponentUpdate. Поверхневе порівняння пропів та стану. Пропускає ре-рендер якщо не змінилося. Для функціональних компонентів використовуйте React.memo. Потребує незмінності для правильної роботи.`,
  },
  {
    slug: 'portal',
    titleEn: 'Portal',
    titleUa: 'Portal',
    descriptionEn: 'Render outside parent DOM',
    descriptionUa: 'Рендер поза батьківським DOM',
    difficulty: 'MEDIUM' as const,
    order: 26,
    contentMarkdownEn: `Renders component outside main DOM tree. ReactDOM.createPortal(children, container). Use for modals, tooltips, dropdowns. Escapes parent CSS (overflow, z-index). React hierarchy maintained.`,
    contentMarkdownUa: `Рендерить компонент поза головним деревом DOM. ReactDOM.createPortal(children, container). Використовуйте для модалів, підказок, dropdown. Уникає батьківського CSS (overflow, z-index). Ієрархія React зберігається.`,
  },
  {
    slug: 'fragment',
    titleEn: 'Fragment',
    titleUa: 'Fragment',
    descriptionEn: 'Group elements without wrapper',
    descriptionUa: 'Групування елементів без обгортки',
    difficulty: 'EASY' as const,
    order: 27,
    contentMarkdownEn: `Group multiple elements without adding DOM node. <Fragment> or <>. Doesn't render to HTML. Cleaner DOM. Avoids unnecessary wrapper divs. Can pass key to Fragment (not to <>).`,
    contentMarkdownUa: `Групувати множинні елементи без додавання DOM ноди. <Fragment> або <>. Не рендериться в HTML. Чистіший DOM. Уникає непотрібних div обгорток. Можна передати key до Fragment (не до <>).`,
  },
  {
    slug: 'children-prop',
    titleEn: 'children Prop',
    titleUa: 'Проп children',
    descriptionEn: 'Content between component tags',
    descriptionUa: 'Контент між тегами компонента',
    difficulty: 'EASY' as const,
    order: 28,
    contentMarkdownEn: `Special prop containing everything inside JSX tag. Enables component composition. Wrapper patterns: Card, Layout, Modal. Can be string, element, array, function (render props).`,
    contentMarkdownUa: `Спеціальний проп що містить все всередині JSX тега. Дозволяє композицію компонентів. Шаблони обгорток: Card, Layout, Modal. Може бути рядок, елемент, масив, функція (render props).`,
  },
  {
    slug: 'functional-vs-class',
    titleEn: 'Functional vs Class Components',
    titleUa: 'Функціональні проти Класових',
    descriptionEn: 'Component type differences',
    descriptionUa: 'Різниця типів компонентів',
    difficulty: 'MEDIUM' as const,
    order: 29,
    contentMarkdownEn: `Functional: simpler syntax, hooks support, no this. Class: lifecycle methods, this.state, legacy. Modern projects use functional only. Functional are shorter, easier to test, better performance.`,
    contentMarkdownUa: `Функціональні: простіший синтаксис, підтримка хуків, немає this. Класові: lifecycle методи, this.state, legacy. Сучасні проекти використовують тільки функціональні. Функціональні коротші, легше тестувати, краща продуктивність.`,
  },
  {
    slug: 'lifecycle-methods',
    titleEn: 'Lifecycle Methods',
    titleUa: 'Lifecycle Методи',
    descriptionEn: 'Class component lifecycle',
    descriptionUa: 'Lifecycle класових компонентів',
    difficulty: 'HARD' as const,
    order: 30,
    contentMarkdownEn: `3 phases: Mounting, Updating, Unmounting. componentDidMount, componentDidUpdate, componentWillUnmount. In functional: useEffect replicates all. Deprecated: componentWillMount, componentWillReceiveProps.`,
    contentMarkdownUa: `3 фази: Mounting, Updating, Unmounting. componentDidMount, componentDidUpdate, componentWillUnmount. У функціональних: useEffect реплікує все. Застарілі: componentWillMount, componentWillReceiveProps.`,
  },
  {
    slug: 'prop-drilling',
    titleEn: 'Prop Drilling',
    titleUa: 'Prop Drilling',
    descriptionEn: 'Passing props through many levels',
    descriptionUa: 'Передача пропів через багато рівнів',
    difficulty: 'MEDIUM' as const,
    order: 31,
    contentMarkdownEn: `Passing data through multiple component levels. Intermediate components don't use data. Problem: pollution, complexity. Solutions: Context API, global state (Zustand, Redux), composition.`,
    contentMarkdownUa: `Передача даних через множинні рівні компонентів. Проміжні компоненти не використовують дані. Проблема: забруднення, складність. Рішення: Context API, глобальний стан (Zustand, Redux), композиція.`,
  },
  {
    slug: 'error-boundaries',
    titleEn: 'Error Boundaries',
    titleUa: 'Error Boundaries (Межі Помилок)',
    descriptionEn: 'Catch JavaScript errors in component tree',
    descriptionUa: 'Ловити JavaScript помилки в дереві компонентів',
    difficulty: 'HARD' as const,
    order: 32,
    contentMarkdownEn: `Class components catching errors in child tree. getDerivedStateFromError, componentDidCatch. Show fallback UI. Don't catch: event handlers, async, SSR. Use react-error-boundary library for hooks. Multiple boundaries recommended.`,
    contentMarkdownUa: `Класові компоненти що ловлять помилки в дочірньому дереві. getDerivedStateFromError, componentDidCatch. Показують fallback UI. Не ловлять: обробники подій, async, SSR. Використовуйте бібліотеку react-error-boundary для хуків. Рекомендовані множинні boundaries.`,
  },
  {
    slug: 'reconciliation',
    titleEn: 'Reconciliation',
    titleUa: 'Reconciliation (Узгодження)',
    descriptionEn: 'Tree comparison algorithm',
    descriptionUa: 'Алгоритм порівняння дерев',
    difficulty: 'HARD' as const,
    order: 33,
    contentMarkdownEn: `Algorithm comparing two element trees. O(n) heuristic. Different types = rebuild. Same types = update attributes. Keys identify list elements. Diffing finds minimal changes. Optimized with shouldComponentUpdate, memo.`,
    contentMarkdownUa: `Алгоритм порівняння двох дерев елементів. O(n) евристика. Різні типи = перебудова. Ті самі типи = оновлення атрибутів. Ключі ідентифікують елементи списку. Diffing знаходить мінімальні зміни. Оптимізовано з shouldComponentUpdate, memo.`,
  },
  {
    slug: 'synthetic-events',
    titleEn: 'Synthetic Events',
    titleUa: 'Синтетичні Події',
    descriptionEn: 'React event wrapper system',
    descriptionUa: 'Система обгортки подій React',
    difficulty: 'MEDIUM' as const,
    order: 34,
    contentMarkdownEn: `React wrapper around native browser events. Cross-browser compatibility. Event delegation for performance. camelCase naming. No pooling since React 17. Access native via event.nativeEvent.`,
    contentMarkdownUa: `React обгортка навколо нативних браузерних подій. Кросс-браузерна сумісність. Делегування подій для продуктивності. camelCase імена. Немає pooling з React 17. Доступ до нативного через event.nativeEvent.`,
  },
  {
    slug: 'strict-mode',
    titleEn: 'StrictMode',
    titleUa: 'StrictMode',
    descriptionEn: 'Development tool for identifying problems',
    descriptionUa: 'Інструмент розробки для виявлення проблем',
    difficulty: 'MEDIUM' as const,
    order: 35,
    contentMarkdownEn: `Development-only tool. Intentionally double-invokes functions to detect side effects. Warns about deprecated API, unsafe lifecycle. React 18: simulates unmount/remount. No production impact. Use from project start.`,
    contentMarkdownUa: `Інструмент тільки для розробки. Навмисно подвійно викликає функції для виявлення побічних ефектів. Попереджає про застарілий API, небезпечний lifecycle. React 18: симулює unmount/remount. Немає впливу на production. Використовуйте з початку проекту.`,
  },
  {
    slug: 'refs-guide',
    titleEn: 'Refs Guide',
    titleUa: 'Гід по Refs',
    descriptionEn: 'useRef, createRef, forwardRef',
    descriptionUa: 'useRef, createRef, forwardRef',
    difficulty: 'HARD' as const,
    order: 36,
    contentMarkdownEn: `useRef: functional components. createRef: class components. forwardRef: pass ref through component. useImperativeHandle: control ref exposure. Don't trigger re-render. Use for DOM access, not state that affects rendering.`,
    contentMarkdownUa: `useRef: функціональні компоненти. createRef: класові компоненти. forwardRef: передати ref через компонент. useImperativeHandle: контролювати експозицію ref. Не викликають ре-рендер. Використовуйте для доступу до DOM, не для стану що впливає на рендеринг.`,
  },
]

async function addReactQuestions() {
  try {
    console.log('🚀 React Mega-Batch: Adding All 36 Questions\n')
    const [category] = await db.select({
      id: schema.categories.id,
      nameEn: schema.categories.nameEn
    }).from(schema.categories).where(eq(schema.categories.slug, 'react')).limit(1)
    
    if (!category) throw new Error('React category not found')
    console.log(`✓ Category: ${category.nameEn}\n`)
    
    let added = 0, updated = 0
    
    for (const q of questions) {
      const [existing] = await db.select({
        id: schema.questions.id,
        slug: schema.questions.slug
      }).from(schema.questions).where(eq(schema.questions.slug, q.slug)).limit(1)
      
      const dataToSave = {
        slug: q.slug,
        titleEn: q.titleEn,
        titleUa: q.titleUa,
        descriptionEn: q.descriptionEn,
        descriptionUa: q.descriptionUa,
        contentMarkdownEn: q.contentMarkdownEn,
        contentMarkdownUa: q.contentMarkdownUa,
        difficulty: q.difficulty,
        order: q.order,
        categoryId: category.id,
      }
      
      if (existing) {
        await db.update(schema.questions)
          .set({...dataToSave, updatedAt: new Date()})
          .where(eq(schema.questions.id, existing.id))
        updated++
      } else {
        await db.insert(schema.questions).values(dataToSave)
        added++
      }
      
      if ((added + updated) % 10 === 0) {
        console.log(`✅ Progress: ${added + updated}/36`)
      }
    }
    
    console.log(`\n📊 React Section Complete!`)
    console.log(`   Added: ${added}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Total: ${added + updated}/36\n`)
  } finally {
    await client.end()
  }
}

addReactQuestions().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
