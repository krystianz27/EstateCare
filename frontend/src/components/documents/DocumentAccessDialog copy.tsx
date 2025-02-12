"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DocumentAccessDialogProps {
  documentId: string;
  onShare: (userIds: string[]) => void;
  onRevoke: (userIds: string[]) => void;
  sharedWithUsers: string[];
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>(sharedWithUsers);

  const handleUserChange = (userId: string) => {
    setSelectedUsers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // Usunięcie użytkownika
          : [...prev, userId], // Dodanie użytkownika
    );
  };

  const handleShare = () => {
    onShare(selectedUsers); // Wywołanie funkcji z wybranymi użytkownikami
    onClose(); // Zamknięcie dialogu po wykonaniu akcji
  };

  const handleRevoke = () => {
    onRevoke(selectedUsers); // Wywołanie funkcji z wybranymi użytkownikami
    onClose(); // Zamknięcie dialogu po wykonaniu akcji
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Document Access</DialogTitle>
          <DialogDescription>
            Select users to share or revoke access.
          </DialogDescription>
        </DialogHeader>
        <div>
          {sharedWithUsers.map((userId) => (
            <div key={userId}>
              <input
                type="checkbox"
                id={userId}
                checked={selectedUsers.includes(userId)}
                onChange={() => handleUserChange(userId)} // Obsługa zmiany stanu użytkownika
              />
              <label htmlFor={userId}>{`User ${userId}`}</label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleShare}>
            Share
          </Button>
          <Button variant="destructive" onClick={handleRevoke}>
            Revoke Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentAccessDialog;
