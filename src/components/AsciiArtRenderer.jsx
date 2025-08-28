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

  return (
    <div className="w-full overflow-x-auto">
      <pre className=" text-[0.55rem]  md:text-sm h-24 md:h-36 leading-tight">
        {displayedLines.join("\n")}
      </pre>
    </div>
  );
};

export default AsciiArtRenderer;
