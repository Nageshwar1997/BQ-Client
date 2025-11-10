import { useState } from "react";
import { formatDate } from "../../utils";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";

const offersData = [
  {
    id: 1,
    title: "Makeup Must-Haves Deals",
    description:
      "Get 25% off on your favorite makeup products with code SUGAR25. Stock up on essentials today!",
    code: "SUGAR25",
    image: "/images/offers/SUGAR25.webp",
  },
  {
    id: 2,
    title: "Nail Lacquer Duo + Free Extra Gift",
    description:
      "Buy the Nail Lacquer Duo and receive a special freebie with every order. Use code NAILDUO to claim your offer!",
    code: "NAILDUO",
    image: "/images/offers/NAILDUO.webp",
  },
  {
    id: 3,
    title: "7-in-1 Manicure Kit",
    description:
      "Upgrade your nail care with the 7-in-1 Manicure Kit. Apply code NAILIT for exclusive savings!",
    code: "NAILIT",
    image: "/images/offers/NAILIT.webp",
  },
  {
    id: 4,
    title: "Tote-ally Worth It!",
    description:
      "Carry your essentials in style! Grab the exclusive tote bag using code TOTEBAG before the offer ends.",
    code: "TOTEBAG",
    image: "/images/offers/TOTEBAG.webp",
  },
  {
    id: 5,
    title: "Glitter Trousseau Box",
    description:
      "Shine bright with our Glitter Trousseau Box. Redeem this special offer with code SHINE1799 today!",
    code: "SHINE1799",
    image: "/images/offers/SHINE1799.webp",
  },
  {
    id: 6,
    title: "Enjoy 10% Off Site Wide",
    description:
      "Save 10% on all your favorite products across the site. Use code NAILIT at checkout!",
    code: "NAILIT",
    image: "/images/offers/NAILIT.webp",
  },
];

const expiredDate = (pastDays: number): Date => {
  const today = new Date();
  const result = new Date(today);
  result.setDate(today.getDate() - pastDays);
  return result;
};

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-14">
      <header className="text-center space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Exclusive Offers & Deals
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          Discover irresistible offers and exclusive beauty deals, curated just
          for you. From limited-time discounts to special bundle savings, we
          make your favorite products more accessible than ever. Treat yourself
          to premium beauty without compromise — because you deserve to glow
          every day.
        </p>
      </header>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {offersData.map((offer, index) => (
          <div
            key={offer.id}
            className="rounded-2xl overflow-hidden shadow-xl shadow-primary-8 hover:shadow-xl hover:shadow-primary-10 transition-all bg-secondary-inverted-50 flex flex-col border border-secondary-30"
          >
            <div className="relative w-full h-56 overflow-hidden rounded-t-xl p-4">
              <div
                className="absolute inset-0 bg-cover bg-center filter blur-lg scale-105 brightness-75"
                style={{ backgroundImage: `url(${offer.image})` }}
              />
              <div className="relative p-4 w-full h-full flex items-center justify-center">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1 shadow-light-dark-soft">
              <h3 className="text-xl font-semibold text-primary mb-2">
                {offer.title}
              </h3>
              <p className="text-tertiary text-sm flex-1">
                {offer.description}
              </p>
              <p className="text-sm text-secondary-50 mt-4">
                Valid Till: {formatDate(expiredDate((index + 1) * 5), "LLL")}
              </p>
              {offer.code && (
                <Button
                  pattern="secondary"
                  className="mt-4 !rounded-full !py-2 !px-4"
                  content={
                    copiedCode === offer.code
                      ? "Code Expired!" // FIXME - Copied!
                      : `Use Code: ${offer.code}`
                  }
                  buttonProps={{
                    onClick: () => handleCopy(offer.code as string),
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <hr className="w-full h-px block border-none bg-gradient-line" />
      <footer className="text-center space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          More Than Just Offers
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-4xl mx-auto">
          At <span className="font-semibold text-secondary">Beautinique</span>,
          we believe in delivering premium cosmetics that empower you to look
          and feel your best every day. Our exclusive offers are just the
          beginning — explore our curated collections, discover new favorites,
          and indulge in beauty without compromise.
        </p>
        <p className="text-base sm:text-lg text-tertiary max-w-4xl mx-auto">
          Whether you're treating yourself or finding the perfect gift,
          Beautinique ensures a delightful experience with every order. Don't
          miss out on our seasonal deals, special bundles, and loyalty rewards —
          because beauty should always be accessible and exciting.
        </p>
        <br />
        <Link to="/search" className="max-w-xs mx-auto block">
          <Button
            pattern="primary"
            content="Shop Now"
            className="!rounded-lg"
          />
        </Link>
      </footer>
    </div>
  );
};

export default Offers;
