import express from "express";
import { body, validationResult } from "express-validator";
import db from "../db.js";

const router = express.Router();

router.post(
  "/",
  //middleware for validation
  [
    body("name").isString().notEmpty(),
    body("address").notEmpty(),
    body("latitude").isFloat({ min: -90, max: 90 }).notEmpty(),
    body("longitude").isFloat({ min: -180, max: 180 }).notEmpty(),
  ],
  async (req, res) => {
    const { name, address, latitude, longitude } = req.body;
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`,
        [name, address, latitude, longitude]
      );

      return res.status(201).json({ id: result.insertId });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error });
    }
  }
);

export default router;
