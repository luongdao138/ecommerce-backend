const convertRatings = (ratings) => {
  return ratings.reduce((acc, current) => {
    if (acc[current.star]) {
      acc[current.star] = acc[current.star] + 1;
    } else {
      acc[current.star] = 1;
    }
    return acc;
  }, {});
};

const countAverageRating = (ratings) => {
  const total = ratings.length;
  const totalStar = ratings.reduce((acc, current) => {
    return acc + current.star;
  }, 0);

  return total === 0 ? 0 : Math.round(totalStar / total);
};

module.exports = {
  convertRatings,
  countAverageRating,
};
