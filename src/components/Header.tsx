import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";

type HeaderProps = {
    name: string;
    onLogout: () => void;
    logoutLoading?: boolean;
};

function Header({ name, onLogout, logoutLoading }: HeaderProps) {
    return (
        <header className="border-b px-4 py-3">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
                <p className="truncate text-sm font-medium">{name}</p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onLogout}
                    disabled={logoutLoading}
                >
                    <LogOut />
                    Terminar sessão
                </Button>
            </div>
        </header>
    );
}

export default Header;
