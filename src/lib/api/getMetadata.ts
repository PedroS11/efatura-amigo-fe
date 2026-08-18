export type Metadata = {
    companiesTable: { itemCount: number };
    unprocessedCompaniesTable: { itemCount: number };
};

export const getMetadata = async (): Promise<Metadata> => {
    const response = await fetch(`https://efatura.pedroosilva.dev/api/metadata`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("idToken")}`
        }
    });
    return await response.json();
}