"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserAutocomplete from "../shared/search/UserAutocomplete";
import { SharedWithUserData } from "@/types";

interface DocumentAccessDialogProps {
  documentId: string;
  onShare: (userIds: string[]) => void;
  onRevoke: (userIds: string[]) => void;
  sharedWithUsers: SharedWithUserData[];
  isOpen: boolean;
  onClose: () => void;
}

const DocumentAccessDialog: React.FC<DocumentAccessDialogProps> = ({
  documentId,
  onShare,
  onRevoke,
  sharedWithUsers,
  isOpen,
  onClose,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [tenantIdsToAdd, setTenantIdsToAdd] = useState<string[]>([]);

  const handleUserChange = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSelectUserToAdd = (username: string) => {
    if (!tenantIdsToAdd.includes(username)) {
      setTenantIdsToAdd([...tenantIdsToAdd, username]);
    }
  };

  const handleShare = () => {
    if (tenantIdsToAdd.length > 0) {
      onShare(tenantIdsToAdd);
      setTenantIdsToAdd([]);
      onClose();
    }
  };

  const handleRevoke = () => {
    if (selectedUsers.length > 0) {
      onRevoke(selectedUsers);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/60" />
      <DialogContent className="bg-slate-100 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Manage Document Access</DialogTitle>
          <DialogDescription>
            Select users to share or revoke access.
          </DialogDescription>
        </DialogHeader>

        <div>
          <UserAutocomplete
            onSelectUser={handleSelectUserToAdd}
            placeholder="Enter username or email"
          />
        </div>

        <h3>Users waiting to be granted an access:</h3>
        <div className="mt-2">
          {tenantIdsToAdd.map((username) => (
            <div
              key={username}
              className="mb-2 flex items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-gray-800"
            >
              <span>{username}</span>
              <button
                onClick={() =>
                  setTenantIdsToAdd(
                    tenantIdsToAdd.filter((id) => id !== username),
                  )
                }
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleShare}>
          Share to Selected Users
        </Button>

        <div className="mt-2">
          <h3 className="text-sm font-semibold">
            Users who have access to this document:
          </h3>
          {sharedWithUsers.map((user) => (
            <div key={user.id}>
              <input
                type="checkbox"
                id={user.id}
                onChange={() => handleUserChange(user.id)}
              />
              <label htmlFor={user.id}>
                {user.full_name} (@{user.username})
              </label>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleRevoke}>
          Revoke Access
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentAccessDialog;
