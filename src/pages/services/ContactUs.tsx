import z from "zod";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Textarea from "../../components/input/Textarea";
import { formatPhoneNumber } from "../../utils";
import { socialMediaLinks } from "../../components/footer/data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactUsSchema } from "../../schemas/contact-us";
import { useSendContactRequestAndMail } from "../../api/G-form/G-form.service";

const ContactUs = () => {
  const { mutateAsync, isPending } = useSendContactRequestAndMail();
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: { name: "", email: "", phoneNumber: "", message: "" },
  });

  const onSubmit = async (data: z.infer<typeof contactUsSchema>) => {
    mutateAsync(data, {
      onSuccess: () => reset(),
    });
  };

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
      <div className="px-4 md:px-8 py-12 space-y-12 max-w-4xl mx-auto">
        <div className="shadow-neumorphic-layered rounded-2xl overflow-hidden">
          <div className="shadow-light-dark-soft p-6 sm:p-8 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-6 text-primary">
              Send Us a Message
            </h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-7 w-full"
            >
              <Input
                label="Name"
                register={register("name")}
                error={errors.name?.message}
                inputProps={{
                  placeholder: "Enter your name...",
                  type: "text",
                  name: "name",
                  autoComplete: "name",
                }}
              />
              <Input
                label="Email"
                register={register("email")}
                error={errors.email?.message}
                inputProps={{
                  placeholder: "Enter your email...",
                  type: "text",
                  name: "email",
                  autoComplete: "email",
                }}
              />
              <Input
                label="Phone Number"
                register={register("phoneNumber")}
                error={errors.phoneNumber?.message}
                inputProps={{
                  placeholder: "Enter your phone number...",
                  type: "number",
                  name: "phoneNumber",
                  autoComplete: "tel",
                }}
                icons={{ left: { text: "+91" } }}
              />
              <Textarea
                label="Message"
                containerClassName="[&>div]:h-24"
                register={register("message")}
                error={errors.message?.message}
                textAreaProps={{
                  placeholder: "Enter your message...",
                  cols: 5,
                  name: "message",
                  autoComplete: "off",
                }}
              />
              <Button
                pattern="primary"
                content={isPending ? "Sending..." : "Send Message"}
                buttonProps={{ type: "submit", disabled: isPending }}
              />
            </form>
          </div>
        </div>
        <hr className="w-full h-px block border-none bg-gradient-line" />
        {/* Contact Info */}
        <div className="shadow-neumorphic-layered rounded-2xl">
          <div className="h-full shadow-light-dark-soft p-6 sm:p-8 flex flex-col justify-center space-y-6">
            <h2 className="text-2xl font-semibold bg-clip-text bg-silver-duo text-transparent text-center">
              Contact Information
            </h2>
            <p className="text-secondary">
              Have questions about our products or orders? Reach us through:
            </p>
            <div className="flex flex-col gap-4 text-secondary">
              <strong>
                Email:{" "}
                <Link
                  to="mailto:beautinique.bq@gmail.com"
                  className="bg-clip-text bg-accent-duo text-transparent"
                >
                  beautinique.bq@gmail.com
                </Link>
              </strong>
              <strong>
                Phone:{" "}
                <Link
                  to="tel:+919730870409"
                  className="bg-clip-text bg-accent-duo text-transparent"
                >
                  {formatPhoneNumber("9730870409")}
                </Link>
              </strong>
              <strong>
                Address:{" "}
                <Link
                  to="/store-locator"
                  className="bg-clip-text bg-accent-duo text-transparent"
                >
                  21, At. Amdura Po. Mugat Tq. Mudkhed Dist. Nanded,
                  Maharashtra, 431605 India
                </Link>
              </strong>
            </div>
            {/* Social Media */}
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
