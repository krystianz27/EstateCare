"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface UsersSearchProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const UsersSearch: React.FC<UsersSearchProps> = ({ setSearchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 2000);

    return () => clearTimeout(timer);
  }, [localSearchTerm, setSearchTerm]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setLocalSearchTerm(value);
  };

  return (
    <div className="bg-gray dark:bg-eerieBlack mb-3 flex min-h-[56px] w-full grow rounded-full">
      <Image
        src="/assets/icons/search.svg"
        alt="Search"
        width={24}
        height={24}
        className="mx-3"
      />
      <Input
        placeholder="Search by username, first or last name"
        type="search"
        value={localSearchTerm}
        onChange={handleInputChange}
        className="search-text no-focus dark:text-babyPowder border-none bg-transparent shadow-none outline-none"
      />
    </div>
  );
};

export default UsersSearch;
