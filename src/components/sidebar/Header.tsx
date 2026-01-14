import { useSidebarStore } from "@/stores";
import { Inter } from "next/font/google";
import Image from "next/image";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const Header = () => {
  const isCollapsed = useSidebarStore((state) => state.isCollapsed);

  return (
    <div className="flex flex-col gap-1 items-start pt-5 px-4 pb-0 justify-between">
      <div className="flex items-center gap-2 h-[66px]">
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={24}
          height={24}
          className="rounded-md shrink-0"
        />
        {!isCollapsed && (
          <div className="overflow-hidden flex flex-col">
            <div className="font-semibold text-base whitespace-nowrap">
              Le collecteur
            </div>
          </div>
        )}
      </div>
      <div
        className={`text-[10px] font-normal py-2 w-full text-right ${inter.className}`}
      >
        V1.1.3
      </div>
    </div>
  );
};
export default Header;
