import { requireAuth } from "./../middleware/require-auth";
import { currentUser } from "./../middleware/current-user";
import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
