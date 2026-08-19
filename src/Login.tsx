import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CardDemo() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <Card className="w-full max-w-sm ">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center">
                        Efatura Amigo
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col gap-2">
                    <GoogleLogin
                        use_fedcm_for_button={false}
                        shape="square"
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                localStorage.setItem(
                                    "idToken",
                                    credentialResponse.credential
                                );

                                navigate("/dashboard");
                            }
                        }}
                        onError={() => {
                            setError("Google login failed");
                        }}
                    />
                </CardFooter>
            </Card>

            {error && <p>{error}</p>}
        </main>
    );
}

export default CardDemo;
