import BuddyCard from "@/components/buddyCard";
import SearchInput from "@/components/searchInput";
import SubjectFilter from "@/components/subjectFilter";
import { getUserBuddiesWithFilters } from "@/lib/actions/buddy.actions";
import { getSubjectColor } from "@/lib/utils";

const BuddiesLibrary = async ({ searchParams }: SearchParams) => {
  const filters = await searchParams;
  const subject = filters.subject ? filters.subject : "";
  const topic = filters.topic ? filters.topic : "";

  const buddies = await getUserBuddiesWithFilters({ subject, topic });

  console.log(buddies);

  return (
    <main>
      <section className="flex justify-between gap-4 max-sm:flex-col">
        <h1>My Buddy Books</h1>
        <div className="flex gap-5">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>

      <section className="buddies-grid">
        {buddies.length > 0 ? (
          buddies.map((buddy) => (
            <BuddyCard 
              key={buddy.id} 
              {...buddy} 
              color={getSubjectColor(buddy.subject)}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No buddies found. Create your first buddy!</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default BuddiesLibrary;