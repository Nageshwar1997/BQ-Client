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
    <div className="relative w-full mx-auto overflow-hidden shadow-lg">
      <HeadingWithDescription
        titleTexts={["Special Deals"]}
        className="py-2 text-center [&>h1]:leading-none"
        wrapperClassName="lg:[&>hr]:w-1/2 py-4"
        horizontalLine="bottom"
      />
      <div className="overflow-hidden">
        <img
          src={HOME_DEALS_DATA[currentIndex].img}
          alt={`Deal ${currentIndex + 1}`}
          className={`w-full object-contain scale-100 hover:scale-105 transition-transform duration-[1.5s] ease-in-out cursor-pointer`}
        />
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 transform flex space-x-2">
        {HOME_DEALS_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all cursor-pointer ${
              index === currentIndex ? "bg-primary scale-125" : "bg-tertiary"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DealForYou;
