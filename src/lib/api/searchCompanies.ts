import { apiFetchJson } from "./apiFetch";

export type SearchCompaniesResponse = {
    items: Array<{
        nif: number;
        name: string;
        category?: string;
    }>;
    page: number;
    nrPages: number;
};

export const searchCompanies = (query: string, page: number) =>
    apiFetchJson<SearchCompaniesResponse>(
        `/api/search?query=${encodeURIComponent(query)}&page=${page}`
    );
