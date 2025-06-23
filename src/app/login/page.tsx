import { getServerSession } from "next-auth";
import LoginLayout from "../components/Layouts/LoginLayout";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  return <LoginLayout />;
}
