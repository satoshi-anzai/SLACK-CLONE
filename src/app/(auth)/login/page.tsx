import Link from "next/link";
import { LoginForm } from "./LoginForm";
import { QuickLoginButtons } from "./QuickLoginButtons";

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
        Sign in to Acme
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        ワークスペースに参加するにはログインしてください
      </p>

      <LoginForm />

      <div className="mt-6">
        <QuickLoginButtons />
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        アカウントをお持ちでない方は{" "}
        <Link
          href="/signup"
          className="font-semibold text-slack-blue hover:underline"
        >
          新規登録
        </Link>
      </p>
    </>
  );
}
