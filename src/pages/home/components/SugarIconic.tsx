import HeadingWithDescription from "../../../components/ui/HeadingWithDescription";
import { SUGAR_ICONICS_DATA } from "../data";

const SugarIconic = () => {
  return (
    <div className="relative w-full mx-auto shadow-lg px-[5%]">
      <HeadingWithDescription
        titleTexts={["Sugar Iconics In-Focus"]}
        className="py-2 text-center [&>h1]:leading-none"
        wrapperClassName="lg:[&>hr]:w-2/3 py-4"
        horizontalLine="bottom"
      />
      <div className="grid sm:grid-cols-3 gap-5 place-items-center">
        {SUGAR_ICONICS_DATA.map((item, index) => (
          <div key={index} className="overflow-hidden rounded max-w-[400px]">
            <img
              src={item.img}
              alt={`Sugar Iconic ${index}`}
              className={`w-full object-contain scale-100 hover:scale-105 transition-transform duration-[1.5s] ease-in-out cursor-pointer`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SugarIconic;
