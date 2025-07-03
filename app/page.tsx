import React from "react";
import BuddyCard from "@/components/buddyCard";
import BuddyList from "@/components/buddyList";
import CallToAction from "@/components/callToAction";
import { recentSessions } from "@/constants";
import { getAllBuddies, getRecentSessions } from "@/lib/actions/buddy.actions";
import { getSubjectColor } from "@/lib/utils";

const Page = async () => {
  const buddies = await getAllBuddies({ limit: 3 });
  const recentSessionsBuddies = await getRecentSessions(10);

  return (
    <main>
      <h1 className="">Popular Buddies</h1>

      <section className="home-section">
        {buddies.map((buddy) => (
          <BuddyCard
            key={buddy.id}
            {...buddy}
            color={getSubjectColor(buddy.subject)}
            isOwner={false} // These are public buddies, user doesn't own them
          />
        ))}
      </section>

      <section className="home-section">
        <CallToAction />
        <div>‎</div>
        <BuddyList
          title="Recently Completed Sessions"
          buddies={recentSessionsBuddies}
          classNames="w-2/3 max-lg:w-full"
        />
      </section>
      <div>‎</div>
    </main>
  );
};

export default Page;
