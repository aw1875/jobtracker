import express, { Express, Request, Response, NextFunction } from 'express';
// import path from 'path';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import store from 'connect-mongo';

// Strategies
require('../Strategies/github');

// Routes
import routes from '../Routes';

const createApp = (): Express => {
  const app = express();

  // Enable Parsing
  app.use(express.json());

  // Enable CORS
  app.use(
    cors({
      origin: ['https://jobs.wolfyy.me', 'http://localhost:3000'],
      credentials: true,
    }),
  );

  // Enable Sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
      store: store.create({ mongoUrl: process.env.MONGO_URI }),
    }),
  );

  // Setup Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // API Routes
  app.use('/api/v1', routes);
  return app;
};

export default createApp;
