import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [questionObj, setQuestionObj] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState(null);

  // Fetch a new question from the backend
  const fetchQuestion = () => {
    fetch('http://localhost:8080/api/trivia')
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setQuestionObj(data);
        setSelectedAnswer('');
        setResult(null);
      })
      .catch((err) => console.error('Error fetching question:', err));
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleChange = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAnswer) return;
    const payload = {
      question: questionObj.question,
      answer: selectedAnswer,
    };
    try {
      const res = await fetch('http://localhost:8080/api/trivia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error checking answer:', err);
    }
  };

  if (!questionObj) return <div>Loading question...</div>;

  return (
    <div className="App">
      <h1>Trivia Quiz</h1>
      <div className="question-block">
        <p dangerouslySetInnerHTML={{ __html: questionObj.question }} />
        <form onSubmit={handleSubmit}>
          {questionObj.options.map((opt, idx) => (
            <label key={idx} className="option">
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={selectedAnswer === opt}
                onChange={() => handleChange(opt)}
              />
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            </label>
          ))}
          <button type="submit" disabled={!selectedAnswer}>
            Submit
          </button>
        </form>
      </div>
      {result && (
        <div className="result">
          <h2>Result</h2>
          {'correct' in result && (
            <p>{result.correct ? 'Correct!' : 'Incorrect!'}</p>
          )}
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <button onClick={fetchQuestion}>Next Question</button>
        </div>
      )}
    </div>
  );
}

export default App;

