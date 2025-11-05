import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Textarea from "../../components/input/Textarea";
import { formatPhoneNumber } from "../../utils";
import { socialMediaLinks } from "../../components/footer/data";

const ContactUs = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">
      <header className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Get in Touch
        </h1>
        <p className="text-base sm:text-lg text-tertiary">
          We'd love to hear from you! Reach out with any questions or feedback.
        </p>
      </header>
      <div className="px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="shadow-neumorphic-layered rounded-2xl overflow-hidden">
          <div className="shadow-light-dark-soft p-8 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Send Us a Message
            </h2>
            <form className="space-y-7 w-full">
              <Input
                label="Name"
                needRef={true}
                inputProps={{ placeholder: "Enter your name...", type: "text" }}
              />
              <Input
                label="Email"
                inputProps={{
                  placeholder: "Enter your email...",
                  type: "text",
                }}
              />
              <Input
                label="Phone Number"
                inputProps={{
                  placeholder: "Enter your phone number...",
                  type: "number",
                }}
                icons={{ left: { text: "+91" } }}
              />
              <Textarea
                label="Message"
                containerClassName="[&>div]:h-24"
                textAreaProps={{
                  placeholder: "Enter your message...",
                  cols: 5,
                }}
              />
              <Button
                pattern="primary"
                content="Submit"
                buttonProps={{ type: "submit" }}
              />
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="shadow-neumorphic-layered rounded-2xl overflow-hidden">
          <div className="h-full shadow-light-dark-soft p-8 flex flex-col justify-center space-y-6">
            <h2 className="text-2xl font-semibold text-primary text-center">
              Contact Information
            </h2>
            <p className="text-secondary">
              Have questions about our products or orders? Reach us through:
            </p>
            <div className="space-y-4 text-secondary">
              <div>
                <span className="font-semibold">Email:</span>{" "}
                <a
                  href="mailto:beautinique.bq@gmail.com"
                  className="text-picton-blue-c hover:underline"
                >
                  beautinique.bq@gmail.com
                </a>
              </div>
              <div>
                <strong>Phone:</strong>{" "}
                <Link to="tel:+911234567890" className="hover:underline">
                  {formatPhoneNumber("9730870409")}
                </Link>
              </div>
              <div>
                <span className="font-semibold">Address:</span> 21, At. Amdura
                Po. Mugat Tq. Mudkhed Dist. Nanded, Maharashtra, 431605 India
              </div>
            </div>

            <div className="flex items-center justify-center flex-wrap gap-4 mt-4">
              {socialMediaLinks.map((item) => (
                <Link
                  to={item.url}
                  key={item.id}
                  target="_blank"
                  className={`[&>svg]:w-10 [&>svg]:h-10 [&>svg>_g]:fill-primary-inverted [&>svg>path]:fill-primary-battleship-davys-gray-inverted cursor-pointer ${
                    [5, 6].includes(item.id) ? "[&>svg]:p-[5px]" : ""
                  } ${
                    [2].includes(item.id)
                      ? "[&>svg]:p-[2px] [&>svg]:pb-[3px]"
                      : ""
                  } ${[3, 4].includes(item.id) ? "[&>svg]:pb-[2px]" : ""}`}
                >
                  {item.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
