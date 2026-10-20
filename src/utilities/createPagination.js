const CreatePagination = ({ page = 1, limit = 6, totalItems }) => {
  page = Number(page);
  limit = Number(limit);

  if (!Number.isFinite(page) || page < 1) {
    page = 1;
  }

  if (!Number.isInteger(page)) {
    page = Math.floor(page);
  }

  if (!Number.isFinite(limit) || limit < 1) {
    limit = 6;
  }

  if (!Number.isInteger(limit)) {
    limit = Math.floor(limit);
  }

  if (limit > 10) {
    limit = 10;
  }

  const totalPages = Math.ceil(totalItems / limit);

  const hasNextPage = page < totalPages;

  const hasPrevPage = page > 1;

  const skip = (page - 1) * limit;

  return {
    currentPage: page,
    limit,
    skip,
    totalPages,
    totalItems,
    hasNextPage,
    hasPrevPage,
  };
};

module.exports = CreatePagination;
