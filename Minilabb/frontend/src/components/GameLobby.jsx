import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import Timer from "./Timer";

const GameLobby = () => {
  const [lobby, setLobby] = useState([]);
  const [lobbyUsers, setLobbyUsers] = useState([]);
  const [user, setUser] = useState({});
  const [showButton, setShowButton] = useState(true);
  const [role, setRole] = useState();
  const [currentWord, setCurrentWord] = useState();

  const { id, username } = useParams();
  const gameUrl = `http://localhost:5000/game/`;
  const userUrl = `http://localhost:5000/user/`;

  useEffect(() => {
    setInterval(() => {
      const fetchData = async (id) => {
        const result = await fetch(`${gameUrl}${id}`);
        const jsonResult = await result.json();
        setLobby(jsonResult);
        setLobbyUsers(jsonResult.user);
        setRole(jsonResult.role);
        setCurrentWord(jsonResult.currentWord);
      };
      fetchData(id);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchUserData = async (username) => {
      const result = await fetch(`${userUrl}${username}`);
      const jsonResult = await result.json();
      setUser(jsonResult);
    };
    fetchUserData(username);
  }, []);

  const handleStartGame = async () => {
    await fetch(`${gameUrl}${id}/start`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
  };

  const handleEndGame = async () => {
    await fetch(`${gameUrl}${id}/end`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
  };

  const setRoleUser = async (u, r) => {
    const data = {
      role: r,
    };
    await fetch(`${userUrl}${u}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };
  const modifyRoleList = () => {
    let roles = ["Master", "Insider"];

    for (let index = 2; index < lobbyUsers.length; index++) {
      roles.push("Commoner");
    }

    lobbyUsers.forEach((user) => {
      let index = Math.floor(Math.random() * roles.length);
      user.role = roles[index];
      setRoleUser(user.username, user.role);
      roles.splice(index, 1);
    });
  };

  const resetRoles = () => {
    lobbyUsers.forEach((user) => {
      user.role = "";

      setRoleUser(user.username, user.role);
    });
  };

  const showRole = () => {
    let u = lobbyUsers.find((user) => user.username === username);
    user.role = u.role;

    return (
      <Box sx={{ fontFamily: "silkscreen" }}>Your role is {user.role}</Box>
    );
  };

  const handleChooseWord = async () => {
    const data = {
      currentWord: prompt("Please Type in the word"),
    };
    await fetch(`${gameUrl}${id}/word`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const ShowWord = () => {
    if (user.role === "Insider" || user.role === "Master")
      return (
        <Box
          sx={{
            color: "red",
            fontSize: 26,
            margin: "auto",
            fontFamily: "silkscreen",
          }}
        >
          Secret word: {currentWord}
        </Box>
      );
  };

  const IsMaster = () => {
    if (user.role === "Master") {
      return (
        <Button
          sx={{
            ":hover": { bgcolor: "rgb(38, 50, 56)" },
            width: 150,
            bgcolor: "red",
            margin: "auto",
            fontFamily: "silkscreen",
          }}
          variant="contained"
          onClick={handleChooseWord}
        >
          Choose Word
        </Button>
      );
    } else {
      return false;
    }
  };

  const isHost = () => {
    if (lobby.host === user.username) {
      return true;
    } else {
      return false;
    }
  };

  const NotHost = () => {
    if (lobby.host !== user.username && lobby.gameStart !== true) {
      return "Waiting for host to start the game...";
    } else {
      return false;
    }
  };

  const gameStarted = () => {
    if (lobby.gameStart === true && lobby.currentWord !== "") {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", color: "red" }}>
          <Timer />
        </Box>
      );
    }
  };

  const startGame = () => {
    return (
      <Button
        variant="contained"
        sx={{
          ":hover": { bgcolor: "rgb(38, 50, 56)" },
          width: 140,
          bgcolor: "red",
          fontFamily: "silkscreen",
        }}
        onClick={() => {
          handleStartGame();
          setShowButton(false);
          modifyRoleList();
        }}
      >
        {"Start Game"}
      </Button>
    );
  };

  const endGame = () => {
    return (
      <Button
        variant="contained"
        sx={{ width: 140, bgcolor: "red", fontFamily: "silkscreen" }}
        onClick={() => {
          handleEndGame();
          setShowButton(true);
          resetRoles();
        }}
      >
        {"End Game"}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        mt: 15,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          margin: "auto",
          fontFamily: "silkscreen",
        }}
      >
        <Box>
          <Typography
            color={"red"}
            variant="h5"
            fontSize={34}
            fontWeight="bold"
            fontFamily={"silkscreen"}
            sx={{ py: 2.5 }}
          >
            WELCOME TO THE GAME
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: "silkscreen",
            fontSize: 20,
            mb: 1,
            color: "white",
          }}
        >
          Players
        </Typography>

        <Box sx={{ mb: 1 }}>
          {lobbyUsers.map((user) => (
            <Box
              sx={{
                pr: 2,
                pl: 2,
                border: 3,
                borderColor: "red",
                color: "whitesmoke",
              }}
              key={user.user_id}
            >
              {user.username}
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          margin: "auto",
          mt: 1,
        }}
      >
        {isHost() ? (showButton ? startGame() : endGame()) : null}

        <IsMaster margin={"auto"} />
      </Box>

      <Box
        sx={{
          margin: "auto",
          mt: 4,
        }}
      >
        {gameStarted()}
        <Box
          sx={{
            fontSize: 30,
            color: "rgb(238, 238, 238)",
          }}
        >
          {role ? showRole() : null}
        </Box>
        <Box
          sx={{
            fontFamily: "silkscreen",
            fontSize: 20,
          }}
        >
          <NotHost />
        </Box>
      </Box>
      <ShowWord />
    </Box>
  );
};

export default GameLobby;
