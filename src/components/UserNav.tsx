
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/lovable-uploads/d720f2ae-6e6d-4aae-a200-6fc390b33f0b.png" alt="User" />
            <AvatarFallback>RZ</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border border-[rgb(74,182,201,0.2)] shadow-lg" align="end">
        <DropdownMenuLabel className="bg-white">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-[rgb(74,182,201)]">Rakib Uz Zaman</p>
            <p className="text-xs text-[rgb(74,182,201,0.8)]">HR Assistant Manager</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem className="text-[rgb(74,182,201)] hover:bg-[rgb(74,182,201,0.1)]">Profile</DropdownMenuItem>
        <DropdownMenuItem className="text-[rgb(74,182,201)] hover:bg-[rgb(74,182,201,0.1)]">Settings</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-[rgb(74,182,201,0.2)]" />
        <DropdownMenuItem className="text-[rgb(74,182,201)] hover:bg-[rgb(74,182,201,0.1)]">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
