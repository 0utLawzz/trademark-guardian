import { useSyncExternalStore } from "react";

export type CaseType = "Trademark" | "NTN" | "Copyright" | "Company";

export const TRADEMARK_PHASES = [
  "Filing",
  "Examination",
  "Show Cause",
  "Acceptance",
  "Advertisement",
  "Opposition",
  "Registration",
  "Renewal",
] as const;

export type TrademarkPhase = (typeof TRADEMARK_PHASES)[number];

export type CaseStatus = "Active" | "Pending" | "On Hold" | "Completed" | "Rejected";
export type PaymentStatus = "Paid" | "Partial" | "Unpaid";

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  activeCases: number;
}

export interface TrademarkCase {
  id: string;
  appNumber: string;
  title: string;
  type: CaseType;
  clientId: string;
  agentId: string;
  class: string;
  phase: TrademarkPhase;
  status: CaseStatus;
  payment: PaymentStatus;
  fee: number;
  paid: number;
  driveUrl: string;
  filedAt: string;
  nextDeadline: string;
}

interface DB {
  clients: Client[];
  agents: Agent[];
  cases: TrademarkCase[];
}

const KEY = "tg_db_v1";

const seed: DB = {
  agents: [
    { id: "a1", name: "Sarah Khan", email: "sarah@tg.com", role: "Senior Attorney", activeCases: 0 },
    { id: "a2", name: "Bilal Ahmed", email: "bilal@tg.com", role: "Trademark Agent", activeCases: 0 },
    { id: "a3", name: "Ayesha Malik", email: "ayesha@tg.com", role: "Paralegal", activeCases: 0 },
  ],
  clients: [
    { id: "c1", name: "Imran Sheikh", company: "Sheikh Foods Pvt Ltd", email: "imran@sheikhfoods.com", phone: "+92 300 1234567", city: "Lahore", createdAt: "2025-01-12" },
    { id: "c2", name: "Nadia Hussain", company: "Glow Cosmetics", email: "nadia@glow.pk", phone: "+92 321 7654321", city: "Karachi", createdAt: "2025-02-03" },
    { id: "c3", name: "Omar Farooq", company: "TechNova Solutions", email: "omar@technova.io", phone: "+92 333 9876543", city: "Islamabad", createdAt: "2025-03-21" },
    { id: "c4", name: "Zainab Ali", company: "Threadline Apparel", email: "zainab@threadline.com", phone: "+92 345 1112233", city: "Faisalabad", createdAt: "2025-04-09" },
  ],
  cases: [
    { id: "t1", appNumber: "TM-2025-00891", title: "Sheikh Gold", type: "Trademark", clientId: "c1", agentId: "a1", class: "30", phase: "Examination", status: "Active", payment: "Partial", fee: 85000, paid: 40000, driveUrl: "https://drive.google.com/drive/folders/abc", filedAt: "2025-01-20", nextDeadline: "2026-06-18" },
    { id: "t2", appNumber: "TM-2025-00912", title: "GlowLux", type: "Trademark", clientId: "c2", agentId: "a2", class: "03", phase: "Advertisement", status: "Active", payment: "Paid", fee: 95000, paid: 95000, driveUrl: "https://drive.google.com/drive/folders/def", filedAt: "2025-02-10", nextDeadline: "2026-06-30" },
    { id: "t3", appNumber: "TM-2025-01044", title: "NovaCloud", type: "Trademark", clientId: "c3", agentId: "a1", class: "42", phase: "Filing", status: "Pending", payment: "Unpaid", fee: 120000, paid: 0, driveUrl: "", filedAt: "2025-03-25", nextDeadline: "2026-06-10" },
    { id: "t4", appNumber: "TM-2024-00770", title: "Threadline", type: "Trademark", clientId: "c4", agentId: "a3", class: "25", phase: "Registration", status: "Completed", payment: "Paid", fee: 90000, paid: 90000, driveUrl: "https://drive.google.com/drive/folders/ghi", filedAt: "2024-11-02", nextDeadline: "2034-11-02" },
    { id: "t5", appNumber: "NTN-2025-0021", title: "Sheikh Foods NTN", type: "NTN", clientId: "c1", agentId: "a2", class: "-", phase: "Filing", status: "Active", payment: "Paid", fee: 25000, paid: 25000, driveUrl: "", filedAt: "2025-05-01", nextDeadline: "2026-06-15" },
    { id: "t6", appNumber: "CR-2025-0099", title: "GlowLux Artwork", type: "Copyright", clientId: "c2", agentId: "a3", class: "-", phase: "Examination", status: "On Hold", payment: "Partial", fee: 35000, paid: 15000, driveUrl: "", filedAt: "2025-04-18", nextDeadline: "2026-07-01" },
  ],
};

function load(): DB {
  if (typeof localStorage === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return structuredClone(seed);
    }
    return JSON.parse(raw) as DB;
  } catch {
    return structuredClone(seed);
  }
}

let db: DB = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(db));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

const uid = () => Math.random().toString(36).slice(2, 9);

export const api = {
  getSnapshot: () => db,
  addClient(c: Omit<Client, "id" | "createdAt">) {
    db = { ...db, clients: [...db.clients, { ...c, id: uid(), createdAt: new Date().toISOString().slice(0, 10) }] };
    persist();
  },
  addCase(c: Omit<TrademarkCase, "id">) {
    db = { ...db, cases: [...db.cases, { ...c, id: uid() }] };
    persist();
  },
  updateCase(id: string, patch: Partial<TrademarkCase>) {
    db = { ...db, cases: db.cases.map((x) => (x.id === id ? { ...x, ...patch } : x)) };
    persist();
  },
  addAgent(a: Omit<Agent, "id" | "activeCases">) {
    db = { ...db, agents: [...db.agents, { ...a, id: uid(), activeCases: 0 }] };
    persist();
  },
};

export function useDB(): DB {
  return useSyncExternalStore(subscribe, api.getSnapshot, () => seed);
}

export const fmtMoney = (n: number) =>
  "Rs " + n.toLocaleString("en-PK");
