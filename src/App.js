import { useState, useEffect } from "react";
import io from "socket.io-client";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BoardBingo from "./components/BoardBingo";
import { Typography } from "@mui/material";

const URL_SERVER = "https://project-bingo-back.herokuapp.com";

const socket = io(URL_SERVER, {
  autoConnect: false,
});

function App() {
  useEffect(() => {
    socket.connect();
  }, []);

  const [name, setName] = useState("");
  const [next, setNext] = useState(false);
  const [players, setPlayers] = useState([]);
  const [board, setBoard] = useState("");
  const [markedCells, setMarkedCells] = useState([]);
  const [playGame, setPlayGame] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [numberShown, setNumberShown] = useState(null);
  const [numbersShown, setNumbersShown] = useState([]);
  const [nextNumber, setNextNumber] = useState(false);

  socket.on("update-players", (dataUsers) => {
    setPlayers(dataUsers);
  });

  socket.on("new-board", (board) => {
    setBoard(board);
  });

  socket.on("game-started", () => {
    setGameStarted(true);
  });

  socket.on("number-shown", (number) => {
    setNextNumber(false);
    setNumberShown(number);
    setNumbersShown([...numbersShown, number]);
  });

  socket.on("dial-current-number-shown-response", (numberOnBoard) => {
    if (numberOnBoard) {
      setMarkedCells(
        markedCells.includes(numberShown)
          ? markedCells
          : [...markedCells, numberShown]
      );
    }
  });

  const handleClickNext = () => {
    socket.emit("connection-game", name);
    setNext(true);
  };

  const handleClickGenerateNewBoard = () => {
    socket.emit("generate-new-board");
  };

  const handleClickPlay = () => {
    socket.emit("play");
    setPlayGame(true);
  };

  const handleClickDialCurrentNumberShown = () => {
    socket.emit("dial-current-number-shown");
  };

  const handleClickNextNumber = () => {
    socket.emit("next-number");
    setNextNumber(true);
  };

  const handleClickBingo = () => {
    socket.emit("bingo");
  };

  return (
    <Box
      className="App"
      sx={{
        textAlign: "center",
        margin: "5px",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography>BINGO</Typography>
      </Box>
      {!next && (
        <>
          <TextField
            label="Name"
            variant="outlined"
            sx={{ textAlign: "center", margin: "5px" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Box>
            <Button
              variant="contained"
              onClick={handleClickNext}
              sx={{ textAlign: "center", margin: "5px" }}
              disabled={name.length === 0}
            >
              Next
            </Button>
          </Box>
        </>
      )}
      {next && (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <BoardBingo board={board} markedCells={markedCells} />
            <Box>
              <Typography>USERS</Typography>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {players.map((player) => {
                  return (
                    <Box
                      sx={{
                        width: "175px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>{player.name}</Box>
                      {!gameStarted && player.playGame && (
                        <Box sx={{ backgroundColor: "green" }}>
                          <Typography>PLAY</Typography>
                        </Box>
                      )}
                      {gameStarted && player.nextNumber && (
                        <Box sx={{ backgroundColor: "green" }}>
                          <Typography>NEXT NUMBER</Typography>
                        </Box>
                      )}
                      {player.winner && (
                        <Box sx={{ backgroundColor: "green" }}>
                          <Typography>WINNER</Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
          {!gameStarted && (
            <>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleClickGenerateNewBoard}
                  sx={{ textAlign: "center", margin: "5px" }}
                  disabled={playGame}
                >
                  Generate a new board
                </Button>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleClickPlay}
                  sx={{ textAlign: "center", margin: "5px" }}
                  disabled={playGame}
                >
                  Play
                </Button>
              </Box>
            </>
          )}
          {gameStarted && (
            <>
              <Box sx={{ margin: "5px" }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography>NUMBERS SHOWN</Typography>
                </Box>
                <Box
                  sx={{
                    width: "400px",
                    display: "flex",
                    flexWrap: "wrap",
                    margin: "auto",
                    padding: "5px",
                    textAlign: "center",
                  }}
                >
                  {numbersShown.map((number, index) => {
                    return (
                      <Box
                        sx={{
                          width: "20%",
                          backgroundColor:
                            index === numbersShown.length - 1
                              ? "blue"
                              : "white",
                        }}
                      >
                        {number}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  onClick={handleClickDialCurrentNumberShown}
                  sx={{ textAlign: "center", margin: "5px" }}
                  disabled={nextNumber}
                >
                  Dial the current number shown
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClickNextNumber}
                  sx={{
                    textAlign: "center",
                    margin: "5px",
                    backgroundColor: "green",
                  }}
                  disabled={nextNumber}
                >
                  Next number
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClickBingo}
                  sx={{
                    textAlign: "center",
                    margin: "5px",
                    backgroundColor: "red",
                  }}
                  disabled={nextNumber}
                >
                  Bingo
                </Button>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default App;
