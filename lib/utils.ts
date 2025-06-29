import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Expand tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function prismaObjectToJS<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

// Format form error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatFormError(error: any) {
  if (error.name === "ZodError") {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map((field) => error.errors[field].message);
    return fieldErrors.join(". ");
  } else if (error.name === "PrismaClientKnownRequestError") {
    // Handle Prisma error
    if (error.code === "P2002") {
      const field = error.meta?.target ? error.meta.target[0] : "Field";
      return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    } else {
      // Handle other errors
      return typeof error.message === "string" ? error.message : JSON.stringify(error.message);
    }
  }
}

// Round number to 2 decimal places
export const round2 = (value: number | string) => {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100; // avoid rounding errors
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("value is not a number nor a string");
  }
};

// Format currency
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}
