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
  const [show, setShow] = useState(false);

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
      <Box sx={{ fontFamily: "silkscreen", fontSize: 24, color: "black" }}>
        Your role is {user.role}
      </Box>
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
            fontSize: 24,
            margin: "auto",
            fontFamily: "silkscreen",
          }}
        >
          Current word: {currentWord}
        </Box>
      );
  };

  const IsMaster = () => {
    if (user.role === "Master") {
      return (
        <Box>
          {!show ? (
            <Button
              sx={{
                ":hover": { bgcolor: "black" },
                width: 150,
                color: "white",
                bgcolor: "black",
                fontFamily: "silkscreen",
              }}
              variant="contained"
              onClick={() => {
                handleChooseWord();
                hideButton();
              }}
            >
              Choose Word
            </Button>
          ) : null}
        </Box>
      );
    } else {
      return false;
    }
  };

  const hideButton = () => {
    setShow(true);
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
          width: 150,
          bgcolor: "black",
          color: "antiquewhite",
          fontFamily: "silkscreen",
          mb: 1,
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
        sx={{
          ":hover": { bgcolor: "rgb(38, 50, 56)" },
          width: 150,
          mb: 1,
          mt: 2,
          bgcolor: "black",
          fontFamily: "silkscreen",
        }}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          mt: 1,
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
              color={"black"}
              fontSize={28}
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
              fontSize: 24,
              mb: 1,
              color: "red",
            }}
          >
            Players:
          </Typography>

          <Box sx={{ mb: 1 }}>
            {lobbyUsers.map((user) => (
              <Box
                sx={{
                  pr: 2,
                  pl: 2,
                  border: 3,
                  borderColor: "black",
                  color: "red",
                  fontSize: 22,
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
            mt: 2,
          }}
        >
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
        {gameStarted()}
        <Box
          sx={{
            margin: "auto",
            mt: 1,
          }}
        >
          {isHost() ? (showButton ? startGame() : endGame()) : null}

          <IsMaster margin={"auto"} />
        </Box>
      </Box>
    </Box>
  );
};

export default GameLobby;
