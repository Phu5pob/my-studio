// Global types for Next.js App Router pages and layouts
// Used instead of Next.js 16's auto-generated route types

declare type PageProps<_Route extends string = string> = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

declare type LayoutProps<_Route extends string = string> = {
  children: React.ReactNode;
  params?: Promise<Record<string, string>>;
};
