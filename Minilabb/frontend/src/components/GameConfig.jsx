import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import imageInsider from "./InsiderGame.avif";

const GameConfig = () => {
  const gameUrl = `http://localhost:5000/game/`;
  const userUrl = `http://localhost:5000/user/`;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
    console.log(event.target.value);
  };

  const handleSave = async (event) => {
    const data = {
      username: username,
    };

    await fetch(userUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  };
  const handleHostGame = async () => {
    const data = {
      host: username,
      isActive: true,
    };

    const result = await fetch(`${userUrl}${username}/create`, {
      method: "PATCH",
      headers: { "Content-type": "application/join" },
      body: JSON.stringify(data),
    });
    if (result.status === 200) {
      console.log("true");
      console.log(result);
      navigate(`/${username}/game/${gameId}`);
    } else {
      console.log("false");
    }
  };

  const handleJoinGame = () => {
    const userGameId = prompt("Enter game id:");
    setGameId(userGameId);

    const getLobbyData = async () => {
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
    };

    getLobbyData();
  };

  return (
    <Box
      sx={{
        margin: "auto",
        mt: 1,
        height: 680,
        width: 500,
        border: 5,
        borderRadius: 5,
        borderColor: "red",
        bgcolor: "antiquewhite",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
          fontSize: 28,
          fontFamily: "Silkscreen",
          color: "black",
        }}
      >
        Welcome to Insider
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
          width: 270,
          height: 450,
          border: 5,
          mt: 4,
        }}
        component={"img"}
        src={imageInsider}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
        }}
      >
        <TextField
          InputLabelProps={{ sx: { fontSize: 15 } }}
          label="Enter your username"
          variant="outlined"
          size="small"
          value={username}
          onChange={handleChangeUsername}
          sx={{
            width: 180,
            mr: 1,
          }}
        />
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            fontFamily: "Silkscreen",
            bgcolor: "red",
            color: "black",
            height: 39,
          }}
        >
          Create
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 1,
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleHostGame}
          sx={{
            fontFamily: "Silkscreen",
            bgcolor: "red",
            color: "black",
            width: 142,
          }}
        >
          New Game
        </Button>
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
      </Box>
    </Box>
  );
};

export default GameConfig;
