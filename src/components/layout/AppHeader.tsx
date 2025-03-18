import React from "react";
import { Settings2, Crown, FileVideo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppHeaderProps {
  isPro: boolean;
  setIsPro: (value: boolean) => void;
}

export function AppHeader({ isPro, setIsPro }: AppHeaderProps) {
  return (
    <header className="border-b bg-card/95 backdrop-blur-sm sticky top-0 z-50 border-b-orange-100/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2 rounded-lg">
              <FileVideo className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text">
              Subtitle Studio Pro
            </span>
          </div>
          {!isPro && (
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200/50"
            >
              Free Plan
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isPro}
              onCheckedChange={setIsPro}
              className="data-[state=checked]:bg-gradient-to-r from-orange-500 to-amber-500"
            />
            <Label className="text-sm font-medium">
              {isPro ? "Pro Mode" : "Free Mode"}
            </Label>
          </div>

          {!isPro && (
            <Button
              variant="premium"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
              size="sm"
              onClick={() => setIsPro(true)}
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="hover:bg-accent">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Help & Support
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
