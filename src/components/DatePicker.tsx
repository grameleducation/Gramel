"use client";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useState } from "react";
import moment from "moment";

interface DatePickerProps<T extends FieldValues> {
  label?: string;
  name: Path<T>;
  disabled?: boolean;
  required?: boolean;
  control: Control<T>;
}

export function DatePicker<T extends FieldValues>({
  label,
  disabled,
  name,
  required = true,
  control,
}: DatePickerProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-2">
      <Label
        htmlFor={name}
        className={`block max-w-max ${required ? "after:ml-0.5 after:text-red-500 after:content-['*']" : ""}`}
      >
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const validDate =
            field.value && moment(field.value, "YYYY-MM-DD", true).isValid();

          return (
            <>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id={name}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    suppressHydrationWarning
                    className={`mt-2.5 h-auto w-full justify-between rounded-xl border p-4 text-base! font-normal text-neutral-500 shadow-gray-300 duration-200 hover:bg-transparent hover:ring-3 hover:ring-[#62A9DC]/50 focus:border-0 focus:ring-3 focus:ring-[#62A9DC] focus:outline-none disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-[#EFEFEF] disabled:opacity-100 disabled:hover:ring-0 has-[>svg]:px-4 ${error ? "border-red-500 bg-red-50" : "border-[#EFEFEF] bg-white"}`}
                  >
                    {validDate
                      ? moment(field.value, "YYYY-MM-DD").format(
                          "MMMM Do, YYYY",
                        )
                      : "Select date"}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="pointer-events-auto w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    captionLayout="dropdown"
                    selected={
                      validDate
                        ? moment(field.value, "YYYY-MM-DD").toDate()
                        : undefined
                    }
                    defaultMonth={
                      validDate
                        ? moment(field.value, "YYYY-MM-DD").toDate()
                        : undefined
                    }
                    startMonth={new Date(1925, 0)} // January 1, 1925
                    endMonth={new Date(2100, 12)} // December 31, 2100
                    onSelect={(selectedDate) => {
                      console.log("selectedDate", selectedDate);
                      if (selectedDate)
                        field.onChange(
                          moment(selectedDate).format("YYYY-MM-DD"),
                        );
                      else field.onChange("");
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {error?.message && (
                <small className="mt-1 block text-sm text-red-500">
                  {error.message}
                </small>
              )}
            </>
          );
        }}
      />
    </div>
  );
}
