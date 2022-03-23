import express from "express";
import { IndexPage } from "../controllers";

const router = express.Router();

/* GET home page. */
router.get("/", IndexPage);

export default router;
