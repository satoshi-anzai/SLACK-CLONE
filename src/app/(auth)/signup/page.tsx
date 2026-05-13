import Link from "next/link";
import { SignupForm } from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-1 text-center text-2xl font-bold text-gray-900">
        Create your Acme account
      </h1>
      <p className="mb-6 text-center text-sm text-gray-500">
        新しいアカウントを作成してチームに参加
      </p>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-gray-600">
        すでにアカウントをお持ちの方は{" "}
        <Link
          href="/login"
          className="font-semibold text-slack-blue hover:underline"
        >
          ログイン
        </Link>
      </p>
    </>
  );
}
