"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["paid", "pending"]),
  date: z.string(),
});

// Create
const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
  // Type validation
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  // It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    await sql`
              INSERT INTO invoices (customer_id, amount, status, date)
              VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
          `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }
  // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.
  revalidatePath("/dashboard/invoices");

  redirect("/dashboard/invoices");
}

// Update
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  const amountInCents = amount * 100;

  try {
    await sql`
              UPDATE invoices
              SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
              WHERE id = ${id}
          `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Invoice.",
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

// Delete
export async function deleteInvoice(id: string) {
  try {
    await sql`
              DELETE FROM invoices
              WHERE id = ${id}
          `;
    revalidatePath("/dashboard/invoices");
    return {
      message: "Deleted Invoice Successfully.",
    };
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice.",
    };
  }
}
