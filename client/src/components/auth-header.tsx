import { useAuth } from "@/contexts/auth-context";
import { UserMenu } from "@/components/user-menu";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { Link } from "wouter";

export function AuthHeader() {
  const { session } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-50">
      {session ? (
        <UserMenu />
      ) : (
        <Link href="/login">
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>
        </Link>
      )}
    </div>
  );
}
