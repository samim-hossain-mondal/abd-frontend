
const stringToColor = (string, stc) => (stc(string))
const stringAvatar = (name, stc) => ({
  sx: {
    bgcolor: stringToColor(name, stc),
  },
  children: `${name.split(' ')[0][0]}`,
});

module.exports = stringAvatar;