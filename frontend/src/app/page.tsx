import LoginWithTwitter from "@/loginWithTwitter/loginWithTwitter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LoginWithTwitter />
    </main>
  );
}