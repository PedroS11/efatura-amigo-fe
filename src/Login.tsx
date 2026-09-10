import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

type LoginProps = {
    onLogin: () => void;
};

const login = async (credential: string) => {
    const response = await fetch(
        "https://1qwv76yf37.execute-api.eu-west-2.amazonaws.com/api/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                credential,
            }),
        }
    );

    if (!response.ok) {
        console.log("Login failed", response.statusText);
        return;
    }
};

function Login({ onLogin }: LoginProps) {
    const [error, setError] = useState<string | null>(null);

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
                        onSuccess={async (credentialResponse) => {
                            console.log("LOGIN cre", credentialResponse);

                            if (credentialResponse.credential) {
                                const response = await login(
                                    credentialResponse.credential
                                );
                                console.log("LOGIN", response);
                                onLogin();
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

export default Login;
