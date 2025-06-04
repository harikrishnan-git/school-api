import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import addSchool from "./routes/addSchool.js";
import listSchools from "./routes/listSchools.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

app.use("/addSchool", addSchool);
app.use("/listSchools", listSchools);
