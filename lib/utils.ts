import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function prismaObjectToJS<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
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
