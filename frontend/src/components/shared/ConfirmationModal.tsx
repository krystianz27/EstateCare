import React from "react";
import { Button } from "../ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
      <div className="w-96 max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-800">
        <h3 className="mb-4 text-lg font-semibold">
          Are you sure you want to delete this document?
        </h3>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            className="w-full border-red-600 bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto "
          >
            Yes, Delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="w-full border-green-600 bg-green-600 text-white hover:bg-green-700 hover:text-white focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
