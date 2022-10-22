import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/github", passport.authenticate("github"), (_, res) =>
  res.redirect("/")
);
router.get("/github/callback", passport.authenticate("github"), (_, res) =>
  res.redirect("/home")
);

router.get("/logout", (_, res) => {
  res.clearCookie("connect.sid");
  return res.redirect("/");
});

export default router;
