// utils/formatDate.js

export const formatDate = (date, withTime = false) => {
  if (!date) return "-";

  const optionsDate = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const optionsDateTime = {
    ...optionsDate,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(date).toLocaleString(
    "en-PH",
    withTime ? optionsDateTime : optionsDate
  );
};