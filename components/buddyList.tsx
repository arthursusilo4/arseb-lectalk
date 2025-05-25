import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, getSubjectColor } from "@/lib/utils";
import Image from "next/image";
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
               {buddies?.map(({ id, subject, name, topic, duration }) => (
                    <TableRow key={id}>
                         <TableCell>
                              <Link href={`/buddies/${id}`}>
                                   <div className="flex items-center gap-2">
                                        <div className='size-[70px] flex items-center justify-center rounded-lg max-md:hidden' style={{ backgroundColor: getSubjectColor(subject) }}>
                                            <Image 
                                            src={`/icons/${subject}.svg`} 
                                            alt={subject}
                                            width={45}
                                            height={45} />
                                        </div>
                                        <div className="flex flex-col gap-2 pl-2">
                                             <p className="font-bold text-xl">{name}</p>
                                             <p className="text-lg">{topic}</p>
                                        </div>
                                   </div>
                              </Link>
                         </TableCell>
                         <TableCell>
                              <div className='subject-badge w-fit max-md:hidden'>
                                   {subject}
                              </div>
                              <div className='flex items-center justify-center rounded-lg w-fit p-2 md:hidden' style={{ backgroundColor: getSubjectColor(subject) }}>
                                   <Image 
                                   src={`/icons/${subject}.svg`} 
                                   alt={subject}
                                   width={18}
                                   height={18}
                                   />
                              </div>
                         </TableCell>
                         <TableCell>
                              <div className='flex items-center gap-2 w-full justify-end'>
                                   <p className='text-xl'>
                                        {duration} {''}
                                        <span className='max-md:hidden'>Mins</span>
                                   </p>
                                   <Image 
                                   src='/icons/clock.svg' 
                                   alt='minutes'
                                   height={14}
                                   width={14}
                                   className='md:hidden'
                                   />
                              </div>
                         </TableCell>
                    </TableRow>
               ))}
          </TableBody>
          </Table>

    </article>
  )
}

export default BuddyList
