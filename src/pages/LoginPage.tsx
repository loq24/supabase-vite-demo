import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-2">
            Supabase Todo App
          </h1>
          <p className="text-gray-600">Sign in to manage your todos</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
