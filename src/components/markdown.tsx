import type { ReactNode } from "react";

/** Render a subset of markdown: headings, bold, italic, code, bullet lists. */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.slice(lastIndex, match.index));
    }
    const m = match[0];
    if (m.startsWith("**")) {
      tokens.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-slate-900">
          {m.slice(2, -2)}
        </strong>
      );
    } else if (m.startsWith("`")) {
      tokens.push(
        <code
          key={`${keyPrefix}-c${i}`}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-teal-700"
        >
          {m.slice(1, -1)}
        </code>
      );
    } else {
      tokens.push(
        <em key={`${keyPrefix}-i${i}`} className="text-slate-500">
          {m.slice(1, -1)}
        </em>
      );
    }
    lastIndex = match.index + m.length;
    i++;
  }
  if (lastIndex < text.length) tokens.push(text.slice(lastIndex));
  return tokens;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let list: ReactNode[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      blocks.push(
        <ul key={`ul-${key++}`} className="my-1 space-y-1">
          {list}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h4
          key={`h-${key++}`}
          className="mt-2 mb-1 text-base font-bold text-slate-900"
        >
          {renderInline(line.slice(4), `h-${key}`)}
        </h4>
      );
    } else if (line.startsWith("## ")) {
      flushList();
      blocks.push(
        <h3
          key={`h-${key++}`}
          className="mt-2 mb-1 text-lg font-bold text-slate-900"
        >
          {renderInline(line.slice(3), `h-${key}`)}
        </h3>
      );
    } else if (/^[•▸\-*]\s+/.test(line)) {
      const itemText = line.replace(/^[•▸\-*]\s+/, "");
      list.push(
        <li key={`li-${key++}`} className="flex gap-2 text-slate-700">
          <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
          <span>{renderInline(itemText, `li-${key}`)}</span>
        </li>
      );
    } else if (line === "") {
      flushList();
    } else {
      flushList();
      blocks.push(
        <p key={`p-${key++}`} className="my-1 leading-relaxed text-slate-700">
          {renderInline(line, `p-${key}`)}
        </p>
      );
    }
  }
  flushList();

  return <div className="space-y-1">{blocks}</div>;
}
