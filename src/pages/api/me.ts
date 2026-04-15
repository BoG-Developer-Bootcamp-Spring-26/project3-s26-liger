import type { NextApiRequest, NextApiResponse } from "next";
const cookie = require("cookie");
const jwt = require('jsonwebtoken');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return res.status(200).json({
      user: decoded,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}