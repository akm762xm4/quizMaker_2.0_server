import "dotenv/config";
import env from "./utils/validateEnv";
import mongoose from "mongoose";
import app from "./app";

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(env.MONGO_URI);
};

const handler = async (req: Parameters<typeof app>[0], res: Parameters<typeof app>[1]) => {
  await connectToDatabase();
  return app(req, res);
};

if (require.main === module) {
  const port = env.PORT;

  connectToDatabase()
    .then(() => {
      console.log("Mongoose Connected");
      app.listen(port, () => {
        console.log("Server is Running on Port " + port);
      });
    })
    .catch(console.error);
}

export default handler;
