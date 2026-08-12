import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const applicationSchema = z.object({
  email: z.string().email().max(320),
  mobile: z.string().min(6).max(30),
  civility: z.string().max(20).optional().nullable(),
  last_name: z.string().min(1).max(120),
  first_name: z.string().min(1).max(120),
  country: z.string().min(1).max(80),
  city: z.string().max(120).optional().nullable(),
  job_title: z.string().max(120).optional().nullable(),
  structure: z.string().max(200).optional().nullable(),
  client_type: z.string().min(1).max(120),
  client_type_other: z.string().max(200).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  sender_id: z.string().min(3).max(11),
  sample_message: z.string().max(1000).optional().nullable(),
  package_slug: z.string().max(60).optional().nullable(),
  id_document_type: z.string().max(60).optional().nullable(),
  is_legal_representative: z.boolean(),
  representative: z.record(z.string(), z.string()).default({}),
  documents: z
    .array(z.object({ key: z.string(), label: z.string(), path: z.string(), name: z.string() }))
    .default([]),
});

export const submitSignupApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => applicationSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("signup_applications").insert({
      ...data,
      user_id: context.userId,
      status: "pending",
    } as never);
    if (error) throw new Error(error.message);

    await context.supabase
      .from("profiles")
      .update({
        full_name: `${data.first_name} ${data.last_name}`.trim(),
        phone: data.mobile,
        company: data.structure ?? null,
      })
      .eq("id", context.userId);

    return { ok: true };
  });

export const getMySignupApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("signup_applications")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null;
  });

export const listSignupApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("signup_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const reviewSignupApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "approved", "rejected"]),
        admin_notes: z.string().max(2000).optional().nullable(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("signup_applications")
      .update({
        status: data.status,
        admin_notes: data.admin_notes ?? null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: context.userId,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteSignupApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("signup_applications").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
