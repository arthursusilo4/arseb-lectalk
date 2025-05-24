import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import BuddyCard from '@/components/buddyCard'
import BuddyList from '@/components/buddyList'
import CallToAction from '@/components/callToAction'
import { recentSessions } from '@/constants'


const Page = () => {
  return (
    <main>
      <h1 className=''>Buddy Terpopuler!</h1>

      <section className='home-section'>
        <BuddyCard
          ID='123'
          name='Paulus Pemandu 1'
          topic='Ahlinya Olahragawan'
          subject='Olahraga'
          duration={35}
          color='#FF6B6B'
        />

        <BuddyCard
          ID='124'
          name='Paulus Pemandu 2'
          topic='Ahlinya Olahragawan'
          subject='Olahraga'
          duration={15}
          color='#E74C3C'
        />

        <BuddyCard
          ID='125'
          name='Paulus Pemandu 3'
          topic='Ahlinya Olahragawan'
          subject='Olahraga'
          duration={55}
          color='#FF3E4D'
        />
      </section>

      <section className='home-section'>
        <CallToAction/>
        <BuddyList
          title='Sesi Selesai Terkini'
          buddies={recentSessions}
          classNames='w-2/3 max-lg:w-full'
        />
      </section>
    </main>
  )
}

export default Page