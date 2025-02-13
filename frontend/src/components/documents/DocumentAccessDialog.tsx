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

interface DocumentAccessDialogProps {
  documentId: string;
  onShare: (userIds: string[]) => void;
  onRevoke: (userIds: string[]) => void;
  sharedWithUsers: { id: string }[]; // Mamy tylko id użytkownika
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Lista wybranych użytkowników do usunięcia
  const [newUserId, setNewUserId] = useState<string>("");
  const [pendingUsers, setPendingUsers] = useState<string[]>([]); // Lista oczekujących użytkowników

  // Funkcja do dodawania lub usunięcia użytkownika z listy
  const handleUserChange = (userId: string) => {
    setSelectedUsers(
      (prev) =>
        prev.includes(userId)
          ? prev.filter((id) => id !== userId) // Usunięcie użytkownika
          : [...prev, userId], // Dodanie użytkownika
    );
  };

  // Funkcja do dodawania nowego użytkownika po wpisaniu ID
  const handleAddUser = () => {
    if (newUserId && !pendingUsers.includes(newUserId)) {
      setPendingUsers((prev) => [...prev, newUserId]); // Dodanie nowego użytkownika do listy oczekujących
      setNewUserId(""); // Resetowanie pola po dodaniu
    }
  };

  // Funkcja do resetowania listy oczekujących
  const resetPendingUsers = () => {
    setPendingUsers([]); // Resetowanie listy oczekujących użytkowników
  };

  // Funkcja do obsługi przycisku Share
  const handleShare = () => {
    onShare(pendingUsers); // Wywołanie funkcji z użytkownikami oczekującymi na dostęp
    resetPendingUsers(); // Resetowanie listy oczekujących
    onClose(); // Zamknięcie dialogu po wykonaniu akcji
  };

  // Funkcja do obsługi przycisku Revoke
  const handleRevoke = () => {
    onRevoke(selectedUsers); // Wywołanie funkcji do usunięcia dostępu dla wybranych użytkowników
    onClose(); // Zamknięcie dialogu po wykonaniu akcji
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
          <input
            type="text"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            placeholder="Enter user ID"
            className="mb-2 border p-2"
          />
          <Button variant="outline" onClick={handleAddUser}>
            Add User to Pending List
          </Button>
        </div>

        <div className="mt-2">
          <h3 className="text-sm font-semibold">Users Waiting to be Added:</h3>
          {pendingUsers.map((userId) => (
            <div key={userId}>
              <input
                type="checkbox"
                id={userId}
                checked={true}
                onChange={() => handleUserChange(userId)}
              />
              <label htmlFor={userId}>{`User ID: ${userId}`}</label>
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleShare}>
          Share to Selected Users
        </Button>

        {/* Wyświetlanie listy obecnie dodanych użytkowników */}
        <div className="mt-2">
          <h3 className="text-sm font-semibold">Currently Added Users:</h3>
          {sharedWithUsers.map((user) => (
            <div key={user.id}>
              <input
                type="checkbox"
                id={user.id}
                // checked={false} // Domyślnie checkboxy dla "Currently Added Users" nie są zaznaczone
                onChange={() => handleUserChange(user.id)} // Zmiana stanu użytkownika
              />
              <label htmlFor={user.id}>{`User ID: ${user.id}`}</label>
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
