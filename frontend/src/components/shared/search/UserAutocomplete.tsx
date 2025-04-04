"use client";
import React, { useState } from "react";

import { useGetAllUsersQuery } from "@/lib/redux/features/users/usersApiSlice";
import UserSearch from "@/components/shared/search/UsersSearch";

interface UserAutocompleteProps {
  onSelectUser: (username: string) => void;
  placeholder?: string;
}

const UserAutocomplete: React.FC<UserAutocompleteProps> = ({
  onSelectUser,
  placeholder,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data, isLoading } = useGetAllUsersQuery({ searchTerm });

  const users = data?.profiles?.results || [];

  return (
    <div className="relative">
      <UserSearch setSearchTerm={setSearchTerm} placeholder={placeholder} />

      {searchTerm && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-md bg-white shadow-md dark:bg-gray-800">
          {users.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto rounded-md dark:bg-zinc-800 dark:text-zinc-300">
              {users.map((user) => (
                <li
                  key={user.id}
                  onClick={() => {
                    onSelectUser(user.username);
                    setSearchTerm("");
                  }}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {user.full_name} (@{user.username})
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-2 dark:bg-zinc-800 dark:text-zinc-300">
              No users found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAutocomplete;
