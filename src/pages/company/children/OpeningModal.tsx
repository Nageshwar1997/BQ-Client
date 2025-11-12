import { ReactNode } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "../../../components/modal";
import { IOpening, TRoleOpening } from "../../../types";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import { zodStringRequired } from "../../../utils/zod";
import { useSendJobApplicationRequestAndMail } from "../../../api/G-form/G-form.service";
import { regexes } from "../../../constants";

interface IOpeningModal {
  isOpen: boolean;
  onClose: () => void;
  opening: TRoleOpening;
  department: IOpening["department"];
}

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div>
    <h3 className="font-semibold text-primary border-l-4 border-blue-crayola-c pl-3 mb-2 text-sm uppercase tracking-wide">
      {title}
    </h3>
    {children}
  </div>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <p className="text-secondary">
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

const Badge = ({ children }: { children: string | ReactNode }) => (
  <span className="px-3 py-1 text-xs bg-tertiary-inverted text-secondary rounded-full capitalize">
    {children}
  </span>
);

const OpeningModal = ({
  opening,
  department,
  isOpen,
  onClose,
}: IOpeningModal) => {
  const { mutateAsync, isPending } = useSendJobApplicationRequestAndMail();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        portfolio: zodStringRequired({
          field: "portfolio",
          showingFieldName: "Portfolio link",
          customRegexes: [
            { regex: regexes.validUrl, message: "must be a valid URL" },
          ],
        }),
      })
    ),
  });

  const onSubmit = async (data: { portfolio: string }) => {
    const bodyData = {
      department: department.title,
      role: opening.role,
      portfolio: data.portfolio,
      salary: opening.salary,
      experience: opening.experience,
    };

    await mutateAsync(bodyData, { onSuccess: () => (reset(), onClose()) });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      heading={opening.role}
      className="!max-w-xl [&>div>div>h2]:text-start [&>div]:pb-0"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="relative">
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-tertiary-inverted rounded-lg p-4 text-sm space-y-2">
            <DetailItem label="Title" value={opening.role} />
            <DetailItem label="Location" value={opening.location} />
            <DetailItem label="Job Type" value={opening.type} />
            <DetailItem label="Experience" value={opening.experience} />
            <DetailItem label="Salary Range" value={opening.salary} />
          </div>
          {/* Technologies */}
          {opening.technologies?.length > 0 && (
            <Section title="Technologies">
              <div className="flex flex-wrap gap-2">
                {opening.technologies.map((tech, i) => (
                  <Badge key={i}>{tech}</Badge>
                ))}
              </div>
            </Section>
          )}

          {/* Tags */}
          {opening.tags?.length > 0 && (
            <Section title="Tags">
              <div className="flex flex-wrap gap-2">
                {opening.tags.map((tag, i) => (
                  <Badge key={i}>{tag}</Badge>
                ))}
              </div>
            </Section>
          )}

          {/* Description */}
          <Section title="Job Description">
            <p className="ml-4 text-tertiary text-sm">{opening.description}</p>
          </Section>

          {/* Summary */}
          {opening.summary && (
            <Section title="Job Summary">
              <p className="ml-4 text-tertiary text-sm">{opening.summary}</p>
            </Section>
          )}

          {/* Responsibilities */}
          {opening.responsibilities?.length > 0 && (
            <Section title="Responsibilities">
              <ul className="list-disc pl-5 space-y-1  text-tertiary text-sm">
                {opening.responsibilities.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Requirements */}
          {opening.requirements?.length > 0 && (
            <Section title="Requirements">
              <ul className="list-disc pl-5 space-y-1  text-tertiary text-sm">
                {opening.requirements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Qualifications */}
          {opening.qualifications?.length > 0 && (
            <Section title="Qualifications">
              <ul className="list-disc pl-5 space-y-1  text-tertiary text-sm">
                {opening.qualifications.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {/* Benefits */}
          {opening.benefits?.length > 0 && (
            <Section title="Benefits">
              <ul className="list-disc pl-5 space-y-1  text-tertiary text-sm">
                {opening.benefits.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
        <Input
          label="Portfolio Link"
          containerClassName="mt-4"
          register={register("portfolio")}
          inputProps={{
            type: "url",
            name: "portfolio",
            placeholder: "Your Portfolio Link...",
          }}
          error={errors.portfolio?.message}
        />
        <div className="flex flex-col items-end justify-end sticky bottom-0 inset-x-0 z-10 py-4 h-24 bg-gradient-to-t from-primary-inverted to-transparent">
          <Button
            pattern="primary"
            content={isPending ? "Applying..." : "Apply Now"}
            buttonProps={{ type: "submit", disabled: isPending }}
          />
        </div>
      </form>
    </Modal>
  );
};

export default OpeningModal;
