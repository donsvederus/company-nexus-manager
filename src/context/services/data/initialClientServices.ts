
import { ClientService } from "@/types/service";

// Sample client services data
export const initialClientServices: ClientService[] = [
  {
    id: "1",
    clientId: "1",
    serviceId: "1",
    customCost: 8.99,
    notes: "Discounted hosting plan",
    domain: "acmecorp.com",
    isActive: true
  },
  {
    id: "2",
    clientId: "1",
    serviceId: "2",
    notes: "Using default cost",
    domain: "acmecorp.com",
    isActive: true
  },
  {
    id: "3",
    clientId: "1",
    serviceId: "6",
    customCost: 100.00,
    notes: "Enhanced maintenance package",
    domain: "acmecorp.com",
    isActive: true
  },
  {
    id: "4",
    clientId: "3",
    serviceId: "7",
    customCost: 399.99,
    notes: "Premium SEO package",
    domain: "wayneenterprises.com",
    isActive: true
  },
  {
    id: "5",
    clientId: "3",
    serviceId: "1",
    customCost: 29.99,
    notes: "Enterprise hosting",
    domain: "wayneenterprises.com",
    isActive: true
  },
  {
    id: "6",
    clientId: "3",
    serviceId: "6",
    customCost: 250.00,
    notes: "Premium maintenance",
    domain: "wayneenterprises.com",
    isActive: true
  },
  {
    id: "7",
    clientId: "4",
    serviceId: "1",
    customCost: 19.99,
    notes: "Custom hosting solution",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "8",
    clientId: "4",
    serviceId: "4",
    notes: "Complete website redesign",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "9",
    clientId: "4",
    serviceId: "7",
    customCost: 499.99,
    notes: "Premium SEO package",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "10",
    clientId: "4",
    serviceId: "8",
    customCost: 799.99,
    notes: "Advanced PPC campaign",
    domain: "stark.com",
    isActive: true
  },
  {
    id: "11",
    clientId: "5",
    serviceId: "1",
    notes: "Standard hosting",
    domain: "oscorp.com",
    isActive: true
  },
  {
    id: "12",
    clientId: "5",
    serviceId: "6",
    customCost: 89.99,
    notes: "Basic maintenance",
    domain: "oscorp.com",
    isActive: true
  },
  {
    id: "13",
    clientId: "5",
    serviceId: "9",
    customCost: 399.99,
    notes: "Social media management",
    domain: "oscorp.com",
    isActive: true
  },
  {
    id: "14",
    clientId: "6",
    serviceId: "1",
    customCost: 24.99,
    notes: "Enhanced hosting",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "15",
    clientId: "6",
    serviceId: "2",
    notes: "Domain registration",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "16",
    clientId: "6",
    serviceId: "4",
    customCost: 1299.99,
    notes: "Custom website design",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "17",
    clientId: "6",
    serviceId: "10",
    customCost: 200.00,
    notes: "Monthly consulting",
    domain: "umbrella.com",
    isActive: true
  },
  {
    id: "18",
    clientId: "7",
    serviceId: "1",
    notes: "Standard hosting",
    domain: "cyberdyne.com",
    isActive: true
  },
  {
    id: "19",
    clientId: "7",
    serviceId: "3",
    customCost: 9.99,
    notes: "Corporate email hosting",
    domain: "cyberdyne.com",
    isActive: true
  },
  {
    id: "20",
    clientId: "7",
    serviceId: "6",
    customCost: 125.00,
    notes: "Enhanced maintenance",
    domain: "cyberdyne.com",
    isActive: true
  },
  {
    id: "21",
    clientId: "8",
    serviceId: "1",
    customCost: 12.99,
    notes: "Basic hosting package",
    domain: "initech.com",
    isActive: true
  },
  {
    id: "22",
    clientId: "8",
    serviceId: "3",
    customCost: 8.99,
    notes: "Business email package",
    domain: "initech.com",
    isActive: true
  },
  {
    id: "23",
    clientId: "8",
    serviceId: "6",
    customCost: 85.00,
    notes: "Standard maintenance",
    domain: "initech.com",
    isActive: true
  },
  {
    id: "24",
    clientId: "9",
    serviceId: "1",
    customCost: 49.99,
    notes: "Premium hosting with dedicated server",
    domain: "massivedynamic.com",
    isActive: true
  },
  {
    id: "25",
    clientId: "9",
    serviceId: "4",
    customCost: 2499.99,
    notes: "Enterprise website design",
    domain: "massivedynamic.com",
    isActive: true
  },
  {
    id: "26",
    clientId: "9",
    serviceId: "7",
    customCost: 599.99,
    notes: "Advanced SEO strategy",
    domain: "massivedynamic.com",
    isActive: true
  },
  {
    id: "27",
    clientId: "9",
    serviceId: "8",
    customCost: 999.99,
    notes: "Premium PPC management",
    domain: "massivedynamic.com",
    isActive: true
  },
  {
    id: "28",
    clientId: "9",
    serviceId: "10",
    customCost: 250.00,
    notes: "Executive consulting",
    domain: "massivedynamic.com",
    isActive: true
  },
  {
    id: "29",
    clientId: "10",
    serviceId: "1",
    customCost: 39.99,
    notes: "Premium cloud hosting",
    domain: "hooli.com",
    isActive: true
  },
  {
    id: "30",
    clientId: "10",
    serviceId: "3",
    customCost: 24.99,
    notes: "Enterprise email solution",
    domain: "hooli.com",
    isActive: true
  },
  {
    id: "31",
    clientId: "10",
    serviceId: "9",
    customCost: 499.99,
    notes: "Comprehensive social media management",
    domain: "hooli.com",
    isActive: true
  },
  {
    id: "32",
    clientId: "11",
    serviceId: "1",
    customCost: 9.99,
    notes: "Startup hosting package",
    domain: "piedpiper.com",
    isActive: true
  },
  {
    id: "33",
    clientId: "11",
    serviceId: "4",
    customCost: 799.99,
    notes: "Custom startup website design",
    domain: "piedpiper.com",
    isActive: true
  },
  {
    id: "34",
    clientId: "11",
    serviceId: "7",
    customCost: 199.99,
    notes: "Basic SEO package",
    domain: "piedpiper.com",
    isActive: true
  },
  {
    id: "35",
    clientId: "12",
    serviceId: "1",
    customCost: 29.99,
    notes: "Premium hosting for e-commerce",
    domain: "soylent.com",
    isActive: true
  },
  {
    id: "36",
    clientId: "12",
    serviceId: "6",
    customCost: 150.00,
    notes: "E-commerce maintenance",
    domain: "soylent.com",
    isActive: true
  },
  {
    id: "37",
    clientId: "12",
    serviceId: "8",
    customCost: 699.99,
    notes: "Product marketing campaign",
    domain: "soylent.com",
    isActive: true
  },
  {
    id: "38",
    clientId: "12",
    serviceId: "9",
    customCost: 449.99,
    notes: "Premium social media marketing",
    domain: "soylent.com",
    isActive: true
  }
];
