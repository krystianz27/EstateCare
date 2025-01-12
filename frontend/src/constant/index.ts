import { LeftNavLink } from "@/types/navigation";

type OptionType = {
  value: "reported" | "resolved" | "in_progress" | "low" | "medium" | "high";
  label: string;
};

export const statusOptions: OptionType[] = [
  { value: "reported", label: "Reported" },
  { value: "resolved", label: "Resolved" },
  { value: "in_progress", label: "In Progress" },
];

export const priorityOptions: OptionType[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const occupationOptions = [
  { value: "mason", label: "Mason" },
  { value: "carpenter", label: "Carpenter" },
  { value: "plumber", label: "Plumber" },
  { value: "roofer", label: "Roofer" },
  { value: "painter", label: "Painter" },
  { value: "electrician", label: "Electrician" },
  { value: "gardener", label: "Gardener" },
  { value: "hvac", label: "HVAC" },
  { value: "tenant", label: "Tenant" },
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
    path: "/tenants",
    label: "Tenants",
    imgLocation: "/assets/icons/tenants.svg",
  },

  {
    path: "/technicians",
    label: "Technicians",
    imgLocation: "/assets/icons/technician.svg",
  },
  {
    path: "/issue/report-issue",
    label: "Report an Issue",
    imgLocation: "/assets/icons/report.svg",
  },

  {
    path: "/report/report-tenant",
    label: "Report a Tenant",
    imgLocation: "/assets/icons/speak.svg",
  },
  {
    path: "/posts/bookmark",
    label: "Bookmarked Posts",
    imgLocation: "/assets/icons/bookmark.svg",
  },
  {
    path: "/posts/create-post",
    label: "Create a Post....",
    imgLocation: "/assets/icons/question-file.svg",
  },
];
