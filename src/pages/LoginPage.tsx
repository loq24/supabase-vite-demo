import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <div className="page">
      <div className="login-page">
        <div className="login-header">
          <h1>Supabase Todo App</h1>
          <p>Sign in to manage your todos</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
