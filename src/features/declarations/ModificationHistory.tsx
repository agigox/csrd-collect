"use client";

import { useState } from "react";
import Icon from "@/lib/Icons";
import type { ModificationEntry } from "@/models/Declaration";
import { Divider } from "@rte-ds/react";

interface ModificationHistoryProps {
  entries: ModificationEntry[];
  onClose: () => void;
}

const ModificationHistory = ({
  entries,
  onClose,
}: ModificationHistoryProps) => {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpand = (id: string) => {
    setExpandedEntries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div
      className="flex flex-col gap-4 px-4 py-6 h-full w-70"
      style={{
        background:
          "linear-gradient(90deg, rgb(230, 238, 248) 0%, rgb(230, 238, 248) 100%)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Icon name="listAlt" size={15} color="#201f1f" />
          <span className="font-semibold text-sm text-[#201f1f] flex-1">
            Historique de modifications
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded transition-colors"
          >
            <Icon name="close" size={20} color="#201f1f" />
          </button>
        </div>
        <Divider className="bg-[#cdcccc]" />
      </div>

      {/* Timeline */}
      <div className="flex gap-4 flex-1 overflow-y-auto">
        {/* Timeline track */}
        <div className="flex flex-col items-center shrink-0">
          {entries.map((entry, index) => (
            <div key={entry.id} className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={`w-2 h-2 rounded-full ${
                  index === 0
                    ? "bg-[#2964a0]"
                    : "border-2 border-[#2964a0] bg-transparent"
                }`}
              />
              {/* Line */}
              {index < entries.length - 1 && (
                <div className="w-0.5 bg-[#2964a0] flex-1 min-h-15" />
              )}
            </div>
          ))}
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-4 flex-1">
          {entries.map((entry) => {
            const isExpanded = expandedEntries.has(entry.id);
            const hasDetails = entry.details && entry.details.length > 0;

            return (
              <div key={entry.id} className="flex flex-col">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-base text-[#2964a0]">
                    {entry.userName}
                  </span>
                  <span className="text-xs text-[#727272]">
                    {entry.timestamp}
                  </span>
                </div>

                {/* Action */}
                <p className="text-sm text-[#11161a] pl-1.5">{entry.action}</p>

                {/* Details toggle */}
                {hasDetails && (
                  <div
                    className={`rounded mt-1 ${
                      isExpanded
                        ? "bg-[#d3e2f5] pb-2 pt-0.5 px-2"
                        : "bg-[#d3e2f5] px-2 py-0.5"
                    }`}
                  >
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className="flex items-center gap-2 h-6"
                    >
                      <span className="text-sm text-[#2964a0]">
                        Voir détail
                      </span>
                      <Icon
                        name={isExpanded ? "chevronUp" : "chevronDown"}
                        size={12}
                        color="#2964a0"
                      />
                    </button>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="flex flex-col gap-1 mt-1">
                        {entry.details?.map((detail, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#2964a0]" />
                            <span className="text-sm text-[#11161a]">
                              {detail.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModificationHistory;
