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
  createSeller: { method: "POST", url: "/users/seller/create" },
  addWishlistProduct: { method: "POST", url: "/users/wishlist/add" },
  removeWishlistProduct: { method: "DELETE", url: "/users/wishlist/remove" },
  wishlist: { method: "GET", url: "/users/wishlist" },
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
  addProductToCart: { method: "POST", url: "/cart-products/add" },
  updateProductQuantityInCart: {
    method: "PATCH",
    url: "/cart-products/update",
  },
  removeProductFromCart: { method: "DELETE", url: "/cart-products/remove" },
  getUserCart: { method: "GET", url: "/carts/cart" },
};

export const addressRoutes = {
  addAddress: { method: "POST", url: "/addresses/add" },
  updateAddress: { method: "PATCH", url: "/addresses/update" },
  deleteAddress: { method: "DELETE", url: "/addresses/remove" },
  getUserAddresses: { method: "GET", url: "/addresses" },
};

export const orderRoutes = {
  createOrder: { method: "POST", url: "/orders/create" },
  getAllOrder: { method: "GET", url: "/orders" },
  getOrderById: { method: "GET", url: "/orders" },
  verifyPayment: { method: "PATCH", url: "/orders/verify-payment" },
  cancelPayment: { method: "PATCH", url: "/orders/cancel-payment" },
  cancelOrder: { method: "PATCH", url: "/orders/cancel" },
};

export const blogROutes = {
  getAllBlogs: { method: "GET", url: "/blogs/all" },
  getBlogById: { method: "GET", url: "/blogs/blog" },
};
