"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  useGetMyDocumentsQuery,
  useShareDocumentMutation,
  useRevokeShareDocumentMutation,
} from "@/lib/redux/features/document/documentApiSlice";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { toast } from "react-toastify";

const ManageAccess = () => {
  const router = useRouter();
  const { id } = router.query;
  const [shareDocument] = useShareDocumentMutation();
  const [revokeAccess] = useRevokeShareDocumentMutation();
  const { data, isLoading, error } = useGetMyDocumentsQuery({ page: 1 });

  const [usersWithAccess, setUsersWithAccess] = useState([]);

  // Fetch document and shared users here, for now, assume dummy data for illustration

  useEffect(() => {
    // Simulate fetching shared users data
    if (id) {
      setUsersWithAccess([
        { id: "user1", name: "John Doe" },
        { id: "user2", name: "Jane Smith" },
      ]);
    }
  }, [id]);

  const handleShare = async () => {
    // Logic for sharing document with new users
    try {
      await shareDocument({
        id: id as string,
        shared_with: ["user3"],
      }).unwrap();
      toast.success("Document shared successfully!");
      // Update users with new access
      setUsersWithAccess([
        ...usersWithAccess,
        { id: "user3", name: "New User" },
      ]);
    } catch (error) {
      toast.error("Failed to share document.");
    }
  };

  const handleRevokeAccess = async (userId: string) => {
    // Logic for revoking access
    try {
      await revokeAccess({ id: id as string, shared_with: [userId] }).unwrap();
      toast.success(`Access revoked for ${userId}`);
      setUsersWithAccess(usersWithAccess.filter((user) => user.id !== userId));
    } catch (error) {
      toast.error("Failed to revoke access.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading document details.</div>;

  return (
    <div>
      <h2 className="text-2xl font-semibold">
        Manage Access for Document {id}
      </h2>
      <Card className="my-4 p-4">
        <div>
          <h3 className="text-lg font-semibold">Users with access:</h3>
          <ul>
            {usersWithAccess.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>{user.name}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRevokeAccess(user.id)}
                >
                  Revoke Access
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <Button variant="outline" size="sm" onClick={handleShare}>
          Share with another user
        </Button>
      </Card>
    </div>
  );
};

export default ManageAccess;
