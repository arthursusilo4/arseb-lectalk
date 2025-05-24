import Image from "next/image";
import Link from "next/link";

interface BuddyCardProps {
     ID: string;
     name: string;
     topic: string;
     subject: string;
     duration: number;
     color: string;
}

const BuddyCard = ({ ID, name, topic, subject, duration, color}: BuddyCardProps) => {
  return (
    <article className="buddy-card" style={{ backgroundColor: color }}>
     <div className="flex justify-between items-center">
          <div className="subject-badge">{subject}</div>
          <button className="buddy-bookmark">
               <Image src='/icons/bookmark.svg' alt='bookmark'
                    width={12}
                    height={14.5}
               />
          </button>
     </div>
     <h2 className="text-2xl font-bold">
          {name}
     </h2>
     <p className="text-sm">
          {topic}
     </p>
     <div className="flex items-center gap-2">
          <Image src='/icons/clock.svg' alt="duration"
               width={14}
               height={14}
          />
          <p className="text-sm">{duration} minutes</p>
     </div>

     <Link href={`/buddies/${ID}`} className="w-full">
          <button className="btn-primary w-full justify-center">
               Mulai Sesi
          </button>
     </Link> 
    </article>
  )
}

export default BuddyCard
