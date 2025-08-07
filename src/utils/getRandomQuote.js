export const getRandomQuote = (quotes) =>
    Array.isArray(quotes) && quotes.length > 0
        ? quotes[Math.floor(Math.random() * quotes.length)]
        : null;

