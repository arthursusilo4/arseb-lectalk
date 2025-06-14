import BuddyForm from "@/components/buddyForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const NewBuddies = async () => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <main className="md:w-1/3 lg:w-1/3 items-center justify-center">
      <article className="w-full gap-4 flex flex-col">
        <h1>Buddy Maker Panel</h1>

        <BuddyForm />
      </article>
    </main>
  );
};

export default NewBuddies;
