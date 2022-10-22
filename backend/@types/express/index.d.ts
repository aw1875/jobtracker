import { User } from "./User";
import { Express } from "express-serve-static-core";
import session from "express-session";

declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}

declare module "express-session" {
  export interface SessionData {
    lastUrl: string;
  }
}
