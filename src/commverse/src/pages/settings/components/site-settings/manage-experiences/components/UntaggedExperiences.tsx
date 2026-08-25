import { useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router';
import { useGetManageExperiences } from '../../../../../../services/experience-service';
import type { ToastCardProps } from '../../../../../../types';
import { EXPERIENCE_DOMAIN, MODULE_MAP } from '../../../../../../constants';
import { Icon } from '@iconify/react';
import { experienceSectionData } from '../../../../../../data';
import Divider from '../../../../../../components/Divider';
import { useInView } from 'react-intersection-observer';
import PillLoader from '../../../../../../components/PillLoader';
import ExperienceModuleItem from './ExperienceModuleItem';

interface ContextType {
    filters: {
        q?: string;
        categoryId?: string;
        sort?: 'asc' | 'desc';
    };
    setEditing: (val: { id: string; moduleIndex: number; type: string; link?: string } | null) => void;
    setOpenCardIndex: (val: string | null) => void;
    openCardIndex: string | null;
    setToastCardProps: (val: ToastCardProps | undefined) => void;
}

const UntaggedExperiences = () => {
    const { filters, setEditing, setToastCardProps } = useOutletContext<ContextType>();
    const { ref, inView } = useInView();

    const manageExperiencesQuery = useGetManageExperiences({
        type: 'untagged',
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
        return data;
    }, [manageExperiencesQuery.data]);

    const mappedExperiences = useMemo(() => {
        return experiencesData.map((exp: any) => {
            const subdomain = exp.subdomain || exp.siteInfo?.subdomain;
            const slug = exp.slug || exp.siteInfo?.slug;

            return {
                ...exp,
                displayLink: `${subdomain}${EXPERIENCE_DOMAIN}/${slug}${MODULE_MAP[exp.type] ? `/${MODULE_MAP[exp.type]}` : `/${exp.type}`}`
            };
        });
    }, [experiencesData]);

    const totals = useMemo(() => {
        const counts: Record<string, number> = {};
        mappedExperiences.forEach((exp: any) => {
            const section = experienceSectionData.find((s: any) =>
                Array.isArray(s.type) ? s.type.includes(exp.type) : s.type === exp.type
            );
            if (section) {
                counts[section.title] = (counts[section.title] || 0) + 1;
            }
        });
        return counts;
    }, [mappedExperiences]);

    if (manageExperiencesQuery.isLoading) {
        return <div className="py-10 text-center text-neutral-gray-500">Loading untagged experiences...</div>;
    }

    if (mappedExperiences.length === 0) {
        return <div className="py-10 text-center text-neutral-gray-500">No untagged experiences found.</div>;
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="border-neutral-gray-200 flex flex-col rounded-xl border p-4 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">Untagged Experiences</div>
                    <div className="flex items-center gap-6">
                        <div className="flex gap-3">
                            {Object.entries(totals).map(([title, count]) => {
                                const section = experienceSectionData.find(s => s.title === title);
                                if (!section) return null;

                                return (
                                    <div key={title} className={`relative flex h-6 w-6 items-center justify-center rounded-md border p-1 ${section.bgClassName} text-neutral-gray-100 border-transparent`}>
                                        <Icon icon={section.icon} />
                                        <div className="bg-neutral-gray-700 text-neutral-gray-100 absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-[14px] font-semibold">
                                            {count}
                                        </div>
                                    </div>

                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    {mappedExperiences.map((exp: any, index: number) => {
                        const isLastItem = index === mappedExperiences.length - 1;
                        return (
                            <div key={exp._id} className="flex flex-col" ref={isLastItem ? ref : null}>
                                <Divider className="border-t-neutral-gray-200! mb-3! border-transparent!" />
                                <ExperienceModuleItem
                                    type={exp.type}
                                    link={exp.displayLink}
                                    onEdit={() => setEditing({ id: exp._id, moduleIndex: index, type: exp.type, link: exp.displayLink })}
                                    onCopy={() => {
                                        navigator.clipboard.writeText(`https://${exp.displayLink}`);
                                        setToastCardProps({ type: 'success', title: 'Link copied to clipboard' });
                                    }}
                                    toOpen={() => window.open(`https://${exp.displayLink}`, '_blank')}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
            {manageExperiencesQuery.isFetchingNextPage && (
                <div className="flex w-full items-center justify-center py-6">
                    <PillLoader description="" />
                </div>
            )}
        </div>
    );
};

export default UntaggedExperiences;