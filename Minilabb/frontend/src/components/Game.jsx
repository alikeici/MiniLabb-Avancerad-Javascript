import { Button } from "@mui/material";
import React from "react";

const Game = ({ setGameId, username, navigate, userUrl, gameUrl}) => {
  

  const handleJoinGame = () => {
    const userGameId = prompt("Enter game id:");
    setGameId(userGameId);

    async function getLobbyData() {
      const results = await fetch(`${gameUrl}${userGameId}`);
      const jsonResults = await results.json();
      console.log(jsonResults.isActive);
      console.log(jsonResults.gameStart);

      if (jsonResults.isActive /* && !jsonResults.gameStart */) {
        const result = await fetch(`${userUrl}${username}/join/${userGameId}`, {
          method: "PATCH",
          headers: { "Content-type": "application/join" },
        });
        if (result.status === 200) {
          console.log("true");
          console.log(result);
          navigate(`/${username}/game/${userGameId}`);
        } else {
          console.log("false");
        }
      } else {
        alert("Game is not active");
      }
    }
    getLobbyData();
  };

  return (
    <Button
      variant="contained"
      onClick={handleJoinGame}
      sx={{
        fontFamily: "Silkscreen",
        bgcolor: "red",
        color: "black",
        ml: 2,
      }}
    >
      Join Game
    </Button>
  );
};

export default Game;
