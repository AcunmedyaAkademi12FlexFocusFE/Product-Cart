import { useEffect, useState } from 'react'
import './App.css'

export default function Quotes() {
  const [quote, setQuote] = useState('');

  async function fetchQuote() {
    const data = await fetch('https://dummyjson.com/quotes/random')
      .then(r => r.json());
    setQuote(data.quote);
  }

  useEffect(() => {
    fetchQuote();
  }, []);

  // useEffect(() => {
  //   async function fetchQuote() {
  //     const data = await fetch('https://dummyjson.com/quotes/random')
  //       .then(r => r.json());
  //       setQuote(data.quote);
  //   }
  //   fetchQuote();
  // }, []);

  return (
    <>
      <div className="quote-container">
        <h1>Daily Inspiration</h1>
        <p>{quote || "Click the button below to get a quote!"}</p>
        <button onClick={fetchQuote}>New Quote</button>
      </div>
    </>
  )
}