import Modal from "../../../components/modal";
import { TRoleOpening } from "../../../types";

interface IOpeningModal {
  isOpen: boolean;
  onClose: () => void;
  opening: TRoleOpening;
}

const OpeningModal = ({ opening, isOpen, onClose }: IOpeningModal) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      heading={opening.role}
      className="max-w-xl [&>div>div>h2]:text-start"
    >
      <div className="job-details">
        <p>
          <strong>Title:</strong> {opening.role}
        </p>
        <p>
          <strong>Location:</strong> {opening.location}
        </p>
        <p>
          <strong>Job Type:</strong> {opening.type}
        </p>
        <p>
          <strong>Salary Range:</strong> {opening.salary}
        </p>
        <p>
          <strong>Job Description:</strong> {opening.description}
        </p>
        <p>
          <strong>Job Summary:</strong> {opening.summary}
        </p>

        <div>
          <strong>Responsibilities:</strong>
          <ul>
            {opening.responsibilities?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <strong>Requirements:</strong>
          <ul>
            {opening.requirements?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        {opening.qualifications && (
          <div>
            <strong>Qualifications:</strong>
            <ul>
              {opening.qualifications?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
        {opening.technologies.length > 0 && (
          <div>
            <strong>Technologies:</strong>
            <ul>
              {opening.technologies?.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}
        {opening.tags.length > 0 && (
          <div>
            <strong>Tags:</strong>
            <ul>
              {opening.tags?.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        )}
        {opening.benefits && (
          <div>
            <strong>Benefits:</strong>
            <ul>
              {opening.benefits?.map((benefit, index) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OpeningModal;
