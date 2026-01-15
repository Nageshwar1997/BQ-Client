export const apiRoutes = {
  auth: {
    register: {
      send_otp: { method: 'POST', url: '/auth/register/send-otp' },
      resend_otp: { method: 'POST', url: '/auth/register/resend-otp' },
      verify_otp: { method: 'POST', url: '/auth/register/verify-otp' },
    },
    login: { method: 'POST', url: '/auth/login' },
    logout: { method: 'DELETE', url: '/auth/logout' },
  },
  users: {
    user: {
      details: { method: 'GET', url: '/users/user' },
      update: { method: 'PATCH', url: '/users/user/update' },
      password: {
        change: { method: 'PATCH', url: '/users/user/change-password' },
        update: { method: 'PATCH', url: '/users/user/update-password' },
        reset: { method: 'PATCH', url: '/users/user/reset-password' },
        forgot: { method: 'PATCH', url: '/users/user/forgot-password' },
        link: {
          reset_password_send: { method: 'POST', url: '/users/user/send-reset-password-link' },
          forgot_password_send: { method: 'POST', url: '/users/user/send-forgot-password-link' },
          forgot_password_resend: {
            method: 'POST',
            url: '/users/user/resend-forgot-password-link',
          },
        },
        token_validity: {
          reset_password_check: { method: 'GET', url: '/users/user/reset-password-token-validity' },
          forgot_password_check: {
            method: 'GET',
            url: '/users/user/forgot-password-token-validity',
          },
        },
      },
    },
    seller: { apply: { method: 'POST', url: '/users/seller/apply' } },
    wishlist: {
      add: { method: 'POST', url: '/users/wishlist/add' },
      remove: { method: 'DELETE', url: '/users/wishlist/remove' },
      get: { method: 'GET', url: '/users/wishlist/get' },
    },
  },
  products: {
    upload: { method: 'POST', url: '/products/upload' },
    update: { method: 'PATCH', url: '/products/product/update' },
    delete: { method: 'DELETE', url: '/products/product/delete' },
    all: { method: 'GET', url: '/products/all' },
    product: { method: 'GET', url: '/products/product' },
  },
  media: {
    image: {
      upload_single: { method: 'POST', url: '/media/image/upload' },
      upload_multiple: { method: 'POST', url: '/media/images/upload' },
      delete_single: { method: 'DELETE', url: '/media/image/delete' },
      delete_multiple: { method: 'DELETE', url: '/media/images/delete' },
    },
    video: {
      upload_single: { method: 'POST', url: '/media/video/upload' },
      upload_multiple: { method: 'POST', url: '/media/videos/upload' },
      delete_single: { method: 'DELETE', url: '/media/video/delete' },
      delete_multiple: { method: 'DELETE', url: '/media/videos/delete' },
      home_videos: { method: 'GET', url: '/media/videos/home' },
    },
  },
  reviews: {
    add_review: { method: 'POST', url: '/reviews/add' }, // NOTE - productId will be sent as param
    update_like_dislike_helpful: { method: 'PATCH', url: '/reviews/update-like-dislike-helpful' }, // NOTE - reviewId will be sent as param
    update_review: { method: 'PATCH', url: '/reviews/update' }, // NOTE - productId/reviewId will be sent as param
    delete_review: { method: 'DELETE', url: '/reviews/delete' }, // NOTE - productId/reviewId will be sent as param
    get_reviews: { method: 'GET', url: '/reviews/get' }, // NOTE - productId will be sent as param
  },
  cart_products: {
    add: { method: 'POST', url: '/cart-products/add' },
    update_quantity: { method: 'PATCH', url: '/cart-products/update' },
    remove: { method: 'DELETE', url: '/cart-products/remove' },
  },
  carts: {
    get: { method: 'GET', url: '/carts/get' },
    clear: { method: 'PATCH', url: '/carts/clear' },
  },
  addresses: {
    add: { method: 'POST', url: '/addresses/add' },
    update: { method: 'PATCH', url: '/addresses/update' },
    delete: { method: 'DELETE', url: '/addresses/delete' },
    get: { method: 'GET', url: '/addresses/get' },
  },
  orders: {
    create_order: { method: 'POST', url: '/orders/create' },
    cancel_order: { method: 'PATCH', url: '/orders/cancel' },
    cancel_payment: { method: 'PATCH', url: '/orders/cancel-payment' },
    get_all_orders: { method: 'GET', url: '/orders/all' },
    get_order_by_id: { method: 'GET', url: '/orders/order' },
  },
  blogs: {
    get_all_blogs: { method: 'GET', url: '/blogs/all' },
    get_blog_by_id: { method: 'GET', url: '/blogs/blog' },
  },
};
