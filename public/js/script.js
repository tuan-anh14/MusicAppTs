// APlayer
const aplayer = document.querySelector("#aplayer");
if (aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  let dataSinger = aplayer.getAttribute("data-singer");

  try {
    dataSong = JSON.parse(dataSong);
    dataSinger = JSON.parse(dataSinger);
  } catch (error) {
    console.error("Error parsing data attributes: ", error);
  }

  const ap = new APlayer({
    container: aplayer,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
      },
    ],
    autoplay: true,
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");

  ap.on("play", function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on("pause", function () {
    avatar.style.animationPlayState = "paused";
  });
}
// End APlayer
