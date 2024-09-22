import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  try {
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

    if (!song) {
      return res.status(404).send("Bài hát không tìm thấy");
    }

    const singer = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    }).select("fullName");

    const topic = await Topic.findOne({
      _id: song.topicId,
      deleted: false,
    }).select("title");

    const favoriteSong = await FavoriteSong.findOne({
      // userId: ""
      songId: song.id,
    });

    (song as any).isFavoriteSong = favoriteSong ? true : false;

    res.render("client/pages/songs/detail.pug", {
      pageTitle: "Chi tiết bài hát",
      song: song,
      singer: singer,
      topic: topic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Đã xảy ra lỗi trong quá trình lấy bài hát.");
  }
};

// [PATCH] /songs/like/:typeLike/:idSong
export const like = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const typeLike: string = req.params.typeLike;

    const likeChange: number =
      typeLike === "like" ? 1 : typeLike === "disLike" ? -1 : 0;

    if (likeChange === 0) {
      return res.status(400).json({
        code: 400,
        message: "typeLike không hợp lệ. Chỉ chấp nhận 'like' hoặc 'disLike'.",
      });
    }

    const song = await Song.findOneAndUpdate(
      { _id: idSong, status: "active", deleted: false },
      { $inc: { like: likeChange } },
      { new: true }
    );

    // like: ["id_user_1", "id_user_2"]

    if (song) {
      return res.json({
        code: 200,
        message: "Thành công!",
        like: song.like,
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bài hát.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ.",
    });
  }
};

// [PATCH] /songs/favorite/:typeFavorite/:idSong
export const favorite = async (req: Request, res: Response) => {
  try {
    const idSong: string = req.params.idSong;
    const typeFavorite: string = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite":
        const exitsFavoriteSong = await FavoriteSong.findOne({
          songId: idSong,
        });
        if (!exitsFavoriteSong) {
          const record = new FavoriteSong({
            // userId: "",
            songId: idSong,
          });

          await record.save();
        }
        break;

      case "unfavorite":
        await FavoriteSong.deleteOne({
          songId: idSong,
        });

        break;

      default:
        break;
    }

    res.json({
      code: 200,
      message: "Thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Lỗi máy chủ.",
    });
  }
};
