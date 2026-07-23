import { z } from "zod";

export const contactPayloadSchema = z.object({
  name: z.string().trim().min(3, "Ad soyad en az 3 karakter olmalıdır."),
  phone: z.string().trim().min(10, "Geçerli bir telefon numarası girin."),
  email: z.string().trim().email("Geçerli bir e-posta girin.").optional().or(z.literal("")),
  building: z.string().trim().optional().or(z.literal("")),
  service: z.string().trim().min(1, "Lütfen bir hizmet türü seçin."),
  message: z.string().trim().optional().or(z.literal("")),
});

export const projectInputSchema = z.object({
  slug: z.string().trim().min(2),
  name: z.string().trim().min(2),
  district: z.string().trim().min(1),
  year: z.number().int().min(1900).max(2100),
  ref_no: z.string().trim().default(""),
  service: z.string().trim().default(""),
  service_slug: z.string().trim().default(""),
  building_type: z.string().trim().default("Apartman"),
  duration: z.string().trim().default("—"),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  short_description: z.string().trim().default(""),
  description: z.string().trim().default(""),
  scope: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  image_url: z.string().trim().nullable().optional(),
  image_fallback: z.string().trim().nullable().optional(),
  image_alt: z.string().trim().nullable().optional(),
});

export const serviceInputSchema = z.object({
  slug: z.string().trim().min(2),
  name: z.string().trim().min(2),
  description: z.string().trim().min(10),
  detail: z.string().trim().optional().default(""),
  image_url: z.string().trim().nullable().optional(),
  image_alt: z.string().trim().optional().default(""),
  project_types: z.array(z.string()).default([]),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  seo_title: z.string().trim().optional().default(""),
  seo_description: z.string().trim().optional().default(""),
});

export const siteSettingsSchema = z.object({
  phone: z.string().trim().optional(),
  officePhone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().optional(),
  addressLine1: z.string().trim().optional(),
  addressLine2: z.string().trim().optional(),
  workingHours: z.string().trim().optional(),
  workingHoursClosed: z.string().trim().optional(),
  mapsUrl: z.string().trim().optional(),
  mapsEmbedUrl: z.string().trim().optional(),
});

export const homeContentSchema = z.object({
  heroTitle: z.string().trim().min(1),
  heroDescription: z.string().trim().min(1),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).min(1),
  discoveryLead: z.string().trim().optional().default(""),
  approachSteps: z
    .array(z.object({ title: z.string().trim().min(1), description: z.string().trim().min(1) }))
    .default([]),
  homeDistricts: z.array(z.string().trim().min(1)).default([]),
});

export const aboutContentSchema = z.object({
  intro: z.string().trim().min(1),
  experience: z.string().trim().min(1),
  team: z.string().trim().min(1),
  closing: z.string().trim().min(1),
  founderName: z.string().trim().optional().default("Osman Babucci"),
  founderTitle: z.string().trim().optional().default("Kurucu"),
  founderImage: z.string().trim().optional().default("/images/retim/hakkimizda/kurumsal.jpeg"),
});
