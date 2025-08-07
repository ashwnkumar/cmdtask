import React, { useEffect, useState } from "react";

const AsciiArtRenderer = ({ art, linesPerSecond = 10, onComplete }) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const allLines = art.split("\n");
    setDisplayedLines([]);
    setLineIndex(0);

    const interval = 1000 / linesPerSecond;

    const timer = setInterval(() => {
      setLineIndex((prev) => {
        const next = prev + 1;
        setDisplayedLines(allLines.slice(0, next));

        if (next >= allLines.length) {
          clearInterval(timer);
          if (onComplete) onComplete();
        }

        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [art, linesPerSecond]);

  return <pre className="h-52">{displayedLines.join("\n")}</pre>;
};

export default AsciiArtRenderer;
