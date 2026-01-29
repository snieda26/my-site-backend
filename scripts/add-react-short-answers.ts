/**
 * React short answers
 * Usage: npx tsx scripts/add-react-short-answers.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'

const postgres = require('postgres')
dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')
connectionString = connectionString.split('?')[0]

const client = postgres(connectionString)
const db = drizzle(client, { schema })

const shortAnswers: Record<string, { en: string; ua: string }> = {
  'what-is-react-and-why-is-it-needed': {
    en: `**React** is a JavaScript library for building user interfaces using component-based architecture.

**Key features:**
- Virtual DOM for efficient updates
- Component reusability
- Unidirectional data flow
- Large ecosystem (Redux, React Router, etc.)

\`\`\`jsx
function App() {
  return <h1>Hello, React!</h1>;
}
\`\`\``,
    ua: `**React** — це JavaScript бібліотека для побудови UI з компонентною архітектурою.

**Ключові особливості:**
- Virtual DOM для ефективних оновлень
- Повторне використання компонентів
- Однонаправлений потік даних
- Велика екосистема (Redux, React Router тощо)

\`\`\`jsx
function App() {
  return <h1>Hello, React!</h1>;
}
\`\`\``,
  },
  'what-is-jsx-in-react': {
    en: `**JSX** (JavaScript XML) — syntax extension that lets you write HTML-like code in JavaScript.

\`\`\`jsx
const element = <h1 className="title">Hello, {name}!</h1>;

// Compiles to:
const element = React.createElement('h1', { className: 'title' }, 'Hello, ', name, '!');
\`\`\`

JSX is not required but makes React code more readable.`,
    ua: `**JSX** (JavaScript XML) — розширення синтаксису для написання HTML-подібного коду в JavaScript.

\`\`\`jsx
const element = <h1 className="title">Hello, {name}!</h1>;

// Компілюється в:
const element = React.createElement('h1', { className: 'title' }, 'Hello, ', name, '!');
\`\`\`

JSX не обовʼязковий, але робить код React читабельнішим.`,
  },
  'virtual-dom-in-react': {
    en: `**Virtual DOM** is a lightweight copy of the real DOM kept in memory.

**How it works:**
1. State changes trigger re-render
2. React creates new Virtual DOM
3. **Diffing** compares old and new Virtual DOM
4. Only changed parts update in real DOM

This minimizes expensive DOM operations and improves performance.`,
    ua: `**Virtual DOM** — це легка копія реального DOM у памʼяті.

**Як працює:**
1. Зміна стану викликає ре-рендер
2. React створює новий Virtual DOM
3. **Diffing** порівнює старий і новий Virtual DOM
4. Лише змінені частини оновлюються в реальному DOM

Це мінімізує дорогі DOM-операції та покращує продуктивність.`,
  },
  'component-lifecycle-methods-in-react': {
    en: `**Class component lifecycle:**

**Mounting:** \`constructor\` → \`render\` → \`componentDidMount\`
**Updating:** \`render\` → \`componentDidUpdate\`
**Unmounting:** \`componentWillUnmount\`

**Functional equivalent with hooks:**
\`\`\`jsx
useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => { /* componentWillUnmount */ };
}, [deps]);
\`\`\``,
    ua: `**Життєвий цикл класового компонента:**

**Монтування:** \`constructor\` → \`render\` → \`componentDidMount\`
**Оновлення:** \`render\` → \`componentDidUpdate\`
**Розмонтування:** \`componentWillUnmount\`

**Функціональний еквівалент з хуками:**
\`\`\`jsx
useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => { /* componentWillUnmount */ };
}, [deps]);
\`\`\``,
  },
  'how-usestate-works-in-react': {
    en: `\`useState\` adds state to functional components.

\`\`\`jsx
const [count, setCount] = useState(0);

// Update with new value
setCount(5);

// Update based on previous state
setCount(prev => prev + 1);
\`\`\`

**Important:** State updates are asynchronous and batched. Never mutate state directly.`,
    ua: `\`useState\` додає стан до функціональних компонентів.

\`\`\`jsx
const [count, setCount] = useState(0);

// Оновлення новим значенням
setCount(5);

// Оновлення на основі попереднього стану
setCount(prev => prev + 1);
\`\`\`

**Важливо:** Оновлення стану асинхронні та групуються. Ніколи не мутуйте стан напряму.`,
  },
  'how-useeffect-works-in-react': {
    en: `\`useEffect\` handles side effects (data fetching, subscriptions, DOM manipulation).

\`\`\`jsx
useEffect(() => {
  // Runs after render
  fetchData();
  
  return () => {
    // Cleanup (runs before next effect or unmount)
  };
}, [dependency]); // Only re-run when dependency changes
\`\`\`

Empty \`[]\` = run once on mount. No deps = run on every render.`,
    ua: `\`useEffect\` обробляє побічні ефекти (завантаження даних, підписки, маніпуляції DOM).

\`\`\`jsx
useEffect(() => {
  // Виконується після рендеру
  fetchData();
  
  return () => {
    // Очищення (перед наступним ефектом або unmount)
  };
}, [dependency]); // Перезапуск лише при зміні залежності
\`\`\`

Порожній \`[]\` = один раз при монтуванні. Без deps = при кожному рендері.`,
  },
  'how-useref-works-in-react': {
    en: `\`useRef\` creates a mutable reference that persists across renders without causing re-renders.

\`\`\`jsx
const inputRef = useRef(null);
const countRef = useRef(0);

// Access DOM element
inputRef.current.focus();

// Store mutable value (doesn't trigger re-render)
countRef.current++;
\`\`\`

Common uses: DOM access, storing previous values, timers.`,
    ua: `\`useRef\` створює мутабельне посилання, що зберігається між рендерами без виклику ре-рендерів.

\`\`\`jsx
const inputRef = useRef(null);
const countRef = useRef(0);

// Доступ до DOM-елемента
inputRef.current.focus();

// Зберігання мутабельного значення (не викликає ре-рендер)
countRef.current++;
\`\`\`

Використання: доступ до DOM, зберігання попередніх значень, таймери.`,
  },
  'how-usecallback-works-and-why-is-it-needed': {
    en: `\`useCallback\` memoizes a function to prevent recreation on every render.

\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]); // Only recreated when 'id' changes
\`\`\`

**When to use:** Passing callbacks to memoized children (\`React.memo\`) or when function is a dependency of other hooks.`,
    ua: `\`useCallback\` мемоізує функцію для запобігання перестворення при кожному рендері.

\`\`\`jsx
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]); // Перестворюється лише при зміні 'id'
\`\`\`

**Коли використовувати:** Передача колбеків мемоізованим дочірнім (\`React.memo\`) або коли функція є залежністю інших хуків.`,
  },
  'how-usememo-works-and-why-is-it-needed': {
    en: `\`useMemo\` memoizes a computed value to avoid expensive recalculations.

\`\`\`jsx
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // Only recalculate when 'items' changes
\`\`\`

**When to use:** Expensive computations, referential equality for objects passed to children.`,
    ua: `\`useMemo\` мемоізує обчислене значення для уникнення дорогих перерахунків.

\`\`\`jsx
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // Перерахунок лише при зміні 'items'
\`\`\`

**Коли використовувати:** Дорогі обчислення, референційна рівність для обʼєктів, що передаються дочірнім.`,
  },
  'what-is-context-and-usecontext-hook-in-react': {
    en: `**Context** provides a way to pass data through the component tree without prop drilling.

\`\`\`jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = useContext(ThemeContext); // 'dark'
}
\`\`\``,
    ua: `**Context** дозволяє передавати дані через дерево компонентів без prop drilling.

\`\`\`jsx
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = useContext(ThemeContext); // 'dark'
}
\`\`\``,
  },
  'what-is-usereducer-in-react': {
    en: `\`useReducer\` manages complex state logic with a reducer function (like Redux).

\`\`\`jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
\`\`\``,
    ua: `\`useReducer\` керує складною логікою стану через функцію-редюсер (як Redux).

\`\`\`jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });
\`\`\``,
  },
  'what-are-custom-hooks-in-react': {
    en: `**Custom hooks** extract reusable stateful logic into separate functions.

\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  
  return size;
}
\`\`\`

Must start with "use" prefix.`,
    ua: `**Custom hooks** виділяють багаторазову логіку стану в окремі функції.

\`\`\`jsx
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  
  return size;
}
\`\`\`

Повинні починатися з префікса "use".`,
  },
  'what-is-reactmemo-and-why-is-it-needed': {
    en: `\`React.memo\` is a HOC that memoizes a component, preventing re-renders if props haven't changed.

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});

// Custom comparison
React.memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
\`\`\``,
    ua: `\`React.memo\` — це HOC, що мемоізує компонент, запобігаючи ре-рендерам якщо props не змінились.

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* дороге рендеринг */}</div>;
});

// Власне порівняння
React.memo(Component, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id;
});
\`\`\``,
  },
  'controlled-and-uncontrolled-components-in-react': {
    en: `**Controlled:** Form data handled by React state
\`\`\`jsx
<input value={value} onChange={e => setValue(e.target.value)} />
\`\`\`

**Uncontrolled:** Form data handled by DOM (using refs)
\`\`\`jsx
<input ref={inputRef} defaultValue="initial" />
// Access: inputRef.current.value
\`\`\`

Controlled is recommended for most cases.`,
    ua: `**Контрольовані:** Дані форми керуються станом React
\`\`\`jsx
<input value={value} onChange={e => setValue(e.target.value)} />
\`\`\`

**Неконтрольовані:** Дані форми керуються DOM (через refs)
\`\`\`jsx
<input ref={inputRef} defaultValue="initial" />
// Доступ: inputRef.current.value
\`\`\`

Контрольовані рекомендовані для більшості випадків.`,
  },
  'why-is-key-needed-in-react': {
    en: `\`key\` helps React identify which items changed, added, or removed in lists.

\`\`\`jsx
// ✅ Good: unique stable ID
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ Bad: index as key (causes issues with reordering)
{items.map((item, index) => <Item key={index} {...item} />)}
\`\`\`

Keys should be stable, unique, and predictable.`,
    ua: `\`key\` допомагає React ідентифікувати які елементи змінились, додались або видалились у списках.

\`\`\`jsx
// ✅ Добре: унікальний стабільний ID
{items.map(item => <Item key={item.id} {...item} />)}

// ❌ Погано: індекс як key (проблеми з переупорядкуванням)
{items.map((item, index) => <Item key={index} {...item} />)}
\`\`\`

Keys повинні бути стабільними, унікальними та передбачуваними.`,
  },
  'what-is-children-in-react': {
    en: `\`children\` is a special prop containing content between component's opening and closing tags.

\`\`\`jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

<Card title="Hello">
  <p>This is children content</p>
</Card>
\`\`\``,
    ua: `\`children\` — спеціальний prop, що містить вміст між відкриваючим і закриваючим тегами компонента.

\`\`\`jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

<Card title="Hello">
  <p>Це children контент</p>
</Card>
\`\`\``,
  },
  'what-is-fragment-in-react': {
    en: `**Fragment** lets you group elements without adding extra DOM nodes.

\`\`\`jsx
// Long syntax
<React.Fragment>
  <h1>Title</h1>
  <p>Content</p>
</React.Fragment>

// Short syntax
<>
  <h1>Title</h1>
  <p>Content</p>
</>
\`\`\`

Useful when you need to return multiple elements but can't add a wrapper div.`,
    ua: `**Fragment** дозволяє групувати елементи без додавання зайвих DOM-вузлів.

\`\`\`jsx
// Повний синтаксис
<React.Fragment>
  <h1>Title</h1>
  <p>Content</p>
</React.Fragment>

// Короткий синтаксис
<>
  <h1>Title</h1>
  <p>Content</p>
</>
\`\`\`

Корисно коли потрібно повернути кілька елементів без обгортки div.`,
  },
  'what-is-portal-in-react': {
    en: `**Portal** renders children into a DOM node outside the parent hierarchy.

\`\`\`jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}
\`\`\`

Use cases: modals, tooltips, dropdowns that need to escape overflow or z-index.`,
    ua: `**Portal** рендерить дочірні елементи в DOM-вузол поза батьківською ієрархією.

\`\`\`jsx
import { createPortal } from 'react-dom';

function Modal({ children }) {
  return createPortal(
    <div className="modal">{children}</div>,
    document.getElementById('modal-root')
  );
}
\`\`\`

Використання: модалки, тултіпи, випадаючі меню що потребують вийти за overflow або z-index.`,
  },
  'what-is-prop-drilling-and-how-to-avoid-it': {
    en: `**Prop drilling** — passing props through many intermediate components that don't use them.

**Solutions:**
- **Context API** — for global/shared state
- **State management** (Redux, Zustand) — for complex apps
- **Component composition** — render props, children

\`\`\`jsx
// Instead of A -> B -> C -> D (drilling)
// Use Context or composition
\`\`\``,
    ua: `**Prop drilling** — передача props через багато проміжних компонентів, що їх не використовують.

**Рішення:**
- **Context API** — для глобального/спільного стану
- **State management** (Redux, Zustand) — для складних застосунків
- **Композиція компонентів** — render props, children

\`\`\`jsx
// Замість A -> B -> C -> D (drilling)
// Використовуйте Context або композицію
\`\`\``,
  },
  'error-boundaries-in-react': {
    en: `**Error Boundaries** catch JavaScript errors in child components and display fallback UI.

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}
\`\`\`

Only class components can be error boundaries.`,
    ua: `**Error Boundaries** ловлять JavaScript помилки в дочірніх компонентах і показують запасний UI.

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) return <h1>Щось пішло не так.</h1>;
    return this.props.children;
  }
}
\`\`\`

Лише класові компоненти можуть бути error boundaries.`,
  },
  'difference-between-functional-and-class-components-in-react': {
    en: `| | Functional | Class |
|---|---|---|
| Syntax | Function | ES6 Class |
| State | \`useState\` hook | \`this.state\` |
| Lifecycle | \`useEffect\` | Lifecycle methods |
| \`this\` | No \`this\` | Requires \`this\` |

Functional components with hooks are now the standard. Class components are legacy.`,
    ua: `| | Функціональні | Класові |
|---|---|---|
| Синтаксис | Функція | ES6 Клас |
| Стан | \`useState\` hook | \`this.state\` |
| Життєвий цикл | \`useEffect\` | Методи lifecycle |
| \`this\` | Без \`this\` | Потребує \`this\` |

Функціональні компоненти з хуками зараз стандарт. Класові — застарілі.`,
  },
  'reconciliation-in-react': {
    en: `**Reconciliation** is React's algorithm for diffing Virtual DOM trees to determine minimal updates.

**Key rules:**
- Different element types → rebuild subtree
- Same type → update attributes, recurse children
- \`key\` prop helps identify list items

This is why keys are important for list performance.`,
    ua: `**Reconciliation** — алгоритм React для порівняння дерев Virtual DOM для визначення мінімальних оновлень.

**Ключові правила:**
- Різні типи елементів → перебудувати піддерево
- Однаковий тип → оновити атрибути, рекурсія дочірніх
- \`key\` prop допомагає ідентифікувати елементи списку

Тому keys важливі для продуктивності списків.`,
  },
  'reasons-for-component-re-rendering-in-react': {
    en: `**Components re-render when:**
1. State changes (\`setState\`/\`useState\`)
2. Props change
3. Parent re-renders
4. Context value changes

**Prevent unnecessary re-renders:**
- \`React.memo\` for components
- \`useMemo\`/\`useCallback\` for values/functions
- Proper state structure`,
    ua: `**Компоненти ре-рендеряться коли:**
1. Змінюється стан (\`setState\`/\`useState\`)
2. Змінюються props
3. Ре-рендериться батько
4. Змінюється значення Context

**Запобігти зайвим ре-рендерам:**
- \`React.memo\` для компонентів
- \`useMemo\`/\`useCallback\` для значень/функцій
- Правильна структура стану`,
  },
  'rules-for-using-hooks-in-react': {
    en: `**Rules of Hooks:**

1. **Only call at top level** — not in loops, conditions, or nested functions
2. **Only call from React functions** — components or custom hooks

\`\`\`jsx
// ❌ Wrong
if (condition) { useState(0); }

// ✅ Correct
const [value, setValue] = useState(0);
if (condition) { /* use value */ }
\`\`\``,
    ua: `**Правила хуків:**

1. **Викликайте лише на верхньому рівні** — не в циклах, умовах чи вкладених функціях
2. **Викликайте лише з React функцій** — компонентів або custom hooks

\`\`\`jsx
// ❌ Неправильно
if (condition) { useState(0); }

// ✅ Правильно
const [value, setValue] = useState(0);
if (condition) { /* використовуйте value */ }
\`\`\``,
  },
  'what-is-hoc-higher-order-component-in-react': {
    en: `**HOC** is a function that takes a component and returns an enhanced component.

\`\`\`jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const isAuth = useAuth();
    if (!isAuth) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}

const ProtectedPage = withAuth(Dashboard);
\`\`\`

Modern alternative: Custom hooks or render props.`,
    ua: `**HOC** — функція, що приймає компонент і повертає розширений компонент.

\`\`\`jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const isAuth = useAuth();
    if (!isAuth) return <Redirect to="/login" />;
    return <Component {...props} />;
  };
}

const ProtectedPage = withAuth(Dashboard);
\`\`\`

Сучасна альтернатива: Custom hooks або render props.`,
  },
  'react-fiber-and-virtual-dom-update-process': {
    en: `**React Fiber** is the reconciliation engine (React 16+) that enables:
- **Incremental rendering** — split work into chunks
- **Pause/resume** work
- **Priority-based updates** — urgent vs non-urgent

**Fiber** represents a unit of work (component instance) with info about component, state, and DOM relationships.`,
    ua: `**React Fiber** — движок reconciliation (React 16+), що дозволяє:
- **Інкрементальний рендеринг** — поділ роботи на частини
- **Призупинення/відновлення** роботи
- **Оновлення за пріоритетом** — термінові vs нетермінові

**Fiber** представляє одиницю роботи (екземпляр компонента) з інформацією про компонент, стан та звʼязки з DOM.`,
  },
  'what-is-batching-in-react': {
    en: `**Batching** groups multiple state updates into a single re-render for performance.

\`\`\`jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React batches these → single re-render
}
\`\`\`

React 18+ automatically batches in async code too (promises, timeouts).`,
    ua: `**Batching** групує кілька оновлень стану в один ре-рендер для продуктивності.

\`\`\`jsx
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React групує їх → один ре-рендер
}
\`\`\`

React 18+ автоматично групує і в async-коді (проміси, таймаути).`,
  },
  'synthetic-events-in-react': {
    en: `**Synthetic Events** are React's cross-browser wrapper around native events.

\`\`\`jsx
function handleClick(e) {
  e.preventDefault(); // Works consistently across browsers
  console.log(e.target);
}

<button onClick={handleClick}>Click</button>
\`\`\`

Benefits: Consistent API, automatic cleanup, event pooling (pre-React 17).`,
    ua: `**Synthetic Events** — крос-браузерна обгортка React над нативними подіями.

\`\`\`jsx
function handleClick(e) {
  e.preventDefault(); // Працює однаково в усіх браузерах
  console.log(e.target);
}

<button onClick={handleClick}>Click</button>
\`\`\`

Переваги: Консистентний API, автоматичне очищення, пулінг подій (до React 17).`,
  },
  'refs-in-react-useref-createref-forwardref': {
    en: `- **useRef** — hook for functional components
- **createRef** — for class components (new ref each render)
- **forwardRef** — pass ref to child components

\`\`\`jsx
const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

function Parent() {
  const inputRef = useRef();
  return <Input ref={inputRef} />;
}
\`\`\``,
    ua: `- **useRef** — хук для функціональних компонентів
- **createRef** — для класових компонентів (новий ref кожен рендер)
- **forwardRef** — передача ref дочірнім компонентам

\`\`\`jsx
const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

function Parent() {
  const inputRef = useRef();
  return <Input ref={inputRef} />;
}
\`\`\``,
  },
  'reactlazy-and-suspense-lazy-components-in-react': {
    en: `**React.lazy** enables code-splitting by loading components dynamically.

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

**Suspense** shows fallback while lazy component loads.`,
    ua: `**React.lazy** дозволяє code-splitting через динамічне завантаження компонентів.

\`\`\`jsx
const LazyComponent = React.lazy(() => import('./Component'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

**Suspense** показує fallback поки lazy-компонент завантажується.`,
  },
  'reactstrictmode': {
    en: `**StrictMode** is a development tool that highlights potential problems.

\`\`\`jsx
<React.StrictMode>
  <App />
</React.StrictMode>
\`\`\`

**It helps detect:**
- Unsafe lifecycle methods
- Deprecated APIs
- Unexpected side effects (double-invokes in dev)

No impact on production build.`,
    ua: `**StrictMode** — інструмент розробки, що виявляє потенційні проблеми.

\`\`\`jsx
<React.StrictMode>
  <App />
</React.StrictMode>
\`\`\`

**Допомагає виявити:**
- Небезпечні методи життєвого циклу
- Застарілі API
- Неочікувані побічні ефекти (подвійні виклики в dev)

Не впливає на production build.`,
  },
  'what-is-reactpurecomponent': {
    en: `**PureComponent** is a class component that implements \`shouldComponentUpdate\` with shallow prop/state comparison.

\`\`\`jsx
class MyComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}
\`\`\`

Functional equivalent: \`React.memo\`

**Note:** Only does shallow comparison — nested objects won't be compared deeply.`,
    ua: `**PureComponent** — класовий компонент з реалізацією \`shouldComponentUpdate\` через поверхневе порівняння props/state.

\`\`\`jsx
class MyComponent extends React.PureComponent {
  render() {
    return <div>{this.props.value}</div>;
  }
}
\`\`\`

Функціональний еквівалент: \`React.memo\`

**Примітка:** Лише поверхневе порівняння — вкладені обʼєкти не порівнюються глибоко.`,
  },
  'component-rendering-order-and-hook-calling-in-react': {
    en: `**Rendering order:**
1. Parent renders first
2. Child components render
3. Effects run after paint (useEffect)
4. Layout effects run before paint (useLayoutEffect)

**Hook calling order must be consistent** — that's why hooks can't be conditional.`,
    ua: `**Порядок рендерингу:**
1. Батько рендериться першим
2. Дочірні компоненти рендеряться
3. Effects виконуються після paint (useEffect)
4. Layout effects виконуються до paint (useLayoutEffect)

**Порядок виклику хуків має бути постійним** — тому хуки не можуть бути умовними.`,
  },
  'how-uselayouteffect-works-in-react-and-how-does-it-differ-from-useeffect': {
    en: `**useLayoutEffect** runs synchronously after DOM mutations but before browser paint.

\`\`\`jsx
// useEffect — async, after paint (non-blocking)
useEffect(() => { measure(); }, []);

// useLayoutEffect — sync, before paint (blocking)
useLayoutEffect(() => { measure(); updateDOM(); }, []);
\`\`\`

Use \`useLayoutEffect\` for DOM measurements or when you need to prevent visual flicker.`,
    ua: `**useLayoutEffect** виконується синхронно після DOM-мутацій, але до paint браузера.

\`\`\`jsx
// useEffect — async, після paint (не блокує)
useEffect(() => { measure(); }, []);

// useLayoutEffect — sync, до paint (блокує)
useLayoutEffect(() => { measure(); updateDOM(); }, []);
\`\`\`

Використовуйте \`useLayoutEffect\` для вимірювань DOM або коли потрібно уникнути візуального мерехтіння.`,
  },
  'why-useimperativehandle-is-needed-in-react': {
    en: `\`useImperativeHandle\` customizes the ref value exposed to parent components.

\`\`\`jsx
const Input = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = ''
  }));
  
  return <input ref={inputRef} />;
});
\`\`\`

Use when you want to expose limited API instead of full DOM element.`,
    ua: `\`useImperativeHandle\` налаштовує значення ref, що передається батьківським компонентам.

\`\`\`jsx
const Input = forwardRef((props, ref) => {
  const inputRef = useRef();
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => inputRef.current.value = ''
  }));
  
  return <input ref={inputRef} />;
});
\`\`\`

Використовуйте коли хочете надати обмежений API замість повного DOM-елемента.`,
  },
  'what-is-virtualization-and-why-is-it-needed': {
    en: `**Virtualization** renders only visible items in large lists, improving performance.

\`\`\`jsx
// Libraries: react-window, react-virtualized
import { FixedSizeList } from 'react-window';

<FixedSizeList height={400} itemCount={10000} itemSize={35}>
  {({ index, style }) => <div style={style}>Item {index}</div>}
</FixedSizeList>
\`\`\`

Essential for lists with thousands of items.`,
    ua: `**Віртуалізація** рендерить лише видимі елементи у великих списках, покращуючи продуктивність.

\`\`\`jsx
// Бібліотеки: react-window, react-virtualized
import { FixedSizeList } from 'react-window';

<FixedSizeList height={400} itemCount={10000} itemSize={35}>
  {({ index, style }) => <div style={style}>Item {index}</div>}
</FixedSizeList>
\`\`\`

Необхідна для списків з тисячами елементів.`,
  },
};

async function updateShortAnswers() {
  console.log('🚀 Updating React short answers...\n')
  let updated = 0, notFound = 0
  
  for (const [slug, answers] of Object.entries(shortAnswers)) {
    try {
      const [question] = await db.select({ id: schema.questions.id }).from(schema.questions).where(eq(schema.questions.slug, slug)).limit(1)
      if (!question) { console.log(`❌ Not found: ${slug}`); notFound++; continue }
      await db.update(schema.questions).set({ shortAnswerEn: answers.en, shortAnswerUa: answers.ua, updatedAt: new Date() }).where(eq(schema.questions.id, question.id))
      console.log(`✅ ${slug}`)
      updated++
    } catch (error) { console.error(`❌ Error: ${slug}`, error) }
  }
  
  console.log(`\n✅ Updated: ${updated} | ❌ Not found: ${notFound}`)
  await client.end()
  process.exit(0)
}

updateShortAnswers().catch(console.error)
