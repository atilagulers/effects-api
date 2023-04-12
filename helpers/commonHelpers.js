const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function formatString(string) {
  return string
    .split(' ')
    .map((word) => capitalizeFirstLetter(word.toLowerCase()))
    .join(' ');
}

module.exports = {capitalizeFirstLetter, formatString};
