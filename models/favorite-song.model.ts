import mongoose from "mongoose";

const favouriteSongSchema = new mongoose.Schema(
  {
    userId: String,
    songId: String,
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const FavouriteSong = mongoose.model(
  "FavouriteSong",
  favouriteSongSchema,
  "favourite-songs"
);

export default FavouriteSong;
