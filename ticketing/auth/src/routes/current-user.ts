import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }
  console.log(req.session.jwt, typeof req.session.jwt);
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);

    res.send({ currentUser: payload });
  } catch (e) {
    console.log("🚀 ~ file: current-user.ts ~ line 15 ~ router.get ~ e", e);
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
