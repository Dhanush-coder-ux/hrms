import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // 1. Import the hook
import { Building2, Users, ClipboardList } from 'lucide-react';
import StatCard from '../../Components/Common/StatCard';

const STATS_CONFIG = [
  { 
    id: 'depts', 
    icon: Building2, 
    label: "Departments", 
    bg: "#E0E7FF", 
    color: "#4F46E5", 
    value: "12",
    path: "/admin/departmentstacks" // 2. Add destination paths
  },
  { 
    id: 'policy', 
    icon: ClipboardList, 
    label: "Active Policies", 
    bg: "#D1FAE5", 
    color: "#059669", 
    value: "45",
    path: "/policies" 
  },
  { 
    id: 'employees', 
    icon: Users, 
    label: "Employee Updates", 
    bg: "#FEE2E2", 
    color: "#DC2626", 
    value: "8",
    path: "/admin/employeestacks"
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } } // 3. Add a hover state
};

export const StackVariables = () => {
  const navigate = useNavigate(); // 4. Initialize navigation

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 lg:p-10 min-h-screen bg-slate-50/50 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-indigo-50/50 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            Stack Variables
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Modify and manage your organizational tools
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {STATS_CONFIG.map((stat) => (
            <motion.div 
              key={stat.id} 
              variants={itemVariants}
              whileHover="hover" // Trigger the hover variant
              whileTap={{ scale: 0.98 }} // Add tactile feedback on click
              onClick={() => navigate(stat.path)} // 5. Diversion logic
              className="cursor-pointer" // Show the user it's clickable
            >
              <StatCard 
                icon={stat.icon} 
                label={stat.label} 
                iconBg={stat.bg} 
                iconColor={stat.color} 
                valueSize="text-3xl" 
                value={stat.value} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};