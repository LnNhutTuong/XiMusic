export const shuffleArray = (array) => {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

export const buildQueue = (song, songs, shuffle) => {
  if (!shuffle) {
    return {
      queue: songs,
      currentIndex: songs.findIndex((item) => item.id === song.id),
    };
  }

  const remainSongs = songs.filter((item) => item.id !== song.id);

  const randomSongs = shuffleArray(remainSongs);

  return {
    queue: [song, ...randomSongs],
    currentIndex: 0,
  };
  // còn shuffle làm sau
};

export const formatTimeProgress = (time) => {
  if (!time || isNaN(time)) return "0:00";

  //chia du
  let minutes = Math.floor(time / 60);
  //chai hit
  let seconds = Math.floor(time % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const parseLrc = (lrc) => {
  return lrc
    ?.split("\n")
    .filter((line) => line.trim())
    .map((line) => {
      const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);

      if (!match) return null;

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);

      return {
        time: minutes * 60 + seconds,
        text: match[3].trim(),
      };
    })
    .filter(Boolean);
};
