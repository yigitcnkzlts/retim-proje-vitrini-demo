export const MEDIA_FOLDERS = [
  { id: "general", label: "Genel" },
  { id: "projects", label: "Projeler" },
  { id: "services", label: "Hizmetler" },
  { id: "partners", label: "Çözüm Ortakları" },
  { id: "home", label: "Ana Sayfa" },
  { id: "about", label: "Hakkımızda" },
] as const;

export type MediaFolderId = (typeof MEDIA_FOLDERS)[number]["id"];

export function mediaFolderLabel(id: string): string {
  return MEDIA_FOLDERS.find((f) => f.id === id)?.label ?? id;
}

export function isKnownMediaFolder(id: string): boolean {
  return MEDIA_FOLDERS.some((f) => f.id === id);
}
