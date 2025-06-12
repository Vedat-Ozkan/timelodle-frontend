import { useState } from "react";
import { Person } from "./type";
import {
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

interface PersonQuizProps {
  person: Person;
  onGuess: (
    person: Person,
    birth: number | string,
    death: number | string,
    alive: boolean
  ) => void;
  disabled?: boolean;
}

export default function PersonQuiz({
  person,
  onGuess,
  disabled,
}: PersonQuizProps) {
  const [birth, setBirth] = useState<string>("");
  const [death, setDeath] = useState<string>("");
  const [aliveGuess, setAliveGuess] = useState<boolean>(false);

  return (
    <Box>
      <Typography variant="h6">{person.name}</Typography>
      <Typography variant="body2">
        Occupation: {person.occupation}
        <br />
        Country: {person.country.replace(/_/g, " ").split(",")[0]}
        <br />
        Gender: {person.gender}
      </Typography>
      <Box display="flex" gap={2} my={1} alignItems="center">
        <TextField
          label="Guess birth year"
          type="number"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          disabled={disabled}
          size="small"
        />
        {!aliveGuess && (
          <TextField
            label="Guess death year"
            type="number"
            value={death}
            onChange={(e) => setDeath(e.target.value)}
            disabled={disabled}
            size="small"
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={aliveGuess}
              onChange={(e) => setAliveGuess(e.target.checked)}
              disabled={disabled}
            />
          }
          label="Alive"
        />
        <Button
          variant="outlined"
          onClick={() => onGuess(person, birth, death, aliveGuess)}
          disabled={disabled || birth === "" || (!aliveGuess && death === "")}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
