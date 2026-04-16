import { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { connectDb } from "../../../../server/mongodb/connectDb";
import {
  getTrainingLog,
  updateTrainingLog,
} from "../../../../server/mongodb/actions/trainingLogs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { trainingLogId } = req.query;

  if (!trainingLogId || typeof trainingLogId !== "string") {
    return res.status(400).json({ error: "Invalid training log ID" });
  }

  if (!Types.ObjectId.isValid(trainingLogId)) {
    return res.status(400).json({ error: "Invalid training log ID format" });
  }

  if (req.method === "GET") {
    try {
      const trainingLog = await getTrainingLog(trainingLogId);

      if (!trainingLog) {
        return res.status(404).json({ error: "Training log not found" });
      }

      return res.status(200).json(trainingLog);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch training log" });
    }
  }

  if (req.method === "PUT" || req.method === "PATCH") {
    try {
      const parsedHours =
        req.body.hours === undefined ? undefined : Number(req.body.hours);
      if (parsedHours !== undefined && Number.isNaN(parsedHours)) {
        return res.status(400).json({ error: "Invalid hours value" });
      }

      const updatedTrainingLog = await updateTrainingLog(trainingLogId, {
        ...req.body,
        ...(parsedHours !== undefined ? { hours: parsedHours } : {}),
      });

      if (!updatedTrainingLog) {
        return res.status(404).json({ error: "Training log not found" });
      }

      return res.status(200).json(updatedTrainingLog);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update training log" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
connectDb();
