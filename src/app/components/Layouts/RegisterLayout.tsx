import RegisterForm from "../Fragments/Form/RegisterForm";

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/bg.jpg")' }}
    >
      <div className="backdrop-blur-sm bg-black/40 p-4 rounded-2xl shadow-2xl w-full max-w-sm border border-white/30">
        <h2 className="text-white text-2xl font-bold text-center mb-4">
          Daftar
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
}
