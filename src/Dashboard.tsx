import { useCallback, useEffect, useState } from "react";
import {
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Search,
    ClipboardCheck,
    X,
    Coins,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "./components/ui/item";
import { toast } from "sonner";
import Footer from "./Footer";
import {
    searchCompanies,
    type SearchCompaniesResponse,
} from "./lib/api/searchCompanies";
import { getMetadata, type Metadata } from "./lib/api/getMetadata";
import { ApiAuthError, ApiError } from "./lib/api/apiFetch";
import { Spinner } from "./components/ui/spinner";

type DashboardProps = {
    onSessionExpired: () => void;
};

function App({ onSessionExpired }: DashboardProps) {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<SearchCompaniesResponse["items"]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [nrPages, setNrPages] = useState(0);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [metadataLoading, setMetadataLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const handleApiAuthError = useCallback(
        (error: unknown): boolean => {
            if (error instanceof ApiAuthError) {
                toast.error("Sessão expirada, por favor login novamente");
                onSessionExpired();
                return true;
            }
            return false;
        },
        [onSessionExpired]
    );

    useEffect(() => {
        async function fetchMetadata() {
            try {
                const data = await getMetadata();
                setMetadata(data);
            } catch (error) {
                if (handleApiAuthError(error)) {
                    return;
                }
                console.error(error);
            } finally {
                setMetadataLoading(false);
            }
        }
        fetchMetadata();
    }, [handleApiAuthError]);

    async function fetchResults(page: number) {
        if (!query.trim()) return;

        setSearchPerformed(true);
        setLoading(true);

        try {
            const data = await searchCompanies(query, page);
            setItems(data.items);
            setCurrentPage(data.page);
            setNrPages(data.nrPages);
        } catch (error) {
            if (handleApiAuthError(error)) return;

            toast.error("Erro ao procurar empresas");
            if (error instanceof ApiError) {
                console.error({
                    statusText: error.response.statusText,
                    status: error.response.status,
                });
            } else {
                console.error(error);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch() {
        await fetchResults(0);
    }

    async function handlePageChange(page: number) {
        await fetchResults(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    function handleClear() {
        setItems([]);
        setQuery("");
        setCurrentPage(0);
        setNrPages(0);
        setSearchPerformed(false);
    }

    const showClear =
        (query.length > 0 || items.length > 0 || searchPerformed) && !loading;

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex flex-1 items-center justify-center px-4 py-8">
                <div className="w-full max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Efatura Amigo Dashboard
                    </h1>

                    {metadataLoading && (
                        <div className="mt-4 flex justify-center">
                            <Spinner className="size-6 text-muted-foreground" />
                        </div>
                    )}

                    {metadata && (
                        <div className="mt-4 flex flex-col items-center gap-2">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Badge variant="secondary">
                                    <BadgeCheck />
                                    {metadata.companiesTable.itemCount} empresas
                                </Badge>
                                <Badge variant="secondary">
                                    <ClipboardCheck />
                                    {
                                        metadata.unprocessedCompaniesTable
                                            .itemCount
                                    }{" "}
                                    empresas por processar
                                </Badge>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <Badge variant="outline">
                                    <Coins />
                                    Mês: {metadata.nifPt.credits.month}
                                </Badge>
                                <Badge variant="outline">
                                    <Coins />
                                    Dia: {metadata.nifPt.credits.day}
                                </Badge>
                                <Badge variant="outline">
                                    <Coins />
                                    Hora: {metadata.nifPt.credits.hour}
                                </Badge>
                                <Badge variant="outline">
                                    <Coins />
                                    Minuto: {metadata.nifPt.credits.minute}
                                </Badge>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Procura empresas por NIF"
                                className={`h-12 text-base ${showClear ? "pr-10" : ""}`}
                            />
                            {showClear && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-sm"
                                    className="absolute top-1/2 right-1 -translate-y-1/2"
                                    onClick={handleClear}
                                    aria-label="Limpar"
                                >
                                    <X />
                                </Button>
                            )}
                        </div>

                        <Button
                            onClick={handleSearch}
                            size="lg"
                            className="h-12 px-5"
                            disabled={loading}
                        >
                            <Search />
                            Procurar
                        </Button>
                    </div>

                    {!loading && items.length > 0 && (
                        <div className="mt-8 flex flex-col gap-2">
                            {items.map((item, index) => (
                                <Item
                                    key={item.nif}
                                    variant={`${index % 2 === 0 ? "outline" : "muted"}`}
                                >
                                    <ItemContent>
                                        <ItemTitle>{item.name}</ItemTitle>
                                        <ItemDescription>
                                            NIF: {item.nif}
                                        </ItemDescription>
                                        {item.category && (
                                            <ItemDescription>
                                                Category: {item.category}
                                            </ItemDescription>
                                        )}
                                    </ItemContent>
                                </Item>
                            ))}

                            {nrPages > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 0}
                                    >
                                        <ChevronLeft />
                                        Previous
                                    </Button>
                                    <span className="text-sm text-muted-foreground">
                                        Page {currentPage + 1} of {nrPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage >= nrPages - 1}
                                    >
                                        Next
                                        <ChevronRight />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    {!loading && items.length === 0 && searchPerformed && (
                        <div className="mt-8 flex flex-col gap-2">
                            Não foram encontradas empresas com o NIF fornecido
                        </div>
                    )}
                    {loading && (
                        <div className="mt-8 flex flex-col gap-2">
                            <Item variant="muted">
                                <ItemMedia>
                                    <Spinner />
                                </ItemMedia>
                                <ItemContent>
                                    <ItemTitle className="line-clamp-1">
                                        A procurar empresas...
                                    </ItemTitle>
                                </ItemContent>
                            </Item>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default App;
