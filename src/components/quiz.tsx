import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Fade,
} from "@mui/material";
import { Person } from "./type";
import { calculateScore } from "./utilities";

// Types
type Guess = {
  birth: string;
  death: string;
  alive: boolean;
};


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
      })
      .catch((error) => {
        console.error("Error fetching people:", error);
        setLoading(false);
      });
  }, []);

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
        <Typography>No people found.</Typography>
      </Box>
    );

  const person = people[currentIndex];
  const currentYear = new Date().getFullYear();
  const isPersonAlive = person.dod > currentYear;

  const handleInput = (field: keyof Guess, value: string | boolean) => {
    setInput((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "alive" && value === true ? { death: "" } : {}), // clear death year if guessing alive
    }));
  };

  const handleSubmit = () => {
    // Calculate scores
    const birthScore = calculateScore(input.birth, person.dob);
    let deathScore = 0;

    if (input.alive) {
      // User guessed alive
      deathScore = isPersonAlive ? 1000 : 0;
    } else {
      if (!isPersonAlive) {
        // Guess death year only if not alive
        deathScore = calculateScore(input.death, person.dod);
      } else {
        // User guessed death year, but person is alive
        deathScore = 0;
      }
    }

    setCurrentScore({ birth: birthScore, death: deathScore });
    setShowResult(true);
    setGuesses((prev) => [...prev, input]);
    setTotalScore((prev) => prev + birthScore + deathScore);
  };

  const handleNext = () => {
    setInput({ birth: "", death: "", alive: false });
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
    setCurrentScore({ birth: 0, death: 0 });
  };

  // After last, show summary
  if (currentIndex >= people.length) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Card
          sx={{
            minWidth: 350,
            maxWidth: 500,
            borderRadius: 4,
            boxShadow: 6,
            mb: 3,
          }}
        >
          <CardContent>
            <Typography variant="h4" textAlign="center" gutterBottom>
              🎉 Quiz Complete! 🎉
            </Typography>
            <Typography
              variant="h5"
              color="primary"
              textAlign="center"
              gutterBottom
            >
              Total Score: {totalScore} / 10000
            </Typography>
          </CardContent>
        </Card>
        {people.map((person, i) => {
          const guess = guesses[i] || { birth: "", death: "", alive: false };
          const isAlive = person.dod > currentYear;
          const birthScore = calculateScore(guess.birth, person.dob);
          let deathScore = 0;
          let resultText = "";

          if (guess.alive) {
            deathScore = isAlive ? 1000 : 0;
            resultText = isAlive
              ? "Person is alive (You guessed Alive ✔️)"
              : `Person died in ${person.dod} (You guessed Alive ✗)`;
          } else {
            if (!isAlive) {
              deathScore = calculateScore(guess.death, person.dod);
              resultText = `Person died in ${person.dod} (You guessed death year)`;
            } else {
              deathScore = 0;
              resultText = `Person is alive (You guessed a death year ✗)`;
            }
          }

          return (
            <Fade in key={person.name} timeout={400 + i * 150}>
              <Card
                sx={{
                  width: 350,
                  mb: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1">{person.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Occupation: {person.occupation} <br />
                    Country: {
                      person.country.replace(/_/g, " ").split(",")[0]
                    }{" "}
                    <br />
                    Gender: {person.gender}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600 }}>Your Guess:</span>{" "}
                    {guess.birth || "—"} -{" "}
                    {guess.alive ? "Alive" : guess.death || "—"}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: 600 }}>Result:</span>{" "}
                    {resultText}
                  </Typography>
                  <Box mt={1}>
                    <Typography>
                      DOB Score: {birthScore} / 1000
                      <br />
                      DOD/Alive Score: {deathScore} / 1000
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      Person Score: {birthScore + deathScore} / 2000
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          );
        })}
      </Box>
    );
  }

  // Per-question quiz step
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      minHeight="100vh"
      sx={{
        bgcolor: "#f6f8fa",
        pt: { xs: 3, sm: 7 },
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 400 },
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight={600}
            gutterBottom
            letterSpacing={1}
            color="primary"
          >
            Guess the Dates!
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(currentIndex / people.length) * 100}
            sx={{ height: 10, borderRadius: 5, mb: 3 }}
            color="primary"
          />
          <Typography
            variant="body1"
            textAlign="center"
            mb={2}
            sx={{ fontSize: 17 }}
          >
            <b>{person.name}</b>
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={2}
          >
            Occupation: {person.occupation} <br />
            Country: {person.country.replace(/_/g, " ").split(",")[0]} <br />
            Gender: {person.gender}
          </Typography>
          {/* Input fields */}
          <Box
            display="flex"
            gap={2}
            justifyContent="center"
            mb={2}
            alignItems="center"
          >
            <input
              type="number"
              placeholder="Guess birth year"
              value={input.birth}
              disabled={showResult}
              style={{
                width: "110px",
                borderRadius: "8px",
                border: "1px solid #bbb",
                padding: "6px",
                fontSize: "16px",
                textAlign: "center",
                background: "#fff",
                marginRight: "8px",
              }}
              onChange={(e) => handleInput("birth", e.target.value)}
            />
            {!input.alive && (
              <input
                type="number"
                placeholder="Guess death year"
                value={input.death}
                disabled={showResult}
                style={{
                  width: "110px",
                  borderRadius: "8px",
                  border: "1px solid #bbb",
                  padding: "6px",
                  fontSize: "16px",
                  textAlign: "center",
                  background: "#fff",
                  marginRight: "8px",
                }}
                onChange={(e) => handleInput("death", e.target.value)}
              />
            )}
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={input.alive}
                disabled={showResult}
                onChange={(e) => handleInput("alive", e.target.checked)}
                style={{ marginRight: "4px" }}
              />
              Alive
            </label>
          </Box>
          {!showResult && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={
                input.birth === "" ||
                (input.alive === false && input.death === "")
              }
              sx={{
                py: 1.3,
                mt: 1,
                fontWeight: 600,
                fontSize: 18,
                borderRadius: 3,
              }}
            >
              Submit
            </Button>
          )}
          {showResult && (
            <Fade in>
              <Box mt={3} textAlign="center">
                <Typography>
                  <b>
                    {isPersonAlive
                      ? "Correct: Alive"
                      : `Correct: Died in ${person.dod}`}
                  </b>
                </Typography>
                <Typography>
                  <b>Your Guess:</b> {input.birth} -{" "}
                  {input.alive ? "Alive" : input.death}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    mt: 1,
                  }}
                >
                  DOB Score: {currentScore.birth} / 1000
                  <br />
                  DOD/Alive Score: {currentScore.death} / 1000
                  <br />
                  <span style={{ fontSize: 21 }}>
                    Person Score: {currentScore.birth + currentScore.death} /
                    2000
                  </span>
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ mt: 2, borderRadius: 3, fontWeight: 700, px: 5 }}
                  onClick={handleNext}
                >
                  {currentIndex + 1 === people.length ? "Finish Quiz" : "Next"}
                </Button>
              </Box>
            </Fade>
          )}
        </CardContent>
      </Card>
      <Box mt={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Current Score: {totalScore} / 10000
        </Typography>
      </Box>
    </Box>
  );
}
