import { RegisterForm } from "@/features/auth";

const RegisterPage = () => {
  return (
    <div class="w-full">
      <hgroup class="mb-6 space-y-2">
        <h1 class="text-2xl font-semibold">Регистрация</h1>
        <p class="text-fg-secondary">Создайте аккаунт, если у вас его нет.</p>
      </hgroup>

      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
