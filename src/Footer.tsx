const CURRENT_YEAR = new Date().getFullYear();

const Footer = () => {
    return (
        <footer className="border-t px-4 py-6">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-1 text-center text-sm text-muted-foreground">
                {/* <p className="font-medium text-foreground">Efatura Amigo</p> */}
                <p>Pesquisa de empresas por NIF/nome</p>
                <p>© {CURRENT_YEAR} Efatura Amigo</p>
            </div>
        </footer>
    );
};

export default Footer;
