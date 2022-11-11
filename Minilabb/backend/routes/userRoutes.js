import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const route = express.Router();

route.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

route.get("/:username", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      username: req.params.username,
    },
  });
  res.json(user);
});

route.post("/", async (req, res) => {
  const user = await prisma.user.create({
    data: {
      username: req.body.username,
      role: "",
    },
  });
  res.json(user);
});

route.patch("/:username/join/:id", async (req, res) => {
  const userJoin = await prisma.user.update({
    where: {
      username: req.params.username,
    },
    data: {
      game: {
        connect: {
          game_id: parseInt(req.params.id),
        },
      },
    },
  });
  res.json(userJoin);
});
route.patch("/:username/create", async (req, res) => {
  const userCreate = await prisma.user.update({
    where: {
      username: req.params.username,
    },
    data: {
      game: {
        create: {
          host: req.params.username,
          isActive: true,
          gameStart: false,
          role: false,
          currentWord: "",
        },
      },
    },
  });
  res.json(userCreate);
});

route.patch("/:username/role", async (req, res) => {
  const user = await prisma.user.update({
    where: {
      username: req.params.username,
    },
    data: {
      role: req.body.role
    },
  });
  res.json(user);
});


export default route;
