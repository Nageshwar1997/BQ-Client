import { useState, useEffect } from "react";
import { HOME_DEALS_DATA } from "../data";
import HeadingWithDescription from "../../../components/ui/HeadingWithDescription";

const DealForYou = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % HOME_DEALS_DATA.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-lg shadow-lg">
      <HeadingWithDescription
        titleTexts={["Special Deals"]}
        className="py-2 text-center [&>h1]:leading-none"
        wrapperClassName="lg:[&>hr]:w-1/2 py-4"
        horizontalLine="bottom"
      />
      <div className="overflow-hidden rounded-lg">
        <img
          src={HOME_DEALS_DATA[currentIndex].img}
          alt={`Deal ${currentIndex + 1}`}
          className={`w-full object-contain scale-100 hover:scale-105 transition-transform duration-[1.5s] ease-in-out cursor-pointer`}
        />
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {HOME_DEALS_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              index === currentIndex ? "bg-primary scale-125" : "bg-tertiary"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DealForYou;
