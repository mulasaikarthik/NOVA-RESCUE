import type { RiskLevel } from "@/server/schemas";

export type OrderStatus = "Action required" | "Rescue in progress" | "Needs review" | "Monitoring" | "Rescued" | "Delivered";

export type OrderProduct = {
  name: string;
  sku: string;
  quantity: number;
  availability: string;
  confidence: number;
};

export type OrderRecord = {
  id: string;
  customer: string;
  email: string;
  store: string;
  storeCode: string;
  placedAt: string;
  hoursAgo: number;
  eta: string;
  total: number;
  itemsCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: OrderStatus;
  confidence: number;
  products: OrderProduct[];
  riskFactors: string[];
  explanation: string;
  recommendation: string;
  rescueAction: string;
  outcome: string;
  owner?: string;
};

/**
 * Mock seed data shared with the frontend for consistent demos.
 * This will be replaced by a Supabase repository later — service layer is unchanged.
 */
export const SEED_ORDERS: OrderRecord[] = [
  {
    id: "NR-28471", customer: "Maya Patel", email: "maya.patel@example.test",
    store: "North Loop · Minneapolis", storeCode: "NORTH-04",
    placedAt: "10:42 AM", hoursAgo: 1, eta: "12:15–12:45 PM",
    total: 84.60, itemsCount: 7, riskScore: 92, riskLevel: "CRITICAL",
    status: "Action required", confidence: 61,
    products: [
      { name: "Organic whole milk, 1 gal", sku: "DAI-1042", quantity: 1, availability: "Unconfirmed", confidence: 42 },
      { name: "Baby spinach, 5 oz", sku: "PRD-3081", quantity: 2, availability: "Low stock", confidence: 58 },
      { name: "Sourdough loaf", sku: "BAK-2270", quantity: 1, availability: "In stock", confidence: 96 },
      { name: "Free-range eggs, 12 ct", sku: "DAI-1018", quantity: 1, availability: "In stock", confidence: 89 },
    ],
    riskFactors: ["Milk inventory not confirmed · 42% confidence", "Delivery window has 8 minutes of remaining slack", "Two items have experienced recent availability changes"],
    explanation: "One essential item has uncertain shelf availability and the current delivery window has little recovery time.",
    recommendation: "Ask the customer to approve an oat-milk alternative now, while keeping the original item active until a picker confirms availability.",
    rescueAction: "Request an approved oat-milk substitution and flag the order for priority picking.",
    outcome: "Awaiting operator review.",
  },
  {
    id: "NR-28466", customer: "Jordan Kim", email: "jordan.kim@example.test",
    store: "Capitol Hill · Seattle", storeCode: "SEA-12",
    placedAt: "10:19 AM", hoursAgo: 2, eta: "11:50 AM–12:20 PM",
    total: 56.24, itemsCount: 5, riskScore: 78, riskLevel: "HIGH",
    status: "Rescue in progress", confidence: 88,
    products: [
      { name: "Avocados, 4 ct", sku: "PRD-2025", quantity: 1, availability: "Low stock", confidence: 54 },
      { name: "Corn tortillas, 30 ct", sku: "PAN-1114", quantity: 1, availability: "In stock", confidence: 92 },
      { name: "Black beans, 15 oz", sku: "PAN-0930", quantity: 2, availability: "In stock", confidence: 98 },
    ],
    riskFactors: ["Preferred avocado variety is running low", "Substitution preference is available", "Picker assignment is 6 minutes behind"],
    explanation: "The requested avocado quantity is greater than the store's recent available-to-pick estimate.",
    recommendation: "Offer the customer's saved Hass avocado alternative and notify the picker.",
    rescueAction: "Customer-approved Hass avocado alternative added to pick plan.",
    outcome: "In progress · awaiting final picker confirmation.",
  },
  {
    id: "NR-28458", customer: "Olivia Brooks", email: "olivia.brooks@example.test",
    store: "Lakeview · Chicago", storeCode: "CHI-08",
    placedAt: "9:46 AM", hoursAgo: 4, eta: "11:30 AM–12:00 PM",
    total: 112.08, itemsCount: 11, riskScore: 71, riskLevel: "HIGH",
    status: "Needs review", confidence: 79,
    products: [
      { name: "Greek yogurt, plain 32 oz", sku: "DAI-3190", quantity: 1, availability: "Unconfirmed", confidence: 63 },
      { name: "Blueberries, 1 pint", sku: "PRD-1160", quantity: 2, availability: "Low stock", confidence: 57 },
      { name: "Rolled oats, 42 oz", sku: "PAN-6812", quantity: 1, availability: "In stock", confidence: 95 },
    ],
    riskFactors: ["Two fresh items have uncertain pick availability", "Larger basket requires additional picking time", "Traffic estimate above morning baseline"],
    explanation: "Two produce and dairy lines have below-target availability confidence.",
    recommendation: "Confirm the two at-risk items with the store and review the delivery estimate.",
    rescueAction: "No rescue action taken. Operator confirmation requested.",
    outcome: "Under review.",
  },
  {
    id: "NR-28439", customer: "Ethan Rivera", email: "ethan.rivera@example.test",
    store: "Pearl District · Portland", storeCode: "PDX-03",
    placedAt: "8:15 AM", hoursAgo: 12, eta: "10:30–11:00 AM",
    total: 38.75, itemsCount: 4, riskScore: 54, riskLevel: "MEDIUM",
    status: "Monitoring", confidence: 83,
    products: [
      { name: "Roma tomatoes, 2 lb", sku: "PRD-4052", quantity: 1, availability: "Low stock", confidence: 67 },
      { name: "Fresh basil, 1 bunch", sku: "PRD-1286", quantity: 1, availability: "In stock", confidence: 87 },
    ],
    riskFactors: ["Produce availability slightly below target", "Normal delivery buffer remains"],
    explanation: "A produce item is less certain than the store's preferred threshold.",
    recommendation: "Keep monitoring; ask the picker to confirm tomatoes at the start of the pick.",
    rescueAction: "Monitoring only.",
    outcome: "On track.",
  },
  {
    id: "NR-28412", customer: "Avery Chen", email: "avery.chen@example.test",
    store: "Mission District · San Francisco", storeCode: "SFO-02",
    placedAt: "Yesterday, 6:24 PM", hoursAgo: 18, eta: "8:00–8:30 AM",
    total: 69.30, itemsCount: 6, riskScore: 18, riskLevel: "LOW",
    status: "Delivered", confidence: 97,
    products: [
      { name: "Steel-cut oats, 24 oz", sku: "PAN-4156", quantity: 1, availability: "In stock", confidence: 99 },
      { name: "Bananas, 6 ct", sku: "PRD-0095", quantity: 1, availability: "In stock", confidence: 95 },
    ],
    riskFactors: ["No active risk factors", "Store inventory confidence is high"],
    explanation: "All observed operating signals are within expected ranges.",
    recommendation: "No action needed.",
    rescueAction: "No rescue action needed.",
    outcome: "Delivered.",
  },
  {
    id: "NR-28397", customer: "Noah Williams", email: "noah.williams@example.test",
    store: "Midtown · Atlanta", storeCode: "ATL-07",
    placedAt: "Yesterday, 2:08 PM", hoursAgo: 31, eta: "4:00–4:30 PM",
    total: 93.12, itemsCount: 8, riskScore: 89, riskLevel: "CRITICAL",
    status: "Rescued", confidence: 91,
    products: [
      { name: "Ground turkey, 1 lb", sku: "MEA-1108", quantity: 2, availability: "Unavailable", confidence: 31 },
      { name: "Baby carrots, 1 lb", sku: "PRD-3042", quantity: 1, availability: "In stock", confidence: 93 },
      { name: "Penne pasta, 16 oz", sku: "PAN-0041", quantity: 2, availability: "In stock", confidence: 98 },
    ],
    riskFactors: ["Ground turkey unavailable at pick time", "Alternative protein approved", "Customer notified before window changed"],
    explanation: "Primary protein was unavailable during picking. Saved substitute preference enabled quick resolution.",
    recommendation: "Use approved chicken alternative and confirm quantity with the picker.",
    rescueAction: "Chicken substitution approved in simulated workflow.",
    outcome: "Rescued.",
  },
  {
    id: "NR-28388", customer: "Sofia Martinez", email: "sofia.martinez@example.test",
    store: "Ballard · Seattle", storeCode: "SEA-09",
    placedAt: "Yesterday, 12:37 PM", hoursAgo: 46, eta: "2:00–2:30 PM",
    total: 47.89, itemsCount: 5, riskScore: 43, riskLevel: "MEDIUM",
    status: "Rescued", confidence: 86,
    products: [
      { name: "Almond milk, unsweetened", sku: "DAI-4092", quantity: 1, availability: "Low stock", confidence: 58 },
      { name: "Granola, 12 oz", sku: "PAN-8832", quantity: 1, availability: "In stock", confidence: 93 },
    ],
    riskFactors: ["Almond milk stock was below typical level", "Customer approved a replacement promptly"],
    explanation: "Requested milk alternative was in low supply; preselected oat-milk substitute reduced cancellation chance.",
    recommendation: "Confirm substitution and continue with standard dispatch monitoring.",
    rescueAction: "Oat-milk substitution approved.",
    outcome: "Rescued.",
  },
  {
    id: "NR-28352", customer: "Liam Johnson", email: "liam.johnson@example.test",
    store: "Downtown · Denver", storeCode: "DEN-01",
    placedAt: "Mar 11, 10:06 AM", hoursAgo: 90, eta: "12:00–12:30 PM",
    total: 121.40, itemsCount: 12, riskScore: 12, riskLevel: "LOW",
    status: "Delivered", confidence: 98,
    products: [
      { name: "Whole grain bread", sku: "BAK-1007", quantity: 1, availability: "In stock", confidence: 99 },
      { name: "Strawberries, 1 lb", sku: "PRD-2292", quantity: 2, availability: "In stock", confidence: 94 },
    ],
    riskFactors: ["No active risk factors", "Inventory and delivery within target"],
    explanation: "All operating signals within expected ranges.",
    recommendation: "No action needed.",
    rescueAction: "No rescue action needed.",
    outcome: "Delivered.",
  },
];

export const SEED_STORES = [
  { code: "NORTH-04", name: "North Loop · Minneapolis", confidence: 88, orders: 148, unavailableSkus: 5, lateSignal: 4.8, indicator: "Elevated" },
  { code: "SEA-12", name: "Capitol Hill · Seattle", confidence: 93, orders: 126, unavailableSkus: 3, lateSignal: 3.1, indicator: "Moderate" },
  { code: "CHI-08", name: "Lakeview · Chicago", confidence: 81, orders: 117, unavailableSkus: 7, lateSignal: 5.4, indicator: "Elevated" },
  { code: "PDX-03", name: "Pearl District · Portland", confidence: 96, orders: 104, unavailableSkus: 2, lateSignal: 2.2, indicator: "Low" },
  { code: "ATL-07", name: "Midtown · Atlanta", confidence: 91, orders: 98, unavailableSkus: 3, lateSignal: 2.8, indicator: "Moderate" },
  { code: "SFO-02", name: "Mission District · San Francisco", confidence: 95, orders: 135, unavailableSkus: 2, lateSignal: 2.5, indicator: "Low" },
  { code: "SEA-09", name: "Ballard · Seattle", confidence: 90, orders: 88, unavailableSkus: 4, lateSignal: 3.4, indicator: "Moderate" },
];
