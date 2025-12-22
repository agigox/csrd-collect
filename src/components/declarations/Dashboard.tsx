"use client";

import { Megaphone } from "lucide-react";

interface StatCardProps {
  value: number;
  label: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const StatCard = ({ value, label, action, className = "" }: StatCardProps) => {
  return (
    <div
      className={`bg-white rounded shadow-[0px_2px_4px_0px_rgba(0,0,0,0.14),0px_0px_2px_0px_rgba(0,0,0,0.12)] px-4 h-[164px] flex flex-col justify-center ${className}`}
    >
      <div className="flex flex-col gap-[3px]">
        <span className="text-[45px] font-semibold text-[#201f1f] leading-[48px] tracking-tight">
          {value}
        </span>
        <span className="text-sm font-semibold text-[#201f1f] tracking-tight">
          {label}
        </span>
        {action && (
          <div className="flex flex-col items-end mt-2">
            <button
              onClick={action.onClick}
              className="bg-[#2964a0] hover:bg-[#1e4f7a] text-white font-semibold text-base px-4 py-1 rounded flex items-center gap-1.5 transition-colors"
            >
              {action.label}
              <Megaphone className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface DashboardProps {
  declarationsAFaire?: number;
  declarationsEffectuees?: number;
  declarationsModifiees?: number;
  onDeclarer?: () => void;
}

const Dashboard = ({
  declarationsAFaire = 14,
  declarationsEffectuees = 17,
  declarationsModifiees = 6,
  onDeclarer,
}: DashboardProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Top card - Déclarations à faire */}
      <StatCard
        value={declarationsAFaire}
        label="déclarations à faire"
        action={
          onDeclarer
            ? { label: "Déclarer", onClick: onDeclarer }
            : { label: "Déclarer", onClick: () => console.log("Déclarer") }
        }
      />

      {/* Bottom row - Two cards side by side */}
      <div className="flex gap-4">
        <StatCard
          value={declarationsEffectuees}
          label="déclarations effectuées"
          className="flex-1"
        />
        <StatCard
          value={declarationsModifiees}
          label="déclarations modifiées"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default Dashboard;
