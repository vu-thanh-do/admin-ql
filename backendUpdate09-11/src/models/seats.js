import { model, Schema } from "mongoose";
import { SEAT_STATUS } from "../constants/index.js";

const seatsSchema = new Schema(
  {
    bus: {
      type: Schema.Types.ObjectId,
      ref: "buses",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SEAT_STATUS),
      required: true,
    },
  },
  { timestamps: true }
);

const Seats = model("seats", seatsSchema);
export default Seats;
