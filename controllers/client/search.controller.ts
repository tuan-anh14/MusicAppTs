import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import { convertToSlug } from "../../helpers/convertToSlug";

// [GET] /search/result
export const result = async (req: Request, res: Response) => {
  const keyword: string = `${req.query.keyword}`;

  let newSongs: any = [];

  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");

    // Tạo slug không dấu, có dấu trừ - ngăn cách
    const stringSlug = convertToSlug(keyword);
    const stringSlugRegex = new RegExp(stringSlug, "i");

    const songs = await Song.find({
      $or: [{ title: keywordRegex }, { slug: stringSlugRegex }],
    });

    for (const item of songs) {
      const infoSinger = await Singer.findOne({
        _id: item.singerId,
      });

      (item as any).infoSinger = infoSinger;
    }

    newSongs = songs;
  }

  res.render("client/pages/search/result.pug", {
    pageTitle: `Kết quả: ${keyword}`,
    keyword: keyword,
    songs: newSongs,
  });
};
