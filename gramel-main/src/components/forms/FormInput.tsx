"use client";

import { cn } from "@/lib/utils";
import {
  type FieldError,
  type FieldValues,
  type Path,
  type UseFormRegister,
  Controller,
  Control,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface NewFormInputProps<T extends FieldValues> {
  name: Path<T>;
  type: string;
  min?: string;
  step?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: FieldError;
  className?: string;
  disabled?: boolean;
  list?: string;
  register: UseFormRegister<T>;
}
export function NewFormInput<T extends FieldValues>({
  name,
  type,
  label,
  error,
  className,
  required = true,
  register,
  ...props
}: NewFormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField && showPassword ? "text" : type;

  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={`block max-w-max text-sm font-medium text-[#1e1e1e] ${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          {...props}
          id={name}
          required={required}
          {...register(name)}
          className={cn(
            "mt-2.5 block w-full rounded-xl border bg-[#EFEFEF] p-4 text-neutral-500 shadow-sm transition-all duration-200 placeholder:text-sm placeholder:text-[#626060] hover:ring-3 hover:ring-[#62A9DC]/50 focus:ring-3 focus:ring-[#62A9DC] focus:outline-none",
            error ? "border-red-500 bg-red-50" : "border-transparent",
            isPasswordField ? "pr-14" : "",
            className,
          )}
        />
        {isPasswordField && (
          <button
            title={showPassword ? "Hide password" : "Show password"}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full bg-white p-2 text-neutral-500 hover:text-neutral-700 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error?.message && (
        <small className="mt-1 text-sm text-red-500">{error.message}</small>
      )}
    </div>
  );
}

export function FormTextArea<T extends FieldValues>({
  name,
  label,
  error,
  className,
  required = true,
  register,
  ...props
}: Omit<NewFormInputProps<T>, "type">) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-[#1e1e1e] ${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        {...register(name)}
        id={name}
        name={name}
        required={required}
        className={cn(
          "mt-2 block h-32 w-full rounded-xl border bg-[#EFEFEF] p-4 text-neutral-500 shadow-sm transition-all duration-200 placeholder:text-sm placeholder:text-[#626060] hover:ring-3 hover:ring-[#62A9DC]/50 focus:ring-3 focus:ring-[#62A9DC] focus:outline-none",
          error ? "border-red-500 bg-red-50" : "border-transparent",
          className,
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

type SelectOption = string | { label: string; value: string };

interface FormSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  options: SelectOption[];
  required?: boolean;
  error?: FieldError;
  className?: string;
  selectItemClassName?: string;
  disabled?: boolean;
  placeholder?: string;
  control: Control<T>;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  className,
  selectItemClassName,
  required = true,
  placeholder,
  disabled,
  control,
}: FormSelectProps<T>) {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className={`block max-w-max text-sm font-medium text-[#1e1e1e] ${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}
        >
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="mt-2.5">
              <Select
                {...field}
                onValueChange={field.onChange}
                disabled={disabled}
              >
                <SelectTrigger
                  id={name}
                  className={cn(
                    "w-full rounded-xl border bg-white px-4 py-4 text-base text-neutral-500 shadow-sm duration-200 hover:ring-3 hover:ring-[#62A9DC]/50 focus:ring-3 focus:ring-[#62A9DC] focus:outline-none disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:opacity-100 disabled:hover:ring-0 data-[placeholder]:text-[#1e1e1e] data-[size=default]:h-auto",
                    error ? "border-red-500 bg-red-50" : "border-[#EFEFEF]",
                    className,
                  )}
                  chevronClassName="text-[#1e1e1e] opacity-100"
                >
                  <SelectValue
                    placeholder={placeholder || "Select an option"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {!required && (
                    <SelectItem
                      value=" "
                      className={cn(
                        "focus:bg-primary-300/10",
                        selectItemClassName,
                      )}
                    >
                      {placeholder || "Select an option"}
                    </SelectItem>
                  )}
                  {options.map((opt) => {
                    return (
                      <SelectItem
                        key={typeof opt === "string" ? opt : opt.value}
                        value={typeof opt === "string" ? opt : opt.value}
                        className={cn(
                          "focus:bg-primary-300/10",
                          selectItemClassName,
                        )}
                      >
                        {typeof opt === "string" ? opt : opt.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            {error?.message && (
              <small className="mt-1 text-sm text-red-500">
                {error.message}
              </small>
            )}
          </>
        )}
      />
    </div>
  );
}
