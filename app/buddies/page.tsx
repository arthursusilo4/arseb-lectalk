import BuddyCard from "@/components/buddyCard";
import SearchInput from "@/components/searchInput";
import SubjectFilter from "@/components/subjectFilter";
import { getAllBuddies } from "@/lib/actions/buddy.actions";
import { getSubjectColor } from "@/lib/utils";

const BuddiesLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  const buddies = await getAllBuddies({ subject, topic });

  console.log(buddies);

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>Buddy Books</h1>
        <div className="flex gap-5">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>

      <section className="buddies-grid">
        {buddies.map((buddy) => (
          <BuddyCard 
          key={buddy.id} 
          {...buddy} 
          color={getSubjectColor(buddy.subject)}
          />
        ))}
      </section>
    </main>
  );
};

export default BuddiesLibrary;
