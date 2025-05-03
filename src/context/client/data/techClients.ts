
import { Client } from "@/types/client";

export const techClients: Client[] = [
  {
    id: "4",
    companyName: "Stark Industries",
    street: "200 Park Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10166",
    accountManager: "Pepper Potts",
    mainContact: "Tony Stark",
    email: "tony@stark.com",
    phone: "(555) 462-7865",
    startDate: "2019-11-12",
    status: "active",
    workLogs: [
      {
        id: "wl9",
        clientId: "4",
        description: "Energy solution implementation",
        notes: "Installing arc reactor technology",
        startTime: "2024-02-15T09:00:00Z",
        endTime: "2024-02-16T18:00:00Z",
        duration: 1980,
        completed: true,
        recurring: false,
        dueDate: "2024-02-20T00:00:00Z",
        createdAt: "2024-02-10T08:30:00Z",
        updatedAt: "2024-02-16T18:00:00Z"
      },
      {
        id: "wl10",
        clientId: "4",
        description: "AI integration for manufacturing",
        notes: "Implementing JARVIS-like systems for production lines",
        startTime: "2024-03-01T10:00:00Z",
        completed: false,
        recurring: false,
        dueDate: "2025-05-15T00:00:00Z",
        createdAt: "2024-03-01T10:00:00Z",
        updatedAt: "2024-03-01T10:00:00Z"
      }
    ]
  },
  {
    id: "7",
    companyName: "Cyberdyne Systems",
    street: "18144 El Camino Real",
    city: "Sunnyvale",
    state: "CA",
    zipCode: "94087",
    accountManager: "Miles Dyson",
    mainContact: "Miles Bennett Dyson",
    email: "dyson@cyberdyne.com",
    phone: "(555) 789-4561",
    startDate: "2020-08-29",
    status: "active",
    workLogs: [
      {
        id: "wl11",
        clientId: "7",
        description: "AI System Security Audit",
        notes: "Complete security review of Skynet neural network protocols",
        startTime: "2024-04-28T09:00:00Z",
        endTime: "2024-04-28T17:00:00Z",
        duration: 480,
        completed: true,
        recurring: true,
        recurrenceType: "monthly",
        dueDate: "2024-04-30T00:00:00Z",
        createdAt: "2024-04-20T10:00:00Z",
        updatedAt: "2024-04-28T17:00:00Z"
      },
      {
        id: "wl12",
        clientId: "7",
        description: "Neural Network Optimization",
        notes: "Improve machine learning algorithms for the defense network",
        startTime: "2024-05-01T13:00:00Z",
        endTime: "2024-05-01T18:00:00Z",
        duration: 300,
        completed: true,
        recurring: false,
        dueDate: "2024-05-01T00:00:00Z",
        createdAt: "2024-04-25T11:30:00Z",
        updatedAt: "2024-05-01T18:00:00Z"
      },
      {
        id: "wl13",
        clientId: "7",
        description: "Prototype T-800 Design Review",
        notes: "Review technical specifications and design blueprints for the new model",
        completed: false,
        recurring: false,
        dueDate: "2025-05-15T00:00:00Z",
        createdAt: "2024-04-30T14:00:00Z",
        updatedAt: "2024-04-30T14:00:00Z"
      }
    ]
  },
  {
    id: "10",
    companyName: "Hooli",
    street: "1401 N Shoreline Blvd",
    city: "Mountain View",
    state: "CA",
    zipCode: "94043",
    accountManager: "Gavin Belson",
    mainContact: "Jared Dunn",
    email: "jared@hooli.com",
    phone: "(555) 666-7777",
    startDate: "2022-07-18",
    status: "active",
    website: "hooli.com"
  },
  {
    id: "11",
    companyName: "Pied Piper",
    street: "5230 Newell Road",
    city: "Palo Alto",
    state: "CA",
    zipCode: "94303",
    accountManager: "Monica Hall",
    mainContact: "Richard Hendricks",
    email: "richard@piedpiper.com",
    phone: "(555) 888-9999",
    startDate: "2023-01-05",
    status: "active",
    website: "piedpiper.com"
  }
];
