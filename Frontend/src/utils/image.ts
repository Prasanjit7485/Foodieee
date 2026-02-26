export const buildImageUrl = (image?: string) => {
  if (!image) return "https://via.placeholder.com/400x250";

return `http://localhost:8080/uploads/${image}`;
};