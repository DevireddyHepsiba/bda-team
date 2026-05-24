export type LeadStatus = "new" | "contacted" | "qualified" | "negotiation" | "won" | "lost";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
};

export const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "qualified", "negotiation", "won", "lost"];

export interface Lead {
  id: string;
  client: string;
  company: string;
  product: string;
  budget: number;
  status: LeadStatus;
  employee: string;
  followUp: string;
  source: string;
  email: string;
  phone: string;
}

export const leads: Lead[] = [
  { id: "LD-1042", client: "Rohan Mehta", company: "Tata Steel", product: "CNC Lathe Machine", budget: 1850000, status: "negotiation", employee: "Priya Sharma", followUp: "2026-05-25", source: "Website", email: "rohan@tatasteel.com", phone: "+91 98200 11122" },
  { id: "LD-1043", client: "Anita Verma", company: "L&T Heavy Eng.", product: "Hydraulic Press 200T", budget: 4200000, status: "qualified", employee: "Karan Singh", followUp: "2026-05-24", source: "Referral", email: "anita.v@lnt.com", phone: "+91 99873 22441" },
  { id: "LD-1044", client: "Vikram Joshi", company: "Mahindra Auto", product: "Injection Molder", budget: 2750000, status: "contacted", employee: "Priya Sharma", followUp: "2026-05-26", source: "Trade Show", email: "v.joshi@mahindra.com", phone: "+91 90011 55667" },
  { id: "LD-1045", client: "Sneha Iyer", company: "Bharat Forge", product: "Industrial Robot Arm", budget: 5600000, status: "won", employee: "Arjun Patel", followUp: "2026-05-23", source: "LinkedIn", email: "s.iyer@bforge.com", phone: "+91 98765 44332" },
  { id: "LD-1046", client: "Imran Khan", company: "Reliance Industries", product: "Conveyor System", budget: 980000, status: "new", employee: "Karan Singh", followUp: "2026-05-27", source: "Website", email: "imran@ril.com", phone: "+91 99887 66554" },
  { id: "LD-1047", client: "Deepa Nair", company: "Asian Paints", product: "Mixing Tank 5000L", budget: 1240000, status: "new", employee: "Priya Sharma", followUp: "2026-05-28", source: "Cold Call", email: "deepa@apnt.com", phone: "+91 98112 33445" },
  { id: "LD-1048", client: "Rajesh Gupta", company: "JSW Steel", product: "Welding Robot", budget: 3300000, status: "negotiation", employee: "Arjun Patel", followUp: "2026-05-24", source: "Referral", email: "rgupta@jsw.com", phone: "+91 90909 80808" },
  { id: "LD-1049", client: "Kavita Rao", company: "Hero MotoCorp", product: "Stamping Press", budget: 2150000, status: "qualified", employee: "Priya Sharma", followUp: "2026-05-29", source: "Website", email: "k.rao@hero.com", phone: "+91 98000 11223" },
  { id: "LD-1050", client: "Manish Tiwari", company: "Adani Power", product: "Generator Set 500kVA", budget: 4850000, status: "contacted", employee: "Karan Singh", followUp: "2026-05-30", source: "LinkedIn", email: "m.tiwari@adani.com", phone: "+91 99100 22334" },
  { id: "LD-1051", client: "Pooja Desai", company: "Cipla Pharma", product: "Tablet Coating Machine", budget: 1670000, status: "lost", employee: "Arjun Patel", followUp: "2026-05-22", source: "Trade Show", email: "p.desai@cipla.com", phone: "+91 98223 11990" },
  { id: "LD-1052", client: "Suresh Babu", company: "Wipro Infra", product: "Laser Cutter", budget: 2980000, status: "won", employee: "Priya Sharma", followUp: "2026-05-21", source: "Referral", email: "s.babu@wipro.com", phone: "+91 90876 54321" },
  { id: "LD-1053", client: "Neha Kapoor", company: "Ashok Leyland", product: "Paint Booth System", budget: 3650000, status: "qualified", employee: "Karan Singh", followUp: "2026-05-26", source: "Website", email: "n.kapoor@al.com", phone: "+91 98101 23232" },
];

export const employees = [
  { name: "Priya Sharma", role: "BDA - Senior", leads: 24, converted: 11, revenue: 18400000, score: 92 },
  { name: "Karan Singh", role: "BDA", leads: 19, converted: 7, revenue: 12200000, score: 78 },
  { name: "Arjun Patel", role: "BDA - Senior", leads: 22, converted: 10, revenue: 16100000, score: 88 },
  { name: "Meera Kulkarni", role: "BDA", leads: 15, converted: 5, revenue: 8400000, score: 71 },
  { name: "Aditya Rao", role: "BDA Trainee", leads: 11, converted: 2, revenue: 3200000, score: 58 },
];

export const monthlyRevenue = [
  { month: "Dec", revenue: 28, leads: 42 },
  { month: "Jan", revenue: 34, leads: 51 },
  { month: "Feb", revenue: 41, leads: 58 },
  { month: "Mar", revenue: 38, leads: 55 },
  { month: "Apr", revenue: 52, leads: 67 },
  { month: "May", revenue: 61, leads: 74 },
];

export const activities = [
  { id: 1, type: "won", text: "Sneha Iyer (Bharat Forge) — deal closed ₹56L", time: "12 min ago", who: "Arjun Patel" },
  { id: 2, type: "follow", text: "Follow-up scheduled with Rajesh Gupta tomorrow", time: "1 hr ago", who: "Arjun Patel" },
  { id: 3, type: "lead", text: "New lead added: Imran Khan (Reliance Industries)", time: "3 hr ago", who: "Karan Singh" },
  { id: 4, type: "comm", text: "Quotation sent to Anita Verma — Hydraulic Press 200T", time: "5 hr ago", who: "Karan Singh" },
  { id: 5, type: "comm", text: "Call completed with Vikram Joshi — Injection Molder", time: "Yesterday", who: "Priya Sharma" },
  { id: 6, type: "won", text: "Suresh Babu (Wipro) — Laser Cutter ₹29.8L", time: "Yesterday", who: "Priya Sharma" },
];

export const followups = [
  { id: 1, client: "Rohan Mehta", company: "Tata Steel", date: "2026-05-25", time: "10:30", type: "Call", priority: "High", done: false },
  { id: 2, client: "Anita Verma", company: "L&T Heavy Eng.", date: "2026-05-24", time: "14:00", type: "Meeting", priority: "High", done: false },
  { id: 3, client: "Vikram Joshi", company: "Mahindra Auto", date: "2026-05-26", time: "11:15", type: "Email", priority: "Medium", done: false },
  { id: 4, client: "Imran Khan", company: "Reliance Industries", date: "2026-05-27", time: "09:00", type: "Call", priority: "Medium", done: false },
  { id: 5, client: "Deepa Nair", company: "Asian Paints", date: "2026-05-28", time: "15:30", type: "Meeting", priority: "Low", done: false },
  { id: 6, client: "Rajesh Gupta", company: "JSW Steel", date: "2026-05-24", time: "16:00", type: "Call", priority: "High", done: false },
  { id: 7, client: "Suresh Babu", company: "Wipro Infra", date: "2026-05-21", time: "10:00", type: "Meeting", priority: "High", done: true },
];

export const communications = [
  { id: 1, lead: "Rohan Mehta", company: "Tata Steel", type: "Call", date: "2026-05-22", note: "Discussed CNC specs, asked for pricing breakdown", outcome: "Quotation requested" },
  { id: 2, lead: "Anita Verma", company: "L&T Heavy Eng.", type: "Email", date: "2026-05-22", note: "Sent detailed Hydraulic Press 200T quotation + brochure", outcome: "Awaiting reply" },
  { id: 3, lead: "Sneha Iyer", company: "Bharat Forge", type: "Meeting", date: "2026-05-21", note: "On-site demo of robotic arm, technical team approved", outcome: "Deal won" },
  { id: 4, lead: "Vikram Joshi", company: "Mahindra Auto", type: "WhatsApp", date: "2026-05-20", note: "Shared product catalogue PDF", outcome: "Interested" },
  { id: 5, lead: "Rajesh Gupta", company: "JSW Steel", type: "Call", date: "2026-05-19", note: "Negotiated on bulk discount, sent revised offer", outcome: "Negotiating" },
];

export const leadSourceData = [
  { name: "Website", value: 38 },
  { name: "Referral", value: 24 },
  { name: "LinkedIn", value: 18 },
  { name: "Trade Show", value: 12 },
  { name: "Cold Call", value: 8 },
];

export const formatINR = (n: number) =>
  "₹" + (n >= 10000000 ? (n / 10000000).toFixed(2) + " Cr" : n >= 100000 ? (n / 100000).toFixed(1) + " L" : n.toLocaleString("en-IN"));
