import Loading from "@/components/Loading";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function Home() {
  const supabase = useSupabaseClient();
  const user = useUser();

  if (!user) {
    return (
      <div>
        <div className="flex h-screen w-full items-center justify-center flex-col">
          <h2 className="py-8">Welcome to Attendence Manager for NITC</h2>
          <h3 className="py-8">
            Please login to your account to manage your attendance
          </h3>
          <button
            className="bg-slate-700 p-2 text-slate-200 rounded-md hover:bg-slate-500"
            onClick={async () => {
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
              });
            }}
          >
            Login with google
          </button>
        </div>
      </div>
    );
  }

  const router = useRouter();
  router.push("/profile", undefined, { shallow: true });

  return (
    <>
      <Loading />
    </>
  );
}
