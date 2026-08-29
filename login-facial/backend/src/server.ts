import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";

dotenv.config();

console.log("📧 EMAIL:", process.env.EMAIL_USER);
console.log(
    "🔐 PASSWORD CONFIGURADA:",
    !!process.env.EMAIL_PASS
);

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log("Servidor funcionando en http://localhost:4000");
});