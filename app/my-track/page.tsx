import BuddyList from "@/components/buddyList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getUserBuddies, getUserSessions } from "@/lib/actions/buddy.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const buddies = await getUserBuddies(user.id);
  const sessionHistory = await getUserSessions(user.id);

  return (
    <main className="min-lg:w-3/4">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center ">
          <Image
            src={user.imageUrl}
            alt={user.firstName!}
            width={110}
            height={110}
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-slate-800 rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={20}
                height={20}
              />
              <p className="text-2xl font-semibold">{sessionHistory.length}</p>
            </div>
            <div>Lecture Completed</div>
          </div>
          <div className="border border-slate-800 rounded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/cap.svg"
                alt="checkmark"
                width={20}
                height={20}
              />
              <p className="text-2xl font-semibold">{buddies.length}</p>
            </div>
            <div>Buddies Created</div>
          </div>
        </div>
      </section>
      <Accordion type="multiple">
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">Recent Lectures</AccordionTrigger>
          <AccordionContent>
            <BuddyList title="Recent Lectures" buddies={sessionHistory} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="buddies">
          <AccordionTrigger className="text-2xl font-bold">
My Buddies {`(${buddies.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <BuddyList title="My Buddies" buddies={buddies} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};

export default Profile;
