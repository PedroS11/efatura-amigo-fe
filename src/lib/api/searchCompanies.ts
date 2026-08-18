export const searchCompanies = async (query: string, page: number) => {
    const response = await fetch(`https://efatura.pedroosilva.dev/api/search?query=${query}&page=${page}`, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("idToken")}`
        }
    });
    return response;
}