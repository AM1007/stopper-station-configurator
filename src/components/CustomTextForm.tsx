import { useState } from "react";
import type { CustomTextData } from "../types";
import { getMaxLength, validateCustomText } from "../utils/customTextHelpers";

interface CustomTextFormProps {
  onSubmit: (data: Omit<CustomTextData, "submitted">) => void;
  initialData?: CustomTextData;
}

export function CustomTextForm({ onSubmit, initialData }: CustomTextFormProps) {
  const [lineCount, setLineCount] = useState<1 | 2>(initialData?.lineCount ?? 2);
  const [line1, setLine1] = useState(initialData?.line1 ?? "");
  const [line2, setLine2] = useState(initialData?.line2 ?? "");
  const [errors, setErrors] = useState<string[]>([]);

  const maxLength = getMaxLength(lineCount);

  const handleLineCountChange = (value: 1 | 2) => {
    setLineCount(value);
    if (value === 1) {
      setLine2("");
    }
    setErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = { lineCount, line1, line2: lineCount === 2 ? line2 : "" };
    const validation = validateCustomText(data);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(data);
  };

  return (
    <div className="flex w-full justify-center">
      <div className="max-w-126 flex-1">
        <p className="mb-5 text-center text-base font-normal lg:mb-7 lg:text-lg">
          ENTER A CUSTOM LABEL FOR YOUR DEVICE
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid w-full grid-cols-1 gap-7">
            <div className="w-full">
              <p className="mb-4 text-center text-base font-bold lg:text-lg">
                Label
              </p>

              <div className="mb-3 flex items-center justify-center gap-3 lg:mb-4">
                <label className="flex items-center justify-start gap-2 text-sm font-normal">
                  <input
                    type="radio"
                    name="lineCount"
                    value={1}
                    checked={lineCount === 1}
                    onChange={() => handleLineCountChange(1)}
                    className="size-4 appearance-none rounded-full border border-solid border-gray-400 
                               checked:border-[5px] checked:border-red-600"
                  />
                  <span>1 Line</span>
                </label>

                <label className="flex items-center justify-start gap-2 text-sm font-normal">
                  <input
                    type="radio"
                    name="lineCount"
                    value={2}
                    checked={lineCount === 2}
                    onChange={() => handleLineCountChange(2)}
                    className="size-4 appearance-none rounded-full border border-solid border-gray-400 
                               checked:border-[5px] checked:border-red-600"
                  />
                  <span>2 Lines</span>
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex w-full flex-col gap-1">
                  <input
                    type="text"
                    name="line1"
                    placeholder="Line 1"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    maxLength={maxLength}
                    autoComplete="off"
                    className="flex min-h-10 w-full items-center justify-start border border-solid 
                               border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-normal 
                               text-gray-800 placeholder:text-gray-500 
                               hover:border-gray-500 focus:border-gray-500 focus:outline-none 
                               lg:min-h-11 lg:py-2"
                  />
                </div>

                {lineCount === 2 && (
                  <div className="flex w-full flex-col gap-1">
                    <input
                      type="text"
                      name="line2"
                      placeholder="Line 2"
                      value={line2}
                      onChange={(e) => setLine2(e.target.value)}
                      maxLength={maxLength}
                      autoComplete="off"
                      className="flex min-h-10 w-full items-center justify-start border border-solid 
                                 border-gray-300 bg-gray-100 px-3 py-1.5 text-sm font-normal 
                                 text-gray-800 placeholder:text-gray-500 
                                 hover:border-gray-500 focus:border-gray-500 focus:outline-none 
                                 lg:min-h-11 lg:py-2"
                    />
                  </div>
                )}
              </div>

              <span className="mt-1 block text-center text-sm text-gray-500">
                {maxLength}-Character maximum for each line in any language
              </span>

              {errors.length > 0 && (
                <div className="mt-2 text-center text-sm text-red-600">
                  {errors.map((error, i) => (
                    <p key={i}>{error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 flex w-full flex-col items-center gap-2 lg:gap-4">
            <button
              type="submit"
              className="inline-flex min-h-9 items-center justify-center border-4 border-red-600 
                         bg-red-600 px-4.5 py-0.5 text-sm font-bold text-white 
                         transition-all duration-300 hover:border-red-700 hover:bg-red-700 
                         focus:border-red-300 lg:min-h-11 lg:px-6 lg:py-1 lg:text-base"
            >
              Submit
            </button>

            <span className="block text-center text-sm text-red-600">
              CUSTOM PRODUCTS ARE NON-RETURNABLE
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}