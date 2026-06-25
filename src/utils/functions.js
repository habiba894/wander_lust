const getImageUrl = (path) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

export { getImageUrl };
