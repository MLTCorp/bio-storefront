import { useConfig } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instagram, Youtube, Twitter } from "lucide-react";

export function ProfileHeader() {
  const { config } = useConfig();

  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/20 to-secondary opacity-70 blur-sm animate-pulse" />
        <Avatar className="w-24 h-24 border-2 border-white shadow-lg relative">
          <AvatarImage src={config.profileImage} alt={config.profileName} className="object-cover" />
          <AvatarFallback>{config.profileName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{config.profileName}</h1>
        <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed whitespace-pre-line">
          {config.profileBio}
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SocialButton icon={<Instagram className="w-5 h-5" />} href="#" colorClass="hover:text-pink-600" />
        <SocialButton icon={<Youtube className="w-5 h-5" />} href="#" colorClass="hover:text-red-600" />
        <SocialButton icon={<Twitter className="w-5 h-5" />} href="#" colorClass="hover:text-blue-400" />
      </div>
    </div>
  );
}

function SocialButton({ icon, href, colorClass }: { icon: React.ReactNode, href: string, colorClass: string }) {
  return (
    <a href={href} className={`p-2 rounded-full bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all duration-300 text-foreground/80 ${colorClass}`}>
      {icon}
    </a>
  );
}
