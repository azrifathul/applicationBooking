const moneyFormatter = (num) => {
  const result = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(num);
  // const splitted = result.split(".");
  // const val = splitted[0].replace("IDR", "Rp").split(",").join(".");
  return result;
};

module.exports = { moneyFormatter };
