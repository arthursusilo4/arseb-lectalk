import { getBuddy } from "@/lib/actions/buddy.actions";
import { getSubjectColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect, RedirectType } from "next/navigation";

interface BuddySessionPageProps {
  params: Promise<{ id: string }>;
}

const BuddySession = async ({ params }: BuddySessionPageProps) => {
  const { id } = await params;
  const buddy = await getBuddy(id);
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  if (!buddy) redirect("/buddies");

  return (
    <main>
      <article className="flex rounded-border justify-between p-6 max-md:flex-col">
        <div className="flex items-center gap-2">
          <div
            className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
            style={{ backgroundColor: getSubjectColor(buddy.subject) }}
          >
            <Image
              src={`/icons/${buddy.subject}.svg`}
              alt={buddy.subject}
              width={35}
              height={35}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <p className="font-bold text-2xl">{buddy.name}</p>
              <div className="subject-badge max-sm:hidden">{buddy.subject}</div>
            </div>
            <p className="text-lg">{buddy.topic}</p>
          </div>
        </div>
        <div className="items-start text-xl max-md:hidden">
            {buddy.duration} minutes
          </div>
      </article>
    </main>
  );
};

export default BuddySession;
