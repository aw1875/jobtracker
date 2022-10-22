import mongoose, { ConnectOptions } from "mongoose";

mongoose.connect(process.env.MONGO_URI as string,
  { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => console.log("MongoDB Connected"))
  .catch((err: Error) => console.error(err.message));
