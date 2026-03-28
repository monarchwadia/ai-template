import { createApp } from "./app.js";

const app = createApp();

app.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  console.log(`Server is now listening on ${address}`);
});
