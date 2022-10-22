import { config } from 'dotenv';
config();
import next from "next";

// Utils
import createApp from "./utils/createApp";
import './utils/database';

const dev = process.env.NODE_ENV === 'development';
const PORT = dev ? process.env.PORT_DEV : process.env.PORT;
const app = next({ dev });
const handle = app.getRequestHandler();

(() => {
  try {
    app.prepare().then(() => {
      const server = createApp();

      server.all('*', (req, res) => {
        return handle(req, res);
      })

      server.listen(PORT, () => console.log(`Running on port ${PORT}`));
    });
  } catch (err) {
    console.error(err);
  }
})();

