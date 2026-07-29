import { z } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';

import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Textarea from '@/components/ui/inputs/Textarea';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.email('Please enter a valid email'),
  phoneNumber: z
    .string()
    .min(10, 'Please enter a valid 10-digit phone number')
    .max(10, 'Please enter a valid 10-digit phone number'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type TContactFormSchema = z.infer<typeof contactFormSchema>;

const CONTACT_DETAILS = [
  {
    icon: 'solar:letter-linear',
    title: 'Email',
    value: 'beautinique.bq@gmail.com',
    href: 'mailto:beautinique.bq@gmail.com',
  },
  {
    icon: 'solar:phone-linear',
    title: 'Call / WhatsApp',
    value: '+91 97308 70409',
    href: 'https://wa.me/+919730870409',
  },
  {
    icon: 'solar:clock-circle-linear',
    title: 'Support Hours',
    value: 'Mon–Sat, 10 AM – 7 PM IST',
  },
  {
    icon: 'solar:map-point-linear',
    title: 'Based In',
    value: 'India',
  },
] as const;

const Contact = () => {
  const { register, handleSubmit, formState, reset } = useForm<TContactFormSchema>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = (values: TContactFormSchema) => {
    // eslint-disable-next-line no-console
    console.log(values);
    reset();
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="bg-accent-duo flex size-16 items-center justify-center rounded-full shadow-lg sm:size-20">
          <Icon icon="solar:chat-round-dots-linear" className="size-8 text-white sm:size-10" />
        </span>
        <GradientText
          type="accent"
          text="Contact Us"
          className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
        />
        <p className="text-secondary max-w-2xl text-sm sm:text-base">
          Have a question, feedback, or just want to say hi? Send us a message, or reach out
          directly using the details below.
        </p>
      </div>

      <Divider />

      {/* Contact Details */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CONTACT_DETAILS.map((detail) => {
          const content = (
            <>
              <span className="bg-accent-duo flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={detail.icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary/50 text-xs">{detail.title}</p>
                <p className="text-primary text-sm font-medium sm:text-base">{detail.value}</p>
              </div>
            </>
          );

          const className =
            'border-primary/10 bg-secondary-invert hover:border-primary/20 flex items-center gap-3 rounded-xl border p-4 transition-colors';

          return 'href' in detail ? (
            <a key={detail.title} href={detail.href} className={className}>
              {content}
            </a>
          ) : (
            <div key={detail.title} className={className}>
              {content}
            </div>
          );
        })}
      </section>

      <Divider />

      {/* Contact Form */}
      <section className="flex flex-col gap-4">
        <GradientText
          type="accent"
          text="Send Us a Message"
          className="text-xl font-semibold sm:text-2xl"
        />
        <form
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event);
          }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <Input
            label="Name"
            register={register('name')}
            error={formState.errors.name?.message}
            inputProps={{ name: 'name', type: 'text', autoComplete: 'name' }}
          />
          <Input
            label="Email"
            register={register('email')}
            error={formState.errors.email?.message}
            inputProps={{ name: 'email', type: 'text', autoComplete: 'email' }}
          />
          <Input
            label="Phone Number"
            register={register('phoneNumber')}
            error={formState.errors.phoneNumber?.message}
            inputProps={{ name: 'phoneNumber', type: 'number', autoComplete: 'tel' }}
            icons={{
              left: (
                <span className="text-primary/50 border-r-primary/30 items-center border-r py-2 pr-3 text-[13px] leading-0 capitalize">
                  +91
                </span>
              ),
            }}
          />
          <Textarea
            label="Message"
            register={register('message')}
            error={formState.errors.message?.message}
            containerClassName="sm:col-span-2"
            textAreaProps={{ name: 'message', placeholder: 'How can we help?', rows: 5 }}
          />
          <Button
            pattern="primary"
            content="Send Message"
            className="sm:w-fit"
            buttonProps={{ type: 'submit' }}
          />
        </form>
      </section>
    </div>
  );
};

export default Contact;
