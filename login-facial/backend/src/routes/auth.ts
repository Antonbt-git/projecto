import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { db } from "../db";

const router = Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post("/register", async (req, res) => {
    try {
        const { name, email, password, faceDescriptor } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Todos los campos son obligatorios"
            });
        }

        const [exists]: any = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (exists.length) {
            return res.status(400).json({
                message: "El correo ya está registrado"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const code = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await db.query(
            `INSERT INTO users
            (name,email,password,verification_code,face_descriptor)
            VALUES (?,?,?,?,?)`,
            [
                name,
                email,
                hash,
                code,
                faceDescriptor ? JSON.stringify(faceDescriptor) : null
            ]
        );

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Código de verificación",
            html: `
                <h2>Verificación de cuenta</h2>
                <p>Tu código de seguridad es:</p>
                <h1>${code}</h1>
                <p>Este código es necesario para activar tu cuenta.</p>
            `
        });

        console.log("================================");
        console.log("✅ CORREO ENVIADO");
        console.log("📧 Destinatario:", email);
        console.log("📨 Message ID:", info.messageId);
        console.log("================================");

        res.json({
            message: "Código enviado al correo"
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error en el registro"
        });
    }
});


router.post("/verify", async (req, res) => {
    try {
        const { email, code } = req.body;

        const [rows]: any = await db.query(
            `SELECT id FROM users
             WHERE email = ?
             AND verification_code = ?`,
            [email, code]
        );

        if (!rows.length) {
            return res.status(400).json({
                message: "Código incorrecto"
            });
        }

        await db.query(
            `UPDATE users
             SET verified = TRUE,
                 verification_code = NULL
             WHERE email = ?`,
            [email]
        );

        res.json({
            message: "Cuenta verificada correctamente"
        });

    } catch {
        res.status(500).json({
            message: "Error verificando cuenta"
        });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [rows]: any = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (!rows.length) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos"
            });
        }

        const user = rows[0];

        if (!user.verified) {
            return res.status(403).json({
                message: "Debes verificar tu correo"
            });
        }

        const valid = await bcrypt.compare(
            password,
            user.password
        );

        if (!valid) {
            return res.status(401).json({
                message: "Correo o contraseña incorrectos"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login correcto",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error iniciando sesión"
        });
    }
});


router.post("/face-login", async (req, res) => {
    try {
        const { email, faceDescriptor } = req.body;

        const [rows]: any = await db.query(
            `SELECT * FROM users
             WHERE email = ?
             AND verified = TRUE`,
            [email]
        );

        if (!rows.length) {
            return res.status(401).json({
                message: "Usuario no encontrado"
            });
        }

        const user = rows[0];

        if (!user.face_descriptor) {
            return res.status(400).json({
                message: "Este usuario no tiene rostro registrado"
            });
        }

        const saved = JSON.parse(user.face_descriptor);

        let distance = 0;

        for (let i = 0; i < saved.length; i++) {
            distance += Math.pow(
                saved[i] - faceDescriptor[i],
                2
            );
        }

        distance = Math.sqrt(distance);

        if (distance > 0.5) {
            return res.status(401).json({
                message: "El rostro no coincide"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Reconocimiento facial correcto",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error en reconocimiento facial"
        });
    }
});

export default router;