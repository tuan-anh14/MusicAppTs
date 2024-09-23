import { Express } from "express";

import { topicRoutes } from "./topic.route";

import { songRoutes } from "./song.route";

import { favoriteSong } from "./favorite-song.route"

const clientRoutes = (app: Express): void => {

  app.use(`/topics`, topicRoutes);

  app.use(`/songs`, songRoutes);

  app.use(`/favorite-songs`, favoriteSong);

};

export default clientRoutes;
