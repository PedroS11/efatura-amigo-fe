import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";

type LoginProps = {
    onLogin: (credential: string) => Promise<void>;
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
                            if (!credentialResponse.credential) return;

                            setError(null);
                            try {
                                await onLogin(credentialResponse.credential);
                            } catch {
                                setError("Login failed");
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
