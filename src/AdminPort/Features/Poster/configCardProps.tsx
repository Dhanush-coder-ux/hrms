import { pageTheme } from "../../../Themes/PageThems/pageConfig";

interface ConfigCardProps {
    title: string;
    icon: React.ElementType;
    count: number;
    children: React.ReactNode;
}

export const ConfigCard = ({ title, icon: Icon, count, children }: ConfigCardProps) => (
    <div className={pageTheme.section.card}>
        <div className={pageTheme.section.header}>
            <div className={pageTheme.section.title}>
                <span className={pageTheme.section.titleDot} />
                <Icon size={14} className="text-primary ml-1" />
                {title}
            </div>
            <span className={pageTheme.section.countBadge}>{count} Active</span>
        </div>
        {children}
    </div>
);
