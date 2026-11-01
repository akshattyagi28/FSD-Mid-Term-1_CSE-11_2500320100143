
function validateBook(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (data.id === undefined || data.id === null || data.id === "")
      errors.push("id is required");
    if (!data.title || typeof data.title !== "string")
      errors.push("title is required");
    if (!data.author || typeof data.author !== "string")
      errors.push("author is required");
    if (!data.category || typeof data.category !== "string")
      errors.push("category is required");
  } else {
    if (data.title !== undefined && (typeof data.title !== "string" || !data.title.trim()))
      errors.push("title must be a non-empty string");
    if (data.author !== undefined && (typeof data.author !== "string" || !data.author.trim()))
      errors.push("author must be a non-empty string");
    if (data.category !== undefined && (typeof data.category !== "string" || !data.category.trim()))
      errors.push("category must be a non-empty string");
  }

  if (!isUpdate || data.quantity !== undefined) {
    if (!Number.isInteger(data.quantity) || data.quantity < 0)
      errors.push("quantity must be a non-negative integer");
  }

  return errors;
}

module.exports = validateBook;
