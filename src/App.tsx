import React from 'react';
import axios from 'axios';
import './App.css'
import MyTimeline from './components/timeline';

function App() {
  axios
    .get(`${process.env.REACT_APP_API_URL}/api/five/`)
    .then((res) => console.log(res));
  return (
    <>
      <MyTimeline />
    </>
  );
}

export default App;
