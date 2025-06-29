"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";
import { subjects } from "@/constants";

const SubjectFilter = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("subject") || "";

  const [subject, setSubject] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // If subject is "all" or empty, remove the subject filter from URL
      if (subject && subject !== "all") {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "subject",
          value: subject,
        });

        router.push(newUrl, { scroll: false });
      } else {
        // Remove subject filter when "all" is selected or subject is empty
        if (pathname === "/buddies") {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            keysToRemove: ["subject"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [subject, router, searchParams, pathname]);

  return (
    <Select onValueChange={setSubject} value={subject}>
      <SelectTrigger className="input-with-hover capitalize">
        <SelectValue placeholder="Filter Subject..." />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 shadow-lg">
        <SelectItem value="all" className="bg-white hover:bg-gray-50">
          All Subject
        </SelectItem>
        {subjects.map((subject) => (
          <SelectItem
            key={subject}
            value={subject}
            className="capitalize bg-white hover:bg-gray-50"
          >
            {subject}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectFilter;
