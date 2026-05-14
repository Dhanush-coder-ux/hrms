import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import { pageTheme } from "../../../Themes/PageThems/pageConfig";
import { RequirementTable } from "./Requirement/RequirementTable";
import { RequirementDrawer } from "./Requirement/Components/RequirementDrawer";
import StatCard from "../../../Components/Common/StatCard";

export const Requirement = () => {
    const navigate = useNavigate();
    const [selectedRequirement, setSelectedRequirement] = useState<any | null>(null);
    const [stats, setStats] = useState({ total: 0 });

    const handleOpenDrawer = (requirement: any) => {
        setSelectedRequirement(requirement);
    };

    const handleCloseDrawer = () => {
        setSelectedRequirement(null);
    };

    const handleOpenFullProfile = (id: string) => {
        navigate(`/onboard/requirement/${id}`);
    };

    return (
        <div className={pageTheme.layout.mainContainer}>
            {/* HEADER */}
            <div className={pageTheme.header.wrapper}>
                <div className="flex flex-col">
                    <div className={pageTheme.header.pill}>
                        <Calendar size={12} />
                        <span>Interview Pipeline</span>
                    </div>
                    <h1 className={pageTheme.header.title}>Interview Hub</h1>
                    <p className={pageTheme.header.subtitle}>
                        Currently tracking {stats.total} candidates in the requirement workflow.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                    label="Requirement Pipeline"
                    value={stats.total}
                    subText="Overall candidates"
                    icon={Users}
                    iconBgClass="bg-primary/5"
                    iconColorClass="text-primary"
                />
            </div>

            {/* Main content */}
            <div className={pageTheme.section.card}>
                <div className={pageTheme.section.header}>
                    <div className={pageTheme.section.title}>
                        <span className={pageTheme.section.titleDot} />
                        Active Requirements
                    </div>
                </div>
                <RequirementTable onRowClick={handleOpenDrawer} onDataUpdate={(data) => setStats({ total: data.length })} />
            </div>

            {/* Requirement Detail Drawer */}
            <RequirementDrawer 
                data={selectedRequirement} 
                onClose={handleCloseDrawer} 
                onOpenProfile={handleOpenFullProfile}
            />
        </div>
    );
};