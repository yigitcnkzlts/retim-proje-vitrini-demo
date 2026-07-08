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

export interface DbContactSubmission {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  building: string | null;
  service: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
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
