"use client";

import { createContext, useContext, ReactNode } from "react";
import { usePathname } from "next/navigation";

type UserRole = "admin" | "member";

interface MemberInfo {
  direction: string;
  centre: string;
  gmr: string;
  equipe: string;
}

interface UserContextType {
  role: UserRole;
  name: string;
  isAdmin: boolean;
  memberInfo?: MemberInfo;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const ADMIN_USER = {
  name: "Julien Neuville",
};

const MEMBER_USER = {
  name: "Agent",
  memberInfo: {
    direction: "Maintenance",
    centre: "Aura",
    gmr: "lorem",
    equipe: "Emasi",
  },
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const role: UserRole = isAdmin ? "admin" : "member";

  const value: UserContextType = isAdmin
    ? {
        role,
        name: ADMIN_USER.name,
        isAdmin: true,
      }
    : {
        role,
        name: MEMBER_USER.name,
        isAdmin: false,
        memberInfo: MEMBER_USER.memberInfo,
      };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
