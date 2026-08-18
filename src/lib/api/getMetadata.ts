import { apiFetchJson } from "./apiFetch";

export type Metadata = {
    companiesTable: { itemCount: number };
    unprocessedCompaniesTable: { itemCount: number };
    nifPt: {
        credits: {
            month: number;
            day: number;
            hour: number;
            minute: number;
            paid: number;
        }
    }
};

export const getMetadata = () =>
    apiFetchJson<Metadata>("/api/metadata");
