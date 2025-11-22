import ReactMarkdown from "react-markdown";

const MarkdownDisplay = ({ text }: { text: string }) => {
  return <ReactMarkdown>{text}</ReactMarkdown>;
};

export default MarkdownDisplay;
