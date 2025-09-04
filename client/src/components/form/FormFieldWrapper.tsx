import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CalendarIcon, Eye, EyeOff, HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

import { PHONE_REGEX } from "@/constants/regex";

type Option = {
  value: string;
  label: string;
};

interface Props {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
  type?: "text" | "password" | "textarea" | "date" | "select" | "tel";
  withToggle?: boolean;
  withAnnotation?: boolean;
  annotation?: string;
  icon?: React.ReactNode;
  options?: Option[];
  isProfileForm?: boolean;
}

export const FormFieldWrapper = ({
  name,
  label,
  placeholder,
  required = false,
  type = "text",
  withToggle = false,
  withAnnotation = false,
  annotation,
  icon,
  options,
  isProfileForm = false,
}: Props) => {
  const { control, formState } = useFormContext();
  const [show, setShow] = useState(false);
  const [openSelectYear, setOpenSelectYear] = useState(false)
  const hasError = !!formState.errors?.[name];
  const inputType = withToggle ? (show ? "text" : "password") : type;
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i);

  const baseClasses = "grow border-0 ring-0 outline-none bg-transparent";
  const focusBorderClasses =
    "border-2 border-[#e4cbbd] focus:border-[#7f3a20] focus:ring-1 focus:ring-[#7f3a20] bg-transparent rounded px-3 py-2 placeholder:text-[#bf907e]";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex pb-5",
            isProfileForm ? "gap-2" : "gap-10",
            "items-start"
          )}
        >
          <FormLabel
            className={cn(
              "min-w-[6rem] whitespace-nowrap h-[40px] items-center  ",
              isProfileForm ? "" : "mt-[13px]"
            )}
          >
            {label}
            {required && <span className="text-red-500">*</span>}
            {withAnnotation && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle
                      className={cn(
                        "w-4 h-4 text-black cursor-pointer ml-1",
                        hasError && "text-red-500"
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className={cn(
                      "bg-white border border-black text-black [&>svg]:hidden",
                      hasError && "border-red-500 text-red-500"
                    )}
                  >
                    {annotation}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </FormLabel>

          <div className="flex flex-col w-full min-h-[4.5rem]">
            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  rows={5}
                  className={cn(focusBorderClasses)}
                />
              ) : type === "select" ? (
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={String(field.value ?? "")}
                >
                  <FormControl>
                    <SelectTrigger
                      className={cn(
                        "w-full rounded border-2 border-[#e4cbbd] px-3 py-2 text-left text-sm placeholder:text-gray-400"
                      )}
                    >
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-base-100 max-h-60 py-4 border-[#e4cbbd]">
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : type === "date" ? (
                <Popover open={openSelectYear} onOpenChange={setOpenSelectYear}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between text-left border-2 border-[#e6cec0] hover:bg-transparent focus:bg-transparent">
                      {field.value ? field.value.getFullYear() : placeholder}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] bg-[#fff7ed] max-h-[200px] overflow-y-auto border-[#e6cec0]">
                    <ul>
                      {years.map((year) => (
                        <li
                          key={year}
                          className="cursor-pointer p-2 rounded-md hover:bg-[#f3e5d9]"
                          onClick={() => {
                            const date = new Date(year, 0, 1);
                            date.setHours(12);
                            field.onChange(date);
                            setOpenSelectYear(false)
                          }}
                        >
                          {year}
                        </li>
                      ))}
                    </ul>
                  </PopoverContent>
                </Popover>
              ) : (
                <label className="input relative flex items-center gap-2 w-full">
                  {icon}
                  <input
                    {...field}
                    type={inputType}
                    placeholder={placeholder}
                    className={cn(baseClasses)}
                    onChange={(e) => {
                      if (type === "tel") {
                        const onlyNums = e.target.value.replace(
                          PHONE_REGEX,
                          ""
                        );
                        field.onChange(onlyNums);
                      } else {
                        field.onChange(e);
                      }
                    }}
                  />
                  {withToggle && (
                    <button
                      type="button"
                      className="text-gray-500"
                      onClick={() => setShow((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {show ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </label>
              )}
            </FormControl>

            <FormMessage className="text-error text-sm pt-2" />
          </div>
        </FormItem>
      )}
    />
  );
};
