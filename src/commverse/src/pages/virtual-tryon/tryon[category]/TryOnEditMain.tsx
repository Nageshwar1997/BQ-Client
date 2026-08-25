import { useParams } from 'react-router';
import { useGetExperienceById } from '../../../services/experience-services';
import { lazy, useMemo } from 'react';
import EditTryOnCategory from './EditTryOnCategory';
import Loader from '../../../components/Loader';
const FashionTryOn = lazy(() => import('../../fashion-tryon'));

const TryOnEditMain = () => {
  const { expId } = useParams();
  const getExperienceByIdQuery = useGetExperienceById(expId ?? '');

  const draftData = useMemo(() => {
    return (
      JSON.parse(getExperienceByIdQuery.data?.data?.draftData ?? '{}') || {}
    );
  }, [getExperienceByIdQuery.data?.data?.draftData]);

  if (getExperienceByIdQuery.isPending) {
    return <Loader section="virtual-try-on" />;
  }

  if (draftData.subCategory) {
    return <EditTryOnCategory />;
  } else {
    return <FashionTryOn />;
  }
};

export default TryOnEditMain;
