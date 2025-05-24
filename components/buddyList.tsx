import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils";
import Link from "next/link";

interface BuddyListProps {
     title: string;
     buddies?: Buddy[];
     classNames?: string;
}

const BuddyList = ({ title, buddies, classNames }: BuddyListProps) => {
  return (
    <article className={cn('buddy-list', classNames)}>
     <h2 className="font-bold text-3xl justify-self-center">Sesi Terkini</h2>
          <Table>
          <TableHeader>
          <TableRow>
               <TableHead className="w-2/3 text-lg">Lessons</TableHead>
               <TableHead className="text-lg">Subject</TableHead>
               <TableHead className="text-lg text-right">Duration</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
               {buddies?.map((buddy) => (
                    <TableRow>
                         <TableCell>
                              <Link href={`/buddies/${buddy.id}`}>
                                   {buddy.subject}
                              </Link>
                         </TableCell>
                    </TableRow>
               ))}
          </TableBody>
          </Table>

    </article>
  )
}

export default BuddyList
