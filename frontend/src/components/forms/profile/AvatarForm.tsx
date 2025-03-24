import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

export default function AvatarForm() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadFileHandler = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", selectedFile);
    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      await axios.patch("/api/v1/profiles/user/avatar/", formData, config);
      toast.success("Avatar updated successfully!");
      setSelectedFile(null);
    } catch (error) {
      toast.error("Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 flex w-full flex-col items-center gap-3">
      <Input
        accept="image/*"
        className="file:bg-eerieBlack dark:border-platinum dark:text-platinum cursor-pointer file:mr-3 file:rounded-md file:text-lime-500"
        id="avatar"
        name="avatar"
        type="file"
        onChange={handleFileChange}
      />
      <Button
        onClick={uploadFileHandler}
        disabled={!selectedFile || uploading}
        className="bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400 w-full"
      >
        {uploading ? <Spinner size="sm" /> : "Upload Photo"}
      </Button>
    </div>
  );
}
