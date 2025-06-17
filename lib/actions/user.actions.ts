"use server";

import { signOut } from "@/auth";

// Sign user out
export async function signOutUser() {
  await signOut();
}
