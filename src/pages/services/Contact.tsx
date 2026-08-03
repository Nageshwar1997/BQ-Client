import { COUNTRIES_MAP } from '@beautinique/frontend-constants';
import type { TCreateContactQueryZodSchema } from '@beautinique/frontend-types';
import { createContactQueryZodSchema } from '@beautinique/frontend-zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { Controller, useForm } from 'react-hook-form';

import { StaticPageHeader, StaticPageLayout } from '@/components/layout/static-page';
import Button from '@/components/ui/Button';
import Divider from '@/components/ui/Divider';
import GradientText from '@/components/ui/GradientText';
import Input from '@/components/ui/inputs/Input';
import Select from '@/components/ui/inputs/Select';
import Textarea from '@/components/ui/inputs/Textarea';
import { CONTACT_INPUT_MAP_DATA } from '@/constants/input.constants';
import { useCreateContactQuery } from '@/services/organization-service/contact.service.query';

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
    value: 'Mon-Sat, 10 AM - 7 PM IST',
  },
  {
    icon: 'solar:map-point-linear',
    title: 'Based In',
    value: COUNTRIES_MAP.India,
  },
] as const;

const Contact = () => {
  const createContact = useCreateContactQuery();

  const { control, register, handleSubmit, formState, reset } =
    useForm<TCreateContactQueryZodSchema>({
      resolver: zodResolver(createContactQueryZodSchema),
    });

  const onSubmit = async (data: TCreateContactQueryZodSchema) => {
    await createContact.mutateAsync(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:chat-round-dots-linear"
        title="Contact Us"
        description="Have a question, feedback, or just want to say hi? Send us a message, or reach out directly using the details below."
      />

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
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CONTACT_INPUT_MAP_DATA.map((input) => {
            const { label, name, placeholder, type } = input;
            return type === 'select' ? (
              <Controller
                key={name}
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label={label}
                    error={formState.errors[name]?.message}
                    options={input.options}
                    selectProps={{ value, onChange, placeholder }}
                  />
                )}
              />
            ) : type === 'textarea' ? (
              <Textarea
                key={name}
                label={label}
                register={register(name)}
                error={formState.errors[name]?.message}
                containerClassName="sm:col-span-2"
                textAreaProps={{ name, placeholder, autoComplete: input.autoComplete }}
              />
            ) : (
              <Input
                key={name}
                label={label}
                register={register(name)}
                error={formState.errors[name]?.message}
                inputProps={{
                  name,
                  type,
                  placeholder,
                  autoComplete: input.autoComplete,
                }}
                icons={{
                  ...(type === 'number' && {
                    left: (
                      <span className="text-primary/50 border-r-primary/30 items-center border-r py-2 pr-3 text-[13px] leading-0 capitalize">
                        +91
                      </span>
                    ),
                  }),
                }}
              />
            );
          })}
          <Button
            pattern="primary"
            content="Send Message"
            className="sm:w-fit"
            buttonProps={{ type: 'submit' }}
          />
        </form>
      </section>
    </StaticPageLayout>
  );
};

export default Contact;
