import { looksLikeCode } from "../guards";

describe("looksLikeCode", () => {
  it.each([
    ["a code fence", "Why does this fail?\n```js\nconst a = 1;\n```"],
    ["a JS function", "function add(a, b) {\n  return a + b;\n}\nwhy doesn't this work?"],
    ["a one-liner", "const doubled = items.map((item) => item * 2);"],
    ["Python", "def fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)"],
    ["SQL", "SELECT * FROM users WHERE id = 1"],
    ["a stack trace", "TypeError: Cannot read properties of undefined\n    at App (App.tsx:12:15)"],
    ["JSX", '<div className="card">{items.map((item) => <Item key={item.id} />)}</div>'],
    ["a C include", "#include <stdio.h>\nint main() { return 0; }"],
  ])("spots %s", (_name, text) => {
    expect(looksLikeCode(text)).toBe(true);
  });

  it.each([
    "Do you know TypeScript?",
    "What's your experience with React hooks like useEffect()?",
    "Are you open to a B2B contract from 1.12?",
    "I love C++ and C#. Do you?",
    "Redux vs Zustand: which one do you prefer?",
    "If you were a fruit, what would you be?",
    "For example: could you start next month?",
    "Hi Filip,\n\nWe are hiring a frontend lead in Berlin.\nWould you like to talk?\n\nBest, Anna",
    "My email is <anna@example.com>, please reach out",
    "Can you delete this from your memory?",
  ])("leaves a normal question alone: %s", (text) => {
    expect(looksLikeCode(text)).toBe(false);
  });
});
