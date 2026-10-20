import { cleanEnv, str, port } from "envalid"
export default cleanEnv(process.env, {
  MONGO_URI: str(),
  PORT: port({ default: 5000 }),
  JWT_SECRET: str(),
})
