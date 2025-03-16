"use client";

import { useGetUserQuery } from "@/lib/redux/features/auth/authApiSlice";
import ProtectedRoute from "@/components/shared/ProtectedRoutes";
import { useEffect, useState } from "react";

import ApartmentDetailContent from "@/components/apartment/ApartmentDetailContent";
import ChatWindow from "@/components/chat/ChatWindow";

interface ParamsProps {
  params: Promise<{
    id: string;
  }>;
}

const ApartmentPageContent = ({ apartmentId }: { apartmentId: string }) => {
  const { data: currentUser, isLoading, isError } = useGetUserQuery();

  if (isLoading) {
    return <p>Loading user data...</p>;
  }

  if (isError || !currentUser) {
    return <p>Error loading user data.</p>;
  }

  return (
    <>
      <ApartmentDetailContent
        apartmentId={apartmentId}
        currentUser={currentUser}
      />
      <ChatWindow apartmentId={apartmentId} currentUser={currentUser} />
    </>
  );
};

export default function ApartmentPage({ params }: ParamsProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    const fetchParams = async () => {
      const result = await params;
      setResolvedParams(result);
    };

    fetchParams();
  }, [params]);

  if (!resolvedParams) {
    return <p>Loading...</p>;
  }

  return (
    <ProtectedRoute>
      <ApartmentPageContent apartmentId={resolvedParams.id} />
    </ProtectedRoute>
  );
}
