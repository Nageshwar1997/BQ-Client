import { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { useGetManageExperiences } from '../../../../../../services/experience-service';
import ExperienceCard from './ExperienceCard';
import type { ToastCardProps } from '../../../../../../types';
import { EXPERIENCE_DOMAIN, MODULE_MAP } from '../../../../../../constants';
import { useInView } from 'react-intersection-observer';
import PillLoader from '../../../../../../components/PillLoader';
import { getImageUrl } from '../../../../../../lib/utils';

interface ContextType {
    filters: {
        q?: string;
        categoryId?: string;
        sort?: 'asc' | 'desc';
    };
    setEditing: (val: { id: string; moduleIndex: number } | null) => void;
    setOpenCardIndex: (val: string | null) => void;
    openCardIndex: string | null;
    setToastCardProps: (val: ToastCardProps | undefined) => void;
}

const TaggedExperiences = () => {
    const { filters, setOpenCardIndex, openCardIndex } = useOutletContext<ContextType>();
    const { ref, inView } = useInView();

    const manageExperiencesQuery = useGetManageExperiences({
        type: 'tagged',
        search: filters.q,
        categoryId: filters.categoryId,
        sort: filters.sort,
        limit: 10,
    });

    useEffect(() => {
        if (inView && manageExperiencesQuery.hasNextPage && !manageExperiencesQuery.isFetchingNextPage) {
            manageExperiencesQuery.fetchNextPage();
        }
    }, [inView, manageExperiencesQuery.hasNextPage, manageExperiencesQuery.fetchNextPage, manageExperiencesQuery.isFetchingNextPage]);

    const experiencesData = useMemo(() => {
        const data = (manageExperiencesQuery.data as any)?.data || [];
        return data.map((p: any) => ({
            id: p._id,
            data: {
                image: getImageUrl(p.media?.images?.[0]?.url),
                title: p.productName,
                category: p.category?.name || 'Category',
                price: `₹${p.price?.amount || 0}`,
                modules: p.experiences.map((exp: any) => {
                    const subdomain = exp.subdomain || exp.siteInfo?.subdomain;
                    const slug = exp.slug || exp.siteInfo?.slug;

                    return {
                        type: exp.type,
                        link: `${subdomain}${EXPERIENCE_DOMAIN}/${slug}${MODULE_MAP[exp.type] ? `/${MODULE_MAP[exp.type]}` : `/${exp.type}`}`,
                        count: 1,
                    };
                }),
            },
        }));
    }, [manageExperiencesQuery.data]);

    if (manageExperiencesQuery.isLoading) {
        return <div className="py-10 text-center text-neutral-gray-500">Loading tagged experiences...</div>;
    }

    if (experiencesData.length === 0) {
        return <div className="py-10 text-center text-neutral-gray-500">No tagged experiences found.</div>;
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
                {experiencesData.map((exp: any, index: number) => (
                    <div key={exp.id} ref={index === experiencesData.length - 1 ? ref : null}>
                        <ExperienceCard
                            id={exp.id}
                            data={exp.data}
                            isOpen={openCardIndex === exp.id}
                            onToggle={() => setOpenCardIndex(openCardIndex === exp.id ? null : exp.id)}
                        />
                    </div>
                ))}
            </div>

            {manageExperiencesQuery.isFetchingNextPage && (
                <div className="flex w-full items-center justify-center py-6">
                    <PillLoader description="" />
                </div>
            )}
        </div>
    );
};

export default TaggedExperiences;
