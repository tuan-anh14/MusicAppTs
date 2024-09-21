import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  try {
    console.log(req.params.slugTopic);

    // Fetch the topic
    const topic = await Topic.findOne({
      slug: req.params.slugTopic,
      status: "active",
      deleted: false,
    });

    if (!topic) {
      return res.status(404).send("Topic not found");
    }

    console.log(topic);

    const songs = await Song.find({
      topicId: topic.id,
      status: "active",
      deleted: false,
    })
      .select("avatar title slug singerId like")
      .lean();

    const songsWithSingers = await Promise.all(
      songs.map(async (song) => {
        const infoSinger = await Singer.findOne({
          _id: song.singerId,
          status: "active",
          deleted: false,
        }).lean();

        return {
          ...song,
          infoSinger,
        };
      })
    );

    console.log(songsWithSingers);

    res.render("client/pages/songs/list.pug", {
      pageTitle: topic.title,
      songs: songsWithSingers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the songs.");
  }
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  try {
    const slugSong: string = req.params.slugSong;

    const song = await Song.findOne({
      slug: slugSong,
      status: "active",
      deleted: false,
    });

    const singer = await Singer.findOne({
      _id: song?.singerId,
      deleted: false,
    }).select("fullName");

    const topic = await Topic.findOne({
      _id: song?.topicId,
      deleted: false,
    }).select("title");

    console.log(song);
    console.log(singer);
    console.log(topic);

    res.render("client/pages/songs/detail.pug", {
      pageTitle: "Chi tiết bài hát",
      song: song,
      singer: singer,
      topic: topic
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the songs.");
  }
};
