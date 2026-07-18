import { LoginForm } from '@/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden text-slate-100">
      {/* Dynamic Background Glow & Elements */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-rose-600/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
