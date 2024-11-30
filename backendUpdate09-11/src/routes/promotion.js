import express from "express";
import { checkLogin, isAdmin } from "../middlewares/auth.js";
import PromotionController from "../controllers/promotion.js";

const promotionRouter = express.Router();

promotionRouter.post("/", checkLogin, PromotionController.createPromotion);
promotionRouter.get("/", checkLogin, PromotionController.getPromotions);
promotionRouter.get("/:id", checkLogin, PromotionController.getPromotion);
promotionRouter.put("/:id", checkLogin, PromotionController.updatePromotion);
promotionRouter.delete("/:id", checkLogin, PromotionController.removePromotion);
promotionRouter.post(
  "/:code/apply",
  checkLogin,
  PromotionController.applyPromotion
);

export default promotionRouter;
