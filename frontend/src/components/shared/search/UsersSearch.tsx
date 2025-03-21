"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface UsersSearchProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setCityFilter?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
}

const UsersSearch: React.FC<UsersSearchProps> = ({
  setSearchTerm,
  setCityFilter,
  placeholder,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const [localCity, setLocalCity] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
      if (setCityFilter) {
        setCityFilter(localCity);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [localSearchTerm, localCity, setSearchTerm, setCityFilter]);

  return (
    <div className="mb-3 flex flex-col gap-4 p-2">
      <div className="flex min-h-[56px] w-full items-center rounded-full bg-gray-200 shadow-sm shadow-slate-700 dark:bg-zinc-800">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
          className="mx-3"
        />
        <Input
          placeholder={placeholder || "Search by username, first or last name"}
          type="search"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className=" search-text no-focus dark:text-babyPowder w-full rounded-full border-none bg-transparent px-3 py-2 shadow-none outline-none"
        />
      </div>

      {setCityFilter && (
        <div className="flex min-h-[56px] w-full items-center rounded-full bg-gray-200 shadow-sm shadow-slate-700 dark:bg-zinc-800">
          <Image
            src="/assets/icons/apartments.svg"
            alt="Location"
            width={24}
            height={24}
            className="mx-3 bg-zinc-700"
          />
          <Input
            placeholder="Filter by city"
            type="text"
            value={localCity}
            onChange={(e) => setLocalCity(e.target.value)}
            className="search-text no-focus dark:text-babyPowder w-full rounded-full border-none bg-transparent px-3 py-2 shadow-none outline-none"
          />
        </div>
      )}
    </div>
  );
};

export default UsersSearch;
