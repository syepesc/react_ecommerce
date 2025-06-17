import { Button } from "@/components/ui/button";
import ThemeToggler from "./theme-toggler";
import Link from "next/link";
import { MenuIcon, ShoppingCart } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import UserButton from "./user-button";

const HeaderMenu = () => {
  return (
    <div className="flex justify-end">
      <nav className="hidden md:flex w-full max-w-xs gap-2">
        <ThemeToggler />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <UserButton />
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <MenuIcon />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start p-6">
            <SheetTitle>Menu</SheetTitle>
            {/* Leave SheetDescription empty to suppress warnings */}
            <SheetDescription></SheetDescription>
            <ThemeToggler />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <UserButton />
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default HeaderMenu;
