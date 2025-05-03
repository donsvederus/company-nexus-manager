
import { Client } from "@/types/client";

export const serviceClients: Client[] = [
  {
    id: "2",
    companyName: "Globex Industries",
    street: "456 Tech Blvd",
    city: "Innovation City",
    state: "NY",
    zipCode: "67890",
    accountManager: "Michael Johnson",
    mainContact: "Sarah Williams",
    email: "sarah@globex.com",
    phone: "(555) 987-6543",
    startDate: "2021-06-22",
    status: "inactive",
    lastContactDate: "2023-05-22",
    workLogs: [
      {
        id: "wl4",
        clientId: "2",
        description: "Server migration",
        notes: "Moving from on-premise to cloud infrastructure",
        startTime: "2023-08-20T09:00:00Z",
        endTime: "2023-08-20T18:00:00Z",
        duration: 540,
        completed: true,
        recurring: false,
        dueDate: "2023-08-25T00:00:00Z",
        createdAt: "2023-08-15T10:00:00Z",
        updatedAt: "2023-08-20T18:00:00Z"
      },
      {
        id: "wl5",
        clientId: "2",
        description: "Security audit",
        notes: "Comprehensive security review",
        completed: false,
        recurring: false,
        dueDate: "2025-06-01T00:00:00Z",
        createdAt: "2023-12-01T14:00:00Z",
        updatedAt: "2023-12-01T14:00:00Z"
      }
    ]
  },
  {
    id: "5",
    companyName: "Oscorp",
    street: "888 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10003",
    accountManager: "Harry Osborn",
    mainContact: "Norman Osborn",
    email: "norman@oscorp.com",
    phone: "(555) 672-9090",
    startDate: "2021-02-18",
    status: "active",
  },
  {
    id: "9",
    companyName: "Massive Dynamic",
    street: "555 Broadway",
    city: "New York",
    state: "NY",
    zipCode: "10012",
    accountManager: "Nina Sharp",
    mainContact: "Walter Bishop",
    email: "walter@massivedynamic.com",
    phone: "(555) 444-5555",
    startDate: "2021-11-02",
    status: "active",
    website: "massivedynamic.com"
  }
];
