import { useEffect, useState } from "react";
import axios from "axios";
import { Person } from "./type";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import { Box, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";


function calculateScore(guess: string, correct: number): number {
  if (guess === undefined || guess === "") return 0;
  const g = Number(guess);
  if (isNaN(g)) return 0;
  const diff = Math.abs(g - correct);
  const maxScore = 1000;
  const spread = 10;
  const maxDiff = 150;
  if (diff >= maxDiff) return 0;
  return Math.round(maxScore * Math.exp(-0.5 * (diff / spread) ** 2));
}

type Guess = { birth: string; death: string; alive: boolean };

export default function QuizGame() {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState<Guess>({
    birth: "",
    death: "",
    alive: false,
  });
  const [showResult, setShowResult] = useState(false);
  const [currentScore, setCurrentScore] = useState({ birth: 0, death: 0 });
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/five/`)
      .then((response) => {
        setPeople(response.data);
        setLoading(false);

        const savedGuesses = Cookies.get("quiz_guesses");
        const savedScore = Cookies.get("quiz_score");
        const savedIndex = Cookies.get("quiz_currentIndex");
        if (savedGuesses) setGuesses(JSON.parse(savedGuesses));
        if (savedScore) setTotalScore(Number(savedScore));
        if (savedIndex) setCurrentIndex(Number(savedIndex));
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (guesses.length > 0) {
      Cookies.set("quiz_guesses", JSON.stringify(guesses), { expires: 30 });
      Cookies.set("quiz_score", totalScore.toString(), { expires: 30 });
      Cookies.set("quiz_currentIndex", currentIndex.toString(), {
        expires: 30,
      });
    }
  }, [guesses, totalScore, currentIndex]);

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
      >
        <CircularProgress />
      </Box>
    );

  if (people.length === 0)
    return (
      <Box textAlign="center" mt={5}>
        No people found.
      </Box>
    );

  const person = people[currentIndex];
  const currentYear = new Date().getFullYear();
  const isPersonAlive = person.dod > currentYear;

  const handleSubmit = (birth: string, death: string, alive: boolean) => {
    const birthScore = calculateScore(birth, person.dob);
    let deathScore = 0;
    if (alive) {
      deathScore = isPersonAlive ? 1000 : 0;
    } else {
      if (!isPersonAlive) {
        deathScore = calculateScore(death, person.dod);
      } else {
        deathScore = 0;
      }
    }

    setCurrentScore({ birth: birthScore, death: deathScore });
    setShowResult(true);
    setGuesses((prev) => [...prev, { birth, death, alive }]);
    setTotalScore((prev) => prev + birthScore + deathScore);
  };

  const handleNext = () => {
    setInput({ birth: "", death: "", alive: false });
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
    setCurrentScore({ birth: 0, death: 0 });
  };

  if (currentIndex + 1 >= people.length) {
    return (
      <QuizResult
        people={people}
        guesses={guesses}
        totalScore={totalScore}
        calculateScore={calculateScore}
      />
    );
  }

  return (
    <QuizQuestion
      person={person}
      onSubmit={handleSubmit}
      onNext={handleNext}
      disabled={showResult}
      showResult={showResult}
      isPersonAlive={isPersonAlive}
      currentScore={currentScore}
      input={input}
      setInput={setInput}
      isLastQuestion={currentIndex + 1 === people.length}
    />
  );
}
