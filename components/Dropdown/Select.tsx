import type { OptionType } from "@components/types";
import { default as Image } from "next/image";
import { default as Label, LabelProps } from "@components/Label";
import { Fragment, ReactElement, ReactNode } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";

type CommonProps<L, V> = {
  className?: string;
  disabled?: boolean;
  options?: Record<string, OptionType<string, string>[]> | never[];
  label?: string;
  sublabel?: ReactNode;
  anchor?: "left" | "right";
};

type ConditionalProps =
  | {
      multiple?: true;
      selected?: any[];
      title: string;
      placeholder?: never;
      onChange: (selected: any[]) => void;
    }
  | {
      multiple?: false;
      selected?: any;
      title?: never;
      placeholder?: string;
      onChange: (selected: any) => void;
    };

type SelectProps<L, V> = CommonProps<L, V> & ConditionalProps & LabelProps;

const Select = <L extends string | number | ReactElement = string, V = string>({
  className = "relative  lg:w-fit flex items-center gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm",
  disabled = false,
  multiple = false,
  options = dummy,
  selected,
  onChange,
  title,
  anchor = "right",
  placeholder,
  label,
  sublabel,
}: SelectProps<L, V>) => {
  const isSelected = (option: OptionType<L, V>): boolean => {
    return (
      multiple &&
      option &&
      (selected as OptionType<L, V>[]).some((item: OptionType<L, V>) => item.value === option.value)
    );
  };

  const handleDeselect = (option: OptionType<L, V>): any => {
    return (selected as OptionType<L, V>[]).filter(
      (item: OptionType<L, V>) => item.value !== option.value
    );
  };
  const handleChange = (options: any) => {
    if (!multiple) return onChange(options);

    const added = options;
    if (!isSelected(added)) {
      selected ? onChange([...selected, options]) : onChange([options]);
    } else {
      onChange(handleDeselect(added));
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label label={label}></Label>}
      <Listbox
        value={selected}
        onChange={(option: OptionType<L, V> & OptionType<L, V>[]) =>
          !multiple && handleChange(option)
        }
        multiple={multiple}
        disabled={disabled}
      >
        <div className={`relative text-sm ${disabled ? "cursor-not-allowed" : ""}`}>
          <Listbox.Button
            className={[
              "relative flex items-center gap-[6px] rounded-md border py-[6px] pl-3 pr-8 text-left shadow-sm",
              className,
              disabled
                ? "pointer-events-none bg-outline text-dim"
                : "hover:border-outlineHover focus:outline-none focus-visible:ring-0",
            ].join(" ")}
          >
            <>
              {sublabel && <span className="truncate text-dim">{sublabel}</span>}

              <span className={`block truncate ${label ? "" : ""}`}>
                {multiple
                  ? title
                  : (selected as OptionType<L, V>)?.label || placeholder || "Select"}
              </span>
              {/* NUMBER OF OPTIONS SELECTED (MULTIPLE = TRUE) */}
              {multiple && (selected as OptionType<L, V>[])?.length > 0 && (
                <span className="rounded-md bg-black px-1 py-0.5 text-xs text-white">
                  {selected && (selected as OptionType<L, V>[]).length}
                </span>
              )}
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5">
                <ChevronDownIcon className="h-5 w-5 text-dim" aria-hidden="true" />
              </span>
            </>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options
              className={[
                "absolute z-20 mt-1 max-h-80 min-w-full overflow-auto rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                anchor === "right" ? "right-0" : "left-0",
              ].join(" ")}
            >
              {Object.entries(options).map(([key, _options]) => (
                <div className="relative bg-white">
                  <h5 className="sticky top-0 z-10 bg-washed py-1.5 px-4 text-base">{key}</h5>
                  <div>
                    {_options.map((option, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          [
                            "relative flex cursor-default select-none items-center gap-2 py-2 pr-4 transition-all hover:bg-washed",
                            multiple ? "pl-10" : "pl-8",
                          ].join(" ")
                        }
                        onClick={() => (multiple ? handleChange(option) : null)}
                        value={option}
                      >
                        <span
                          className={`block truncate ${
                            option === selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {option.label}
                        </span>
                        {multiple && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <input
                              type="checkbox"
                              checked={
                                selected &&
                                (selected as OptionType<L, V>[]).some(
                                  item => item.value === option.value
                                )
                              }
                              className="h-4 w-4 rounded border-outline text-dim focus:ring-0"
                            />
                          </span>
                        )}
                      </Listbox.Option>
                    ))}
                  </div>
                </div>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;

const dummy: Record<string, OptionType<string, string>[]> = {
  "Healthcare > Dental Services": [
    {
      label: "Scaling",
      value: "dental_services",
    },
    {
      label: "Brushing",
      value: "private_clinic",
    },
    {
      label: "Extraction",
      value: "dermatological_center",
    },
  ],
  "Healthcare > Optometry": [
    {
      label: "Optical lenses",
      value: "dental_services",
    },
    {
      label: "Laser eye surgery",
      value: "private_clinic",
    },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
    //   ],
    //   Tourism: [
    //     {
    //       label: "Dental Services",
    //       value: "dental_services",
    //     },
    //     {
    //       label: "Private Clinic",
    //       value: "private_clinic",
    //     },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
    //   ],
    //   Pharmaceutical: [
    //     {
    //       label: "Dental Services",
    //       value: "dental_services",
    //     },
    //     {
    //       label: "Private Clinic",
    //       value: "private_clinic",
    //     },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
    //   ],
    //   Healthcare4: [
    //     {
    //       label: "Dental Services",
    //       value: "dental_services",
    //     },
    //     {
    //       label: "Private Clinic",
    //       value: "private_clinic",
    //     },
    //     {
    //       label: "Dermatology Center",
    //       value: "dermatological_center",
    //     },
  ],
};
