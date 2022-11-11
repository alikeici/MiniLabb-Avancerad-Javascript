import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import imageInsider from "./InsiderGame.avif";
import Game from "./Game";

const GameConfig = () => {
  const userUrl = `http://localhost:5000/user/`;
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [gameId, setGameId] = useState("");
  const gameUrl = `http://localhost:5000/game/`;

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
    const result = await fetch(`${gameUrl}${username}/create`, {
      method: "POST",
      headers: { "Content-type": "application/join" },
    });
    const jsonResult = await result.json();
    if (result.status === 200) {
      console.log("true");
      console.log(result);
      navigate(`/${username}/game/${jsonResult.game_id}`);
    } else {
      console.log("false");
    }
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
        <Game
          setGameId={setGameId}
          userUrl={userUrl}
          gameUrl={gameUrl}
          username={username}
          navigate={navigate}
        />
      </Box>
    </Box>
  );
};

export default GameConfig;
