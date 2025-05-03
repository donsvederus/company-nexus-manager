
import { Client } from "@/types/client";

export const entertainmentClients: Client[] = [
  {
    id: "3",
    companyName: "Wayne Enterprises",
    street: "1007 Mountain Drive",
    city: "Gotham City",
    state: "NJ",
    zipCode: "10101",
    accountManager: "Bruce Wayne",
    mainContact: "Lucius Fox",
    email: "lucius.fox@wayne.com",
    phone: "(555) 228-6283",
    startDate: "2020-03-30",
    status: "active",
    workLogs: [
      {
        id: "wl6",
        clientId: "3",
        description: "Advanced security system implementation",
        notes: "Installing custom security solutions",
        startTime: "2023-11-10T08:00:00Z",
        endTime: "2023-11-10T17:00:00Z",
        duration: 540,
        completed: true,
        recurring: false,
        dueDate: "2023-11-15T00:00:00Z",
        createdAt: "2023-11-05T09:00:00Z",
        updatedAt: "2023-11-10T17:00:00Z"
      },
      {
        id: "wl7",
        clientId: "3",
        description: "R&D consulting session",
        notes: "Discussion of upcoming technology trends",
        startTime: "2024-01-05T10:00:00Z",
        endTime: "2024-01-05T12:00:00Z",
        duration: 120,
        completed: true,
        recurring: true,
        recurrenceType: "quarterly",
        dueDate: "2024-01-05T00:00:00Z",
        createdAt: "2023-12-20T11:00:00Z",
        updatedAt: "2024-01-05T12:00:00Z"
      },
      {
        id: "wl8",
        clientId: "3",
        description: "Strategic planning for fiscal year",
        notes: "Budget allocation and project prioritization",
        completed: false,
        recurring: false,
        dueDate: "2025-05-10T00:00:00Z",
        createdAt: "2024-04-01T14:00:00Z",
        updatedAt: "2024-04-01T14:00:00Z"
      }
    ]
  }
];
