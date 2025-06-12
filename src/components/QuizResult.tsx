import { Person } from "./type";
import { Box, Card, CardContent, Typography, Fade } from "@mui/material";

interface QuizResultProps {
  people: Person[];
  guesses: { birth: string; death: string; alive: boolean }[];
  totalScore: number;
  calculateScore: (guess: string, correct: number) => number;
}

export default function QuizResult({
  people,
  guesses,
  totalScore,
  calculateScore,
}: QuizResultProps) {
  const currentYear = new Date().getFullYear();

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
                  <span style={{ fontWeight: 600 }}>Result:</span> {resultText}
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
