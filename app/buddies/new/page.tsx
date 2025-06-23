import BuddyForm from "@/components/buddyForm";
import { newBuddyPermissions } from "@/lib/actions/buddy.actions";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const NewBuddies = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const canCreateBuddy = await newBuddyPermissions();

  return (
    <main className="new-buddies-container">
      {canCreateBuddy ? (
        <article className="w-full gap-4 flex flex-col">
          <h1>Buddy Maker Panel</h1>

          <BuddyForm />
        </article>
      ) : (
        <article className="buddy-limit">
          <Image
            src="/images/limit.svg"
            alt="Buddy Limit Reached Bro"
            width={350}
            height={220}
          />
          <div className="call-to-action-badge">Upgrade Your Plan</div>
          <h1>You have reached your Buddy Limit</h1>
          <p>Please Upgrade if you desire to make more buddies.</p>
          <Link href="/subscription" className="btn-primary w-full justify-center">Upgrade My Plan</Link>
        </article>
      )}
    </main>
  );
};

export default NewBuddies;