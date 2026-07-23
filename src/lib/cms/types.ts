export type RefType = "catalog" | "archive";

export interface DbProjectRef {
  id: string;
  ref_no: string;
  project_name: string;
  service: string;
  district: string;
  year: number;
  ref_type: RefType;
  created_at: string;
  updated_at: string;
}

export interface DbProject {
  id: string;
  ref_id: string | null;
  slug: string;
  name: string;
  district: string;
  year: number;
  ref_no: string;
  service: string;
  service_slug: string;
  building_type: string;
  duration: string;
  featured: boolean;
  published: boolean;
  short_description: string;
  description: string;
  scope: string[];
  highlights: string[];
  image_url: string | null;
  image_fallback: string | null;
  image_alt: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbPartner {
  id: string;
  name: string;
  logo_url: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = "new" | "contacted" | "in_progress" | "closed";

export interface DbContactSubmission {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  building: string | null;
  service: string | null;
  message: string | null;
  is_read: boolean;
  status: SubmissionStatus;
  admin_note: string;
  created_at: string;
}

export interface DbService {
  id: string;
  slug: string;
  name: string;
  description: string;
  detail: string;
  image_url: string | null;
  image_alt: string;
  project_types: string[];
  sort_order: number;
  active: boolean;
  featured: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface DbHomeContent {
  id: number;
  hero_title: string;
  hero_description: string;
  stats: Array<{ value: string; label: string }>;
  discovery_lead: string;
  approach_steps: Array<{ title: string; description: string }>;
  home_districts: string[];
  updated_at: string;
}

export interface DbAboutContent {
  id: number;
  intro: string;
  experience: string;
  team: string;
  closing: string;
  founder_name: string;
  founder_title: string;
  founder_image: string;
  updated_at: string;
}

export interface ProjectInput {
  slug: string;
  name: string;
  district: string;
  year: number;
  ref_no: string;
  service: string;
  service_slug: string;
  building_type: string;
  duration: string;
  featured: boolean;
  published: boolean;
  short_description: string;
  description: string;
  scope: string[];
  highlights: string[];
  image_url?: string | null;
  image_fallback?: string | null;
  image_alt?: string | null;
  ref_id?: string | null;
}

export interface ProjectRefInput {
  ref_no: string;
  project_name: string;
  service: string;
  district: string;
  year: number;
  ref_type: RefType;
}
