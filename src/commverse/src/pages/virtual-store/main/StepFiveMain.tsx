import KeyBindingsFooter from '../../../components/KeyBindingsFooter';
import StoreEditOptions from '../components/StoreEditOptions';

const StepFiveMain = () => {
  return (
    <div className="flex w-full flex-col items-start gap-10">
      StepFiveMain
      <div className="bg-neutral-gray-900 flex w-full items-center justify-around p-10">
        <StoreEditOptions variant="compact" />
      </div>
      <KeyBindingsFooter />
    </div>
  );
};

export default StepFiveMain;
