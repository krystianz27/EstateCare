import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import React from "react";
import {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type FormFieldComponentProps<TFieldValues extends FieldValues> = {
  label?: string;
  name: Path<TFieldValues>;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
  isTextArea?: boolean;
  link?: {
    linkText: string;
    linkUrl: string;
  };
  className?: string;
  disabled?: boolean;
  inputProps?:
    | React.InputHTMLAttributes<HTMLInputElement>
    | React.TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export function FormFieldComponent<TFieldValues extends FieldValues>({
  label,
  name,
  register,
  disabled = false,
  errors,
  type = "text",
  placeholder,
  required = false,
  startIcon,
  endIcon,
  link,
  className,
  isPassword = false,
  isTextArea = false,
  inputProps,
}: FormFieldComponentProps<TFieldValues>) {
  const errorMessage = errors[name]?.message as unknown as string;

  const renderInputComponent = () => {
    if (isTextArea) {
      return (
        <Textarea
          {...register(name, { required })}
          placeholder={placeholder}
          className={`dark:text-babyPowder ${className}`}
          {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} // Typowanie dla Textarea
        />
      );
    } else if (isPassword) {
      return (
        <PasswordInput
          {...register(name, { required })}
          placeholder={placeholder}
          {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)} // Typowanie dla PasswordInput
        />
      );
    } else {
      return (
        <Input
          id={name}
          {...register(name, { required })}
          type={type}
          placeholder={placeholder}
          startIcon={startIcon}
          endIcon={endIcon}
          disabled={disabled}
          className={`dark:text-babyPowder ${className}`}
          {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)} // Typowanie dla Input
        />
      );
    }
  };

  return (
    <div>
      <div className="mb-1 flex justify-between">
        <label htmlFor={name} className="h4-semibold dark:text-babyPowder mb-1">
          {label}
        </label>
        {link && (
          <Link
            href={link.linkUrl}
            className="h4-semibold cursor-pointer hover:text-indigo-500 dark:text-lime-500 dark:hover:text-indigo-500"
          >
            {link.linkText}
          </Link>
        )}
      </div>
      <div className="mt-1">{renderInputComponent()}</div>
      {errorMessage && (
        <span className="mt-2 text-sm text-red-500">{errorMessage}</span>
      )}
    </div>
  );
}
