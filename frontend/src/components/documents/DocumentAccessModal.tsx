import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal"; // Załóżmy, że masz taki komponent
import {
  useShareDocumentMutation,
  useRevokeShareDocumentMutation,
} from "@/lib/redux/features/document/documentApiSlice";

const DocumentAccessModal = ({ document, isOpen, onClose }) => {
  const [shareDocument] = useShareDocumentMutation();
  const [revokeShareDocument] = useRevokeShareDocumentMutation();

  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleShare = async () => {
    try {
      await shareDocument({
        id: document.id,
        shared_with: selectedUsers,
      }).unwrap();
      onClose();
    } catch (error) {
      alert("Failed to share document.");
    }
  };

  const handleRevokeAccess = async () => {
    try {
      await revokeShareDocument({
        id: document.id,
        shared_with: selectedUsers,
      }).unwrap();
      onClose();
    } catch (error) {
      alert("Failed to revoke access.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-lg font-semibold">Manage Access</h2>
        {/* Wyświetl listę użytkowników i umożliw wybór */}
        <div>
          <label>Select Users to Share with:</label>
          <select
            multiple
            value={selectedUsers}
            onChange={(e) =>
              setSelectedUsers(
                [...e.target.selectedOptions].map((option) => option.value),
              )
            }
            className="w-full border p-2"
          >
            {/* Zakładając, że masz listę użytkowników */}
            {document.shared_with_users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.id}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleShare}>Share</Button>
          <Button onClick={handleRevokeAccess}>Revoke Access</Button>
        </div>
      </div>
    </Modal>
  );
};
