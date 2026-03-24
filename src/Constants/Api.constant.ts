export const API_ROUTES_AND_METHODS = {
  auth: {
    register: {
      send_otp: { method: 'POST', url: '/auth/register/send-otp' },
      resend_otp: { method: 'POST', url: '/auth/register/resend-otp' },
      verify_otp: { method: 'POST', url: '/auth/register/verify-otp' },
    },
    login: { method: 'POST', url: '/auth/login' },
    logout: { method: 'DELETE', url: '/auth/logout' },
    password: {
      send_forgot_password_link_and_otp: {
        method: 'POST',
        url: '/auth/send-forgot-password-link-and-otp',
      },
      resend_forgot_password_link_and_otp: {
        method: 'POST',
        url: '/auth/resend-forgot-password-link-and-otp',
      },
      verify_forgot_password_otp: { method: 'POST', url: '/auth/verify-forgot-password-otp' },
      validate_forgot_password_token: {
        method: 'GET',
        url: '/auth/validate-forgot-password-token',
      },
      set_forgot_password: { method: 'PATCH', url: '/auth/set-forgot-password' },
    },
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
      get: { method: 'GET', url: '/users/wishlist' },
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
    like_dislike_helpful: { method: 'PATCH', url: '/reviews/update-like-dislike-helpful' }, // NOTE - reviewId will be sent as param
    update_review: { method: 'PATCH', url: '/reviews/update' }, // NOTE - productId/reviewId will be sent as param
    delete_review: { method: 'DELETE', url: '/reviews/delete' }, // NOTE - productId/reviewId will be sent as param
    get_reviews_by_product_id: { method: 'GET', url: '/reviews/get' }, // NOTE - productId will be sent as param
  },
  cart_products: {
    add: { method: 'POST', url: '/cart-products/add' },
    update_quantity: { method: 'PATCH', url: '/cart-products/update' },
    remove: { method: 'DELETE', url: '/cart-products/remove' },
  },
  carts: {
    get: { method: 'GET', url: '/carts' },
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
  g_form: {
    contact_us: { method: 'POST', url: '/forms/contact-us' },
    job_application: { method: 'POST', url: '/forms/job-application' },
  },
};

export const QUERY_KEYS = {
  auth: {
    register: {
      send_otp: ['register_send_otp'],
      resend_otp: ['register_resend_otp'],
      verify_otp: ['verify_otp_and_register'],
    },
    login: ['login'],
    logout: ['logout'],
    password: {
      send_forgot_password_link_and_otp: ['send_forgot_password_link_and_otp'],
      resend_forgot_password_link_and_otp: ['resend_forgot_password_link_and_otp'],
      verify_forgot_password_otp: ['verify_forgot_password_otp'],
      validate_forgot_password_token: ['validate_forgot_password_token'],
      set_forgot_password: ['set_forgot_password'],
    },
  },
  users: {
    user: {
      details: ['get_user'],
      update: ['update_user'],
      password: {
        change: ['change_password'],
        update: ['update_password'],
        reset: ['reset_password'],
        forgot: ['forgot_password'],
        link: {
          reset_password_send: ['send_reset_password_link'],
          forgot_password_send: ['send_forgot_password_link'],
          forgot_password_resend: ['resend_forgot_password_link'],
        },
        token_validity: {
          reset_password_check: ['reset_password_token_validity'],
          forgot_password_check: ['forgot_password_token_validity'],
        },
      },
    },
    seller: { apply: ['apply_seller'] },
    wishlist: {
      add: ['add_product_to_wishlist'],
      remove: ['remove_product_from_wishlist'],
      get: ['get_user_wishlist'],
    },
  },
  products: {
    upload: ['upload_product'],
    update: ['update_product'],
    delete: ['delete_product'],
    all: ['get_all_products'],
    product: ['get_product_by_id'],
  },
  media: {
    image: {
      upload_single: ['upload_single_image'],
      upload_multiple: ['upload_multiple_image'],
      delete_single: ['delete_single_image'],
      delete_multiple: ['delete_multiple_image'],
    },
    video: {
      upload_single: ['upload_single_video'],
      upload_multiple: ['upload_multiple_video'],
      delete_single: ['delete_single_video'],
      delete_multiple: ['delete_multiple_video'],
      home_videos: ['home_videos'],
    },
  },
  reviews: {
    add_review: ['add_review'],
    like_dislike_helpful: ['like_dislike_helpful'],
    update_review: ['update_review'],
    delete_review: ['delete_review'],
    get_reviews_by_product_id: ['get_reviews_by_product_id'],
  },
  cart_products: {
    add: ['add_to_cart'],
    update_quantity: ['update_cart_quantity'],
    remove: ['remove_from_cart'],
  },
  carts: { get: ['get_cart'], clear: ['clear_cart'] },
  addresses: {
    add: ['add_address'],
    update: ['update_address'],
    delete: ['delete_address'],
    get: ['get_addresses'],
  },
  orders: {
    create_order: ['create_order'],
    cancel_order: ['cancel_order'],
    cancel_payment: ['cancel_payment'],
    get_all_orders: ['get_all_orders'],
    get_order_by_id: ['get_order_by_id'],
  },
  blogs: { get_all_blogs: ['get_all_blogs'], get_blog_by_id: ['get_blog_by_id'] },
  g_form: { contact_us: ['contact_us'], job_application: ['job_application'] },
} as const;
