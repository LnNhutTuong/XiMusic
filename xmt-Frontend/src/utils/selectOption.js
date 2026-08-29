export const toSelectOptions = (data, valueKey = "id", labelKey = "name") => {
  return data.map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));
};

export const toSongSelect = (songs) => {
  return songs.map((song) => ({
    value: song.id,
    label: song.title,
  }));
};

export const toArtistOptions = (artists) => {
  return artists.map((artist) => ({
    value: artist.id,
    label: artist.artistName,
  }));
};
