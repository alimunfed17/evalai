"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu";

export default function NavigationHeader() {
  const pathname = usePathname();

  return (
    <div className="w-full flex items-center px-6 py-4 bg-gray-500 text-white h-16">
      <h1 className="text-2xl font-bold mr-8">Eval AI</h1>

      <div className="flex flex-1 justify-center">
        <NavigationMenu>
          <NavigationMenuList className="flex gap-20">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className={`font-bold text-sm px-4 py-2 rounded transition-colors ${
                    pathname === "/" ? "bg-black" : "hover:bg-gray-700"
                  }`}
                >
                  Interviewee
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/interviewer"
                  className={`font-bold text-sm px-4 py-2 rounded transition-colors ${
                    pathname === "/interviewer" ? "bg-black" : "hover:bg-gray-700"
                  }`}
                >
                  Interviewer
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
