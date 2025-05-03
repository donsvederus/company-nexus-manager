
import { Service } from "@/types/service";

// Sample initial services data
export const initialServices: Service[] = [
  {
    id: "1",
    name: "Hosting Cost",
    defaultCost: 10.99,
    category: "hosting",
    description: "Monthly web hosting fee"
  },
  {
    id: "2",
    name: "Domain Cost",
    defaultCost: 14.99,
    category: "hosting",
    description: "Annual domain registration"
  },
  {
    id: "3",
    name: "Email Cost",
    defaultCost: 5.99,
    category: "hosting",
    description: "Monthly email service"
  },
  {
    id: "4",
    name: "Web Design Cost",
    defaultCost: 999.99,
    category: "design",
    description: "One-time website design"
  },
  {
    id: "5",
    name: "Plugin License Cost",
    defaultCost: 49.99,
    category: "maintenance",
    description: "Annual plugin license"
  },
  {
    id: "6",
    name: "Maintenance Cost",
    defaultCost: 75.00,
    category: "maintenance",
    description: "Monthly maintenance service"
  },
  {
    id: "7",
    name: "SEO Cost",
    defaultCost: 299.99,
    category: "marketing",
    description: "Monthly SEO service"
  },
  {
    id: "8",
    name: "PPC Cost",
    defaultCost: 499.99,
    category: "marketing",
    description: "Monthly Pay-Per-Click management"
  },
  {
    id: "9",
    name: "Social Media Cost",
    defaultCost: 349.99,
    category: "marketing",
    description: "Monthly social media management"
  },
  {
    id: "10",
    name: "Consultant Cost",
    defaultCost: 150.00,
    category: "consulting",
    description: "Hourly consulting rate"
  },
  {
    id: "11",
    name: "Other Costs",
    defaultCost: 0,
    category: "other",
    description: "Miscellaneous costs"
  }
];
