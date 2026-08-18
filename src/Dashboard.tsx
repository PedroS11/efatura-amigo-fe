import { useEffect, useState } from "react";
import { BadgeCheck, ChevronLeft, ChevronRight, Search, ClipboardCheck, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./components/ui/item";
import { toast } from "sonner"
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import { searchCompanies } from "./lib/api/searchCompanies";
import { getMetadata, type Metadata } from "./lib/api/getMetadata";
import { Spinner } from "./components/ui/spinner";

function App() {
    const [query, setQuery] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [nrPages, setNrPages] = useState(0);
    const [metadata, setMetadata] = useState<Metadata | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

    async function fetchMetadata() {
        const data = await getMetadata()
        setMetadata(data);
    }

    useEffect(() => {
        fetchMetadata();
    }, []);

    const navigate = useNavigate();

    async function fetchResults(page: number) {
        if (!query.trim()) return;

        setSearchPerformed(true);
        setLoading(true);

        const response = await searchCompanies(query, page);
        if(!response.ok) {
            if([401,403].includes(response.status)) {
                toast.error("Sessão expirada, por favor login novamente");
                navigate("/");
            } else {
                toast.error("Erro ao procurar empresas");
                console.error({
                    statusText: response.statusText,
                    status: response.status
                });
            }
            setLoading(false);
            return;
        }
        const data = await response.json();

        setItems(data.items);
        setCurrentPage(data.page);
        setNrPages(data.nrPages);
        setLoading(false);
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

    const showClear = (query.length > 0 || items.length > 0 || searchPerformed) && !loading;

    return (
        <div className="min-h-screen flex flex-col">
        <main className="flex flex-1 items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Efatura Amigo Dashboard
                </h1>

                {metadata && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                        <Badge variant="secondary">
                            <BadgeCheck />
                            {metadata.companiesTable.itemCount} empresas
                        </Badge>
                        <Badge variant="secondary">
                            <ClipboardCheck />
                            {metadata.unprocessedCompaniesTable.itemCount} empresas por processar
                        </Badge>
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
                {loading && (
                    <div className="mt-8 flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            A procurar empresas...
                        </p>
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className="mt-8 flex flex-col gap-2">
                    {items.map((item,index) => (
                            <Item key={item.nif} variant={`${index % 2 === 0 ? "outline" : "muted"}`}>
                            <ItemContent >
                              <ItemTitle>{item.name}</ItemTitle>
                              <ItemDescription>NIF: {item.nif}</ItemDescription>
                              {item.category && <ItemDescription>Category: {item.category}</ItemDescription>}
                            </ItemContent>
                          </Item>
                        ))}

                        {nrPages > 1 && (
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
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
                                    onClick={() => handlePageChange(currentPage + 1)}
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
                        <Item variant="muted">
                            <ItemMedia>
                                <Spinner />
                            </ItemMedia>
                            <ItemContent>
                                <ItemTitle className="line-clamp-1">A procurar empresas...</ItemTitle>
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