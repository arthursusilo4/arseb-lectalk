import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const Page = () => {
  return (
    <div className='flex gap-8'>
      <h1 className='text-xl font-bold pt-4 pl-5'>
        Selamat datang, anda berada di LecTalk! 
      </h1>
      <Accordion className='items-center justify-center' type="single" collapsible>
        <AccordionItem value="item-1" className='flex'>
          <AccordionTrigger className=''>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Antarmuka Pengguna yang bersih, untuk meningkatkan navigasi fitur.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Page