import { LoginForm } from "@/features/auth";

const LoginPage = () => {
  return (
    <div class="w-full">
      <hgroup class="mb-6 space-y-2">
        <h1 class="text-2xl font-semibold">Вход</h1>
        <p class="text-fg-secondary">Войдите, если у вас уже есть аккаунт.</p>
      </hgroup>

      <LoginForm />
    </div>
  );
};

export default LoginPage;
