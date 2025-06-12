import React from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from "@mui/material";
import { Person } from "./type";

interface QuizQuestionProps {
  person: Person;
  input: { birth: string; death: string; alive: boolean };
  setInput: React.Dispatch<React.SetStateAction<{ birth: string; death: string; alive: boolean }>>;
  onSubmit: (birth: string, death: string, alive: boolean) => void;
  onNext: () => void;
  disabled: boolean;
  showResult: boolean;
  isPersonAlive: boolean;
  currentScore: { birth: number; death: number };
  isLastQuestion: boolean;
}

export default function QuizQuestion({
  person,
  input,
  setInput,
  onSubmit,
  onNext,
  disabled,
  showResult,
  isPersonAlive,
  currentScore,
  isLastQuestion,
}: QuizQuestionProps) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <Card sx={{ minWidth: 350, maxWidth: 400, borderRadius: 4, boxShadow: 6 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" fontWeight={600} gutterBottom>
            Guess the Dates!
          </Typography>
          <Typography variant="h6" textAlign="center" gutterBottom>
            {person.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={2}>
            Occupation: {person.occupation} <br />
            Country: {person.country.replace(/_/g, " ").split(",")[0]} <br />
            Gender: {person.gender}
          </Typography>
          <Box display="flex" gap={2} justifyContent="center" mb={2} alignItems="center">
            <TextField
              label="Guess birth year"
              type="number"
              value={input.birth}
              onChange={(e) => setInput(i => ({ ...i, birth: e.target.value }))}
              disabled={disabled}
              size="small"
              inputProps={{
                style: { textAlign: "center" },
                inputMode: "numeric",
                pattern: "[0-9]*",
              }}
              sx={{
                width: 120,
                borderRadius: 2,
                bgcolor: "white",
                '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                  WebkitAppearance: 'none',
                  margin: 0,
                },
                '& input[type=number]': {
                  MozAppearance: 'textfield',
                },
              }}
            />
            {!input.alive && (
              <TextField
                label="Guess death year"
                type="number"
                value={input.death}
                onChange={(e) => setInput(i => ({ ...i, death: e.target.value }))}
                disabled={disabled}
                size="small"
                inputProps={{
                  style: { textAlign: "center" },
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={{
                  width: 120,
                  borderRadius: 2,
                  bgcolor: "white",
                  '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                    WebkitAppearance: 'none',
                    margin: 0,
                  },
                  '& input[type=number]': {
                    MozAppearance: 'textfield',
                  },
                }}
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={input.alive}
                  disabled={disabled}
                  onChange={e =>
                    setInput(i => ({
                      ...i,
                      alive: e.target.checked,
                      death: e.target.checked ? "" : i.death,
                    }))
                  }
                />
              }
              label="Alive"
            />
          </Box>
          {!showResult && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => onSubmit(input.birth, input.death, input.alive)}
              disabled={
                disabled ||
                input.birth === "" ||
                (!input.alive && input.death === "")
              }
              sx={{ py: 1.3, mt: 1, fontWeight: 600, fontSize: 18, borderRadius: 3 }}
            >
              Submit
            </Button>
          )}
          {showResult && (
            <Box mt={3} textAlign="center">
              <Typography>
                <b>
                  {isPersonAlive ? "Correct: Alive" : `Correct: Died in ${person.dod}`}
                </b>
              </Typography>
              <Typography>
                DOB Score: {currentScore.birth} / 1000
                <br />
                DOD/Alive Score: {currentScore.death} / 1000
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2, borderRadius: 3, fontWeight: 700, px: 5 }}
                onClick={onNext}
              >
                {isLastQuestion ? "Finish Quiz" : "Next"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
