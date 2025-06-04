import express from "express";
import { query, validationResult } from "express-validator";
const router = express.Router();
import db from "../db.js";

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ✅ Middleware: Validate latitude and longitude
const validateCoordinates = [
  query("latitude")
    .exists()
    .withMessage("Latitude is required")
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be between -90 and 90"),
  query("longitude")
    .exists()
    .withMessage("Longitude is required")
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be between -180 and 180"),
];

router.get("/", validateCoordinates, async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  try {
    const [rows] = await db.query("SELECT * FROM schools");
    const withDistance = rows.map((school) => ({
      ...school,
      distance: getDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      ),
    }));

    withDistance.sort((a, b) => a.distance - b.distance);
    res.json(withDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
