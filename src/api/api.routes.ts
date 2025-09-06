export const authRoutes = {
  register: { method: "POST", url: "/auth/register" },
  login: { method: "POST", url: "/auth/login" },
};

export const productRoutes = {
  // uploadProduct: { method: "POST", url: "/products/upload" },
  // updateProduct: { method: "PATCH", url: "/products/product/update" },
  getAllProducts: { method: "GET", url: "/products/all" },
  getProductById: { method: "GET", url: "/products/product" },
  // deleteProduct: { method: "DELETE", url: "/products/product/delete" },
};

export const userRoutes = {
  getUser: { method: "GET", url: "/users/user" },
};

export const mediaRoutes = {
  // For Images
  // uploadSingleImage: { method: "POST", url: "/media/image/upload" },
  // uploadMultipleImages: { method: "POST", url: "/media/images/upload" },
  // deleteSingleImage: { method: "DELETE", url: "/media/image/delete" },
  // deleteMultipleImages: { method: "DELETE", url: "/media/images/delete" },
  // For Videos
  getHomeVideos: { method: "GET", url: "/media/videos/home" },
};

export const reviewRoutes = {
  addReview: { method: "POST", url: "/reviews" },
  updateLikeDislikeHelpful: { method: "PATCH", url: "/reviews" },
  getReviewsByProductId: { method: "GET", url: "/reviews" },
};

export const cartRoutes = {
  addProductToCart: { method: "POST", url: "cart-products/add" },
};
