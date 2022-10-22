import passport from "passport";
import { Profile, Strategy } from "passport-github";
import { VerifyCallback } from 'passport-oauth2';
import type { User } from "../@types/User";

// Models
import UserModel from "../Models/UserModel";

const dev = process.env.NODE_ENV === 'development';

passport.serializeUser(async (user: User, done) => {
  try {
    const userDoc = await UserModel.findOne({ id: user.id });
    return done(null, userDoc?._id);
  } catch (err) {
    return done(null, undefined)
  }
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    return user ? done(null, user) : done(null, undefined);
  } catch (err) {
    return done(err, null);
  }
});


passport.use(new Strategy(
  {
    clientID: process.env.GH_CLIENT_ID as string,
    clientSecret: process.env.GH_CLIENT_SECRET as string,
    callbackURL: dev ? process.env.GH_CB_URI_LOCAL as string : process.env.GH_CB_URI as string
  }, async (accessToken: string, _: string, profile: Profile, done: VerifyCallback) => {
    const { id, username } = profile;

    // Check if user exists
    const user = await UserModel.
      findOneAndUpdate(
        { id, username },
        { accessToken },
        { new: true }
      );

    if (user) return done(null, user);

    // Create new user if user doesn't exist
    const newUser = new UserModel({ id, username, accessToken });
    const savedUser = await newUser.save();
    return done(null, savedUser);
  }
));
