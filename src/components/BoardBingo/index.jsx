import Box from "@mui/material/Box";

const BoardBingo = ({
  board = "",
  markedCells = [],
  marginLeft = "200px",
  marginRight = "10px",
}) => {
  const numbers = board.split("-");
  return (
    <Box
      sx={{
        width: "400px",
        display: "flex",
        flexWrap: "wrap",
        padding: "5px",
        border: "1px solid",
        marginLeft,
        marginRight,
      }}
    >
      <Box sx={{ width: "20%", backgroundColor: "grey" }}>B</Box>
      <Box sx={{ width: "20%", backgroundColor: "grey" }}>I</Box>
      <Box sx={{ width: "20%", backgroundColor: "grey" }}>N</Box>
      <Box sx={{ width: "20%", backgroundColor: "grey" }}>G</Box>
      <Box sx={{ width: "20%", backgroundColor: "grey" }}>O</Box>
      {numbers.map((number, index) => {
        return (
          <Box
            key={index}
            sx={{
              width: "20%",
              backgroundColor: markedCells.includes(Number.parseInt(number))
                ? "blue"
                : "white",
            }}
          >
            {number === "0" ? "FREE" : number}
          </Box>
        );
      })}
    </Box>
  );
};

export default BoardBingo;
