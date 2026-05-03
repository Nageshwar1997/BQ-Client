export const LOADING_RINGS_DATA = [
  {
    border: { side: 'borderBottomWidth', color: 'red' },
    rotation: { rx: 45, ry: -45, z: 0 },
  },
  {
    border: { side: 'borderRightWidth', color: 'green' },
    rotation: { rx: 55, ry: 15, z: 90 },
  },
  {
    border: { side: 'borderTopWidth', color: 'blue' },
    rotation: { rx: 40, ry: 65, z: 180 },
  },
  {
    border: { side: 'borderLeftWidth', color: 'yellow' },
    rotation: { rx: 50, ry: -25, z: 270 },
  },
] as const;

export const BEAUTY_FACTS = [
  `The term <span class=gradient-text-accent>"Clean Beauty"</span> refers to skincare and makeup products made without harmful chemicals and toxins.`,
  `In <span class=gradient-text-accent>"1915"</span>, Maurice Levy invented the first <span class=gradient-text-accent>"twist-up lipstick"</span>, revolutionizing the beauty industry.`,
  `The first-ever commercial mascara, <span class=gradient-text-accent>"Maybelline Cake Mascara"</span>, was introduced in <span class=gradient-text-accent>"1917"</span>.`,
  `<span class=gradient-text-accent>BB Cream (2011)</span> became a global sensation by combining skincare and foundation into one product.`,
  `The first <span class=gradient-text-accent>cruelty-free certification</span> was introduced in <span class=gradient-text-accent>"1996"</span> to support ethical beauty practices.`,
  `<span class=gradient-text-accent>Vegan beauty</span> is on the rise, with brands formulating products without any animal-derived ingredients.`,
  `Dermatologists recommend <span class=gradient-text-accent>SPF 30+</span> for daily sun protection to prevent premature aging and skin damage.`,
  `<span class=gradient-text-accent>Serums</span> contain concentrated active ingredients that penetrate deeper into the skin for enhanced benefits.`,
  `<span class=gradient-text-accent>Micellar Water</span> is a gentle yet effective way to cleanse the skin without rinsing, perfect for all skin types.`,
  `The world's first <span class=gradient-text-accent>organic beauty brand</span> was founded in <span class=gradient-text-accent>1978</span>, paving the way for natural cosmetics.`,
  `Some beauty brands use <span class=gradient-text-accent>AI-powered tools</span> to personalize skincare recommendations based on user preferences.`,
  `<span class=gradient-text-accent>Hyaluronic Acid</span> is a powerful hydrating ingredient that can hold up to 1,000 times its weight in water.`,
  `<span class=gradient-text-accent>Retinol</span> is a dermatologist-approved ingredient known for reducing fine lines and improving skin texture.`,
  `<span class=gradient-text-accent>Green Beauty</span> focuses on sustainable packaging and eco-friendly formulations to reduce environmental impact.`,
  `<span class=gradient-text-accent>Sheet masks</span> originated in Indian and have become a staple in self-care and skincare routines worldwide.`,
  `The global <span class=gradient-text-accent>cosmetic industry</span> is expected to reach <span class=gradient-text-accent>$500 billion</span> by <span class=gradient-text-accent>2026</span>.`,
  `The first-ever <span class=gradient-text-accent>waterproof mascara</span> was developed in <span class=gradient-text-accent>1938</span> and changed the beauty game.`,
  `The first <span class=gradient-text-accent>liquid foundation</span> was launched in the <span class=gradient-text-accent>1950s</span>, offering a more natural finish.`,
  `The term "glass skin" was popularized by <span class=gradient-text-accent>Indian beauty</span> trends, emphasizing dewy, radiant skin.`,
  `The first commercial <span class=gradient-text-accent>lip gloss</span> was introduced by Max Factor in <span class=gradient-text-accent>1930</span>.`,
  `In the early <span class=gradient-text-accent>2000s</span>, mineral makeup became a sought-after trend for its natural ingredients and skin benefits.`,
  `The <span class=gradient-text-accent>Beauty Blender,</span> launched in <span class=gradient-text-accent>2007</span>, transformed the way people applied foundation.`,
  `<span class=gradient-text-accent>Facial oils</span> have gained popularity for their nourishing and hydrating properties, even for oily skin types.`,
  `Some brands are experimenting with <span class=gradient-text-accent>AI makeup try-ons</span> to help users choose the perfect shade before purchasing.`,
  `The concept of a <span class=gradient-text-accent>beauty subscription box</span> allows customers to try new products every month.`,
  `Some experts believe that <span class=gradient-text-accent>customized skincare</span> could be the future of the beauty industry.`,
  'Others caution about potential risks of certain <span class=gradient-text-accent>skincare ingredients,</span> such as parabens and sulfates.',
  `The development of <span class=gradient-text-accent>sustainable beauty</span> aims to reduce plastic waste and promote ethical sourcing.`,
  `Despite trends, timeless beauty practices like <span class=gradient-text-accent>hydration</span> and <span class=gradient-text-accent>healthy eating</span> remain essential for glowing skin.`,
  `The first known use of the term <span class=gradient-text-accent>"cosmeceuticals"</span> was in <span class=gradient-text-accent>1984</span> to describe skincare products with medical benefits.`,
  `<span class=gradient-text-accent>Fermented skincare</span> is gaining popularity for its probiotic benefits that improve skin health.`,
  `<span class=gradient-text-accent>Beauty influencers</span> have a huge impact on the cosmetic industry, shaping trends and product demands.`,
  '<span class=gradient-text-accent>AR beauty</span> apps are helping customers try on makeup virtually before making a purchase.',
  `The concept of <span class=gradient-text-accent>smart skincare devices</span> is transforming beauty routines with AI-powered technology.`,
  'Some companies are developing <span class=gradient-text-accent>biodegradable glitter</span> to make beauty more sustainable.',
  `The future of <span class=gradient-text-accent>clean beauty</span> is focused on transparency, sustainability, and effective formulations.`,
  `The first <span class=gradient-text-accent>fragrance-free makeup line</span> was launched in <span class=gradient-text-accent>1980</span> to cater to sensitive skin.`,
  `The term <span class=gradient-text-accent>dermocosmetics</span> is used for products that bridge the gap between skincare and dermatology.`,
  `The rise of <span class=gradient-text-accent>gender-neutral beauty</span> is redefining the industry with inclusive products for all.`,
  `<span class=gradient-text-accent>Biodegradable packaging</span> is becoming more common in the beauty industry to reduce waste.`,
  `<span class=gradient-text-accent>Refillable makeup</span> is a growing trend that allows users to reuse packaging and minimize waste.`,
  `The first commercial <span class=gradient-text-accent>nail polish</span> was inspired by automobile paint and introduced in <span class=gradient-text-accent>1932</span>.`,
  `The term <span class=gradient-text-accent>"blue beauty"</span> refers to eco-conscious products designed to protect ocean ecosystems.`,
  `<span class=gradient-text-accent>Glass packaging</span> is being used more in luxury beauty to reduce plastic waste and enhance sustainability.`,
];

export const LAST_ROUTE_KEY = 'lastRoute' as const;
export const USER_KEY = 'user' as const;

export const ROUTE_ACCESS = {
  PRIVATE: ['/auth/change-password', '/auth/set-password'],
  SOCIAL_ONLY: ['/auth/set-password'],
  GUEST_ONLY: ['/auth', '/auth/register', '/auth/forgot-password', '/auth/oauth'],
};
