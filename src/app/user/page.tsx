import { UserPageModule } from "@/features/user/UserPageModule";
import { AuthGuard } from "@/shared/components/AuthGuard";

export default function User() {
  return (
    <AuthGuard>
      <UserPageModule />
    </AuthGuard>
  );
}
