import { useState, useEffect } from "react";
import io from "socket.io-client";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import BoardBingo from "./components/BoardBingo";
import { Typography } from "@mui/material";

const URL_SERVER = "http://localhost:3001";

const socket = io(URL_SERVER, {
  autoConnect: false,
});

function App() {
  useEffect(() => {
    socket.connect();
  }, []);

  const [wait, setWait] = useState(false);
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
  const [endGame, setEndGame] = useState(false);
  const [winner, setWinner] = useState(false);
  const [boardWinner, setBoardWinner] = useState("");
  const [markedCellsWinner, setMarkedCellsWinner] = useState([]);

  socket.on("wait", () => {
    setWait(true);
  });

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

  socket.on("winner", () => {
    setWinner(true);
  });

  socket.on("end-game", ({ boardW, markedCellsW }) => {
    setEndGame(true);
    setBoardWinner(boardW);
    setMarkedCellsWinner(markedCellsW);
  });

  socket.on("reset", () => {
    window.location.reload();
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
      {!wait ? (
        <>
          <Box>
            <Typography>BINGO</Typography>
          </Box>
          {!next ? (
            <>
              <TextField
                label="Name"
                variant="outlined"
                sx={{ margin: "5px" }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Box>
                <Button
                  variant="contained"
                  onClick={handleClickNext}
                  sx={{ margin: "5px" }}
                  disabled={name.length === 0}
                >
                  Next
                </Button>
              </Box>
            </>
          ) : (
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
              {!gameStarted ? (
                <>
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleClickGenerateNewBoard}
                      sx={{ margin: "5px" }}
                      disabled={playGame}
                    >
                      Generate a new board
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleClickPlay}
                      sx={{ margin: "5px" }}
                      disabled={playGame}
                    >
                      Play
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ margin: "5px" }}>
                    <Box>
                      <Typography>NUMBERS SHOWN</Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "400px",
                        display: "flex",
                        flexWrap: "wrap",
                        margin: "auto",
                        padding: "5px",
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
                  {!endGame ? (
                    <Box>
                      <Button
                        variant="contained"
                        onClick={handleClickDialCurrentNumberShown}
                        sx={{ margin: "5px" }}
                        disabled={nextNumber}
                      >
                        Dial the current number shown
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleClickNextNumber}
                        sx={{
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
                          margin: "5px",
                          backgroundColor: "red",
                        }}
                        disabled={nextNumber}
                      >
                        Bingo
                      </Button>
                    </Box>
                  ) : (
                    <Box sx={{ margin: "5px" }}>
                      {!winner ? (
                        <Box>
                          <Box>
                            <Typography>YOU HAVE NOT WON THE GAME</Typography>
                          </Box>
                          <Box>
                            <Typography>BOARD WINNER</Typography>
                          </Box>
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <BoardBingo
                              board={boardWinner}
                              markedCells={markedCellsWinner}
                              marginLeft={"0px"}
                              marginRight={"0px"}
                            />
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Box>
                            <Typography>YOU HAVE WON THE GAME</Typography>
                          </Box>
                        </Box>
                      )}
                      <Box>
                        <Typography>
                          YOU WILL BE REDIRECTED TO THE HOME PAGE IN 20 SECONDS,
                          SO YOU CAN START A NEW GAME AGAIN
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        <Box>
          <Typography>
            THERE IS CURRENTLY A GAME IN PROGRESS, YOU MUST WAIT FOR IT TO
            FINISH TO BE ABLE TO PARTICIPATE IN A NEW GAME
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default App;
