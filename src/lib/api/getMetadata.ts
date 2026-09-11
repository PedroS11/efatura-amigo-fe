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
    } | null;
  };
};

export const getMetadata = () => apiFetchJson<Metadata>("GET", "/api/metadata");
