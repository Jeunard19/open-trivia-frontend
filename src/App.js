import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

function App() {
  const [questionObj, setQuestionObj] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [result, setResult] = useState(null);

  // Fetch a new question from the backend
  const fetchQuestion = () => {
    fetch('http://localhost:8080/api/questions')
      .then((res) => res.json())
      .then((data) => {
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
      const res = await fetch('http://localhost:8080/api/checkanswers', {
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

  // Build and shuffle options from correct and incorrect answers
  const options = useMemo(() => {
    if (!questionObj) return [];
    return questionObj.options;
  }, [questionObj]);

  if (!questionObj)
    return (
      <div className="App">
        <div className="card">
          <p>Loading question...</p>
        </div>
      </div>
    );

  return (
    <div className="App">
      <div className="card">
        <h1>Trivia Quiz</h1>
        <div className="question-block">
        <p dangerouslySetInnerHTML={{ __html: questionObj.question }} />
        <form onSubmit={handleSubmit}>
          {options.map((opt, idx) => (
            <label key={idx} className="option">
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={selectedAnswer === opt}
                onChange={() => handleChange(opt)}
                disabled={result !== null}
              />
              <span dangerouslySetInnerHTML={{ __html: opt }} />
            </label>
          ))}
          {result === null ? (
            <button type="submit" disabled={!selectedAnswer}>
              Submit
            </button>
          ) : (
            <button type="button" onClick={fetchQuestion}>
              Next Question
            </button>
          )}
        </form>
      </div>
        {result !== null && (
          <div className="result">
            <p>{result.correct ? 'Correct!' : 'Incorrect!'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
