
import { Client } from "@/types/client";

export const corporateClients: Client[] = [
  {
    id: "1",
    companyName: "Acme Corporation",
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
    accountManager: "Jane Smith",
    mainContact: "John Doe",
    email: "john.doe@acme.com",
    phone: "(555) 123-4567",
    startDate: "2022-01-15",
    status: "active",
    lastContactDate: "2023-08-15",
    workLogs: [
      {
        id: "wl1",
        clientId: "1",
        description: "Website maintenance",
        notes: "Updated plugins and performed security checks",
        startTime: "2023-09-15T10:00:00Z",
        endTime: "2023-09-15T12:30:00Z",
        duration: 150,
        completed: true,
        recurring: true,
        recurrenceType: "monthly",
        dueDate: "2023-09-20T00:00:00Z",
        createdAt: "2023-09-10T08:00:00Z",
        updatedAt: "2023-09-15T12:30:00Z"
      },
      {
        id: "wl2",
        clientId: "1",
        description: "SEO optimization",
        notes: "Keyword research and meta tag updates",
        startTime: "2023-10-05T14:00:00Z",
        endTime: "2023-10-05T17:00:00Z",
        duration: 180,
        completed: true,
        recurring: false,
        dueDate: "2023-10-10T00:00:00Z",
        createdAt: "2023-10-01T09:30:00Z",
        updatedAt: "2023-10-05T17:00:00Z"
      },
      {
        id: "wl3",
        clientId: "1",
        description: "Content creation for Q4",
        notes: "Create blog posts for upcoming promotions",
        completed: false,
        recurring: false,
        dueDate: "2025-05-25T00:00:00Z",
        createdAt: "2023-11-15T11:00:00Z",
        updatedAt: "2023-11-15T11:00:00Z"
      }
    ]
  },
  {
    id: "6",
    companyName: "Umbrella Corporation",
    street: "765 Research Pkwy",
    city: "Raccoon City",
    state: "CO",
    zipCode: "80202",
    accountManager: "Albert Wesker",
    mainContact: "William Birkin",
    email: "birkin@umbrella.com",
    phone: "(555) 333-2211",
    startDate: "2018-07-23",
    status: "active",
  },
  {
    id: "8",
    companyName: "Initech",
    street: "4120 Freidrich Lane",
    city: "Austin",
    state: "TX",
    zipCode: "73301",
    accountManager: "Bill Lumbergh",
    mainContact: "Peter Gibbons",
    email: "peter@initech.com",
    phone: "(555) 222-3333",
    startDate: "2022-05-12",
    status: "active",
    website: "initech.com"
  },
  {
    id: "12",
    companyName: "Soylent Corp",
    street: "101 Future Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    accountManager: "Henry Santoro",
    mainContact: "William Simonson",
    email: "william@soylent.com",
    phone: "(555) 000-1111",
    startDate: "2022-09-22",
    status: "active",
    website: "soylent.com"
  }
];
