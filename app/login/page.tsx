import { Home, ArrowRight, ShieldCheck } from "lucide-react";
import { getChatGPTUser, chatGPTSignInPath } from "../chatgpt-auth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Login() {
  const user = await getChatGPTUser();
  if (user) redirect("/app");
  return (
    <main className="login-wrap">
      <section className="login-art">
        <div className="brand">
          <span className="brandmark">
            <Home />
          </span>
          najem<small>flow</small>
        </div>
        <div>
          <h1>
            Dobre umowy.
            <br />
            Spokojny najem.
          </h1>
          <p>
            Uporządkuj mieszkania, przygotuj dokumenty i miej cały proces pod
            kontrolą.
          </p>
        </div>
        <p className="small">Panel dla wynajmujących</p>
      </section>
      <section className="login-form">
        <div>
          <ShieldCheck size={32} color="#147d6b" />
          <h1 className="mt-6">Twoja przestrzeń najmu</h1>
          <p className="muted">
            Zaloguj się, aby zapisywać mieszkania, osoby i umowy na swoim
            koncie.
          </p>
          <a
            className="btn primary"
            target="_top"
            href={chatGPTSignInPath("/app")}
          >
            Zaloguj się przez ChatGPT
            <ArrowRight size={17} />
          </a>
          <a className="btn" href="/">
            Zobacz demo bez logowania
          </a>
          <small>
            Każde konto ma oddzielne dane. Pierwsza wersja korzysta z logowania
            ChatGPT. Demo obiegu podpisów nie zawiera podpisu elektronicznego.
          </small>
          <a className="btn ghost" href="/privacy">
            Prywatność i ograniczenia wersji
          </a>
        </div>
      </section>
    </main>
  );
}
