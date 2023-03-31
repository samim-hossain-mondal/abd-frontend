
const stringToColor = (string, stc) => (stc(string))
const stringAvatar = (name, stc, celebration = false) => ({
  sx: {
    ...(celebration && {
      height: "25px",
      width: "25px",
      aspectRatio: "1/1"
    }),
    bgcolor: stringToColor(name, stc),
  },
  children: `${name.split(' ')[0][0]}`,
});

module.exports = stringAvatar;