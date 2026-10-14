import { UserPageModule } from "@repo/feature-user";
import { AuthGuard } from "@/shared/components/AuthGuard";

export default function User() {
  return (
    <AuthGuard>
      <UserPageModule />
    </AuthGuard>
  );
}
