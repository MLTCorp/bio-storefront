import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Instagram, Youtube, Twitter } from "lucide-react";
import profileImage from "@assets/generated_images/professional_profile_photo_of_a_young_woman_with_curly_hair_in_a_natural_setting.png";

export function ProfileHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <div className="relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary/20 to-secondary opacity-70 blur-sm animate-pulse" />
        <Avatar className="w-24 h-24 border-2 border-white shadow-lg relative">
          <AvatarImage src={profileImage} alt="Tania Vi" className="object-cover" />
          <AvatarFallback>TV</AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tania Vi</h1>
        <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto leading-relaxed">
          Wellness & Lifestyle Creator ✨
          <br />
          Helping you live your best healthy life.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <a href="#" className="p-2 rounded-full bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all duration-300 text-foreground/80 hover:text-primary">
          <Instagram className="w-5 h-5" />
        </a>
        <a href="#" className="p-2 rounded-full bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all duration-300 text-foreground/80 hover:text-red-600">
          <Youtube className="w-5 h-5" />
        </a>
        <a href="#" className="p-2 rounded-full bg-white shadow-sm hover:scale-110 hover:shadow-md transition-all duration-300 text-foreground/80 hover:text-blue-400">
          <Twitter className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}