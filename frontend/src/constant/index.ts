import { LeftNavLink } from "@/types/navigation";

export type StatusValue = "reported" | "resolved" | "in_progress";
export type PriorityValue = "low" | "medium" | "high";

export const statusOptions: { value: StatusValue; label: string }[] = [
  { value: "reported", label: "Reported" },
  { value: "resolved", label: "Resolved" },
  { value: "in_progress", label: "In Progress" },
];

export const priorityOptions: { value: PriorityValue; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const occupationOptions = [
  { value: "plumber", label: "Plumber" },
  { value: "electrician", label: "Electrician" },
  { value: "hvac", label: "HVAC" },
  { value: "locksmith", label: "Locksmith" },
  { value: "handyman", label: "Handyman" },
  { value: "appliance_repair", label: "Appliance Repair Technician" },
  { value: "tenant", label: "Tenant" },
  { value: "owner", label: "Owner" },
];

export const leftNavLinks: LeftNavLink[] = [
  {
    path: "/welcome",
    label: "Home",
    imgLocation: "/assets/icons/home.svg",
  },
  {
    path: "/profile",
    label: "Profile",
    imgLocation: "/assets/icons/user-profile.svg",
  },
  {
    path: "/apartment",
    label: "Apartments",
    imgLocation: "/assets/icons/apartments.svg",
  },
  // {
  //   path: "/posts",
  //   label: "Posts",
  //   imgLocation: "/assets/icons/posts.svg",
  // },
  {
    path: "/rentalcontracts",
    label: "Contracts",
    imgLocation: "/assets/icons/handshake.svg",
  },
  {
    path: "/documents",
    label: "Documents",
    imgLocation: "/assets/icons/documents.svg",
  },
  {
    path: "/tenants",
    label: "Tenants",
    imgLocation: "/assets/icons/tenants.svg",
  },

  {
    path: "/technicians",
    label: "Technicians",
    imgLocation: "/assets/icons/technicians.svg",
  },
  {
    path: "/issue/report-issue",
    label: "Report an Issue",
    imgLocation: "/assets/icons/report-issue.svg",
  },

  // {
  //   path: "/report/report-tenant",
  //   label: "Report a Tenant",
  //   imgLocation: "/assets/icons/report-tenant.svg",
  // },
  // {
  //   path: "/posts/bookmark",
  //   label: "Bookmarked Posts",
  //   imgLocation: "/assets/icons/bookmark.svg",
  // },
  // {
  //   path: "/posts/create-post",
  //   label: "Create a Post....",
  //   imgLocation: "/assets/icons/create-post.svg",
  // },
];
