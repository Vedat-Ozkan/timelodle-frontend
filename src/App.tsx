import React from 'react';
import axios from 'axios';
import './App.css'
import QuizGame from './components/QuizGame';

function App() {
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/five/`)
    .then((res) => console.log(res));
  return (
    <>
      <QuizGame />
    </>
  );
}

export default App;
