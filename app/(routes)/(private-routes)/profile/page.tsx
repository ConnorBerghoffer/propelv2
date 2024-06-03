import ArtistProfileModal from "@/components/modals/ArtistProfileModal";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createClient();

  const { data: { user }, } = await supabase.auth.getUser();
  if (!user) { return redirect("/login"); }

  return (
    <div>
     profile page
    </div>
  );
}
