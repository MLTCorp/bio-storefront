import { ProfileHeader } from "@/components/profile-header";
import { VideoPlayer } from "@/components/video-player";
import { ProductList } from "@/components/product-list";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Mobile container constraint */}
      <main className="max-w-[480px] mx-auto min-h-screen bg-white/50 shadow-2xl shadow-black/5 px-4 py-8 md:my-8 md:rounded-[32px] md:min-h-[calc(100vh-4rem)] md:border border-white/50 backdrop-blur-3xl">
        
        <ProfileHeader />
        
        <VideoPlayer />
        
        <div className="mb-6">
          <ProductList />
        </div>

        <footer className="mt-12 text-center space-y-2 opacity-60">
          <p className="text-xs text-muted-foreground">© 2025 Tania Vi. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </footer>
      </main>
    </div>
  );
}