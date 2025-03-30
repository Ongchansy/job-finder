import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownProps {
  children: string;
}

export default function Markdown({ children }: MarkdownProps) {
  return (
    <ReactMarkdown
    remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ children }) => (
          <ul className="list-inside list-disc">{children}</ul>
        ),
        a: ({ children, href }) => (
          <a
            href={href}
            className="text-green-500 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
