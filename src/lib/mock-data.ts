import type { RiskLevel } from "@/components/ui";

export type OrderStatus = "Action required" | "Rescue in progress" | "Needs review" | "Monitoring" | "Rescued" | "Delivered";

export type OrderProduct = {
  name: string;
  sku: string;
  quantity: number;
  availability: string;
  confidence: number;
};

export type SimulatedOrder = {
  id: string;
  customer: string;
  email: string;
  initials: string;
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
};

/** Fixed illustrative data for frontend prototyping only. Never represents live NOVA CART activity. */
export const SIMULATED_ORDERS: SimulatedOrder[] = [
  {
    id: "NR-28471",
    customer: "Maya Patel",
    email: "maya.patel@example.test",
    initials: "MP",
    store: "North Loop · Minneapolis",
    storeCode: "NORTH-04",
    placedAt: "10:42 AM",
    hoursAgo: 1,
    eta: "12:15–12:45 PM",
    total: 84.6,
    itemsCount: 7,
    riskScore: 92,
    riskLevel: "CRITICAL",
    status: "Action required",
    confidence: 61,
    products: [
      { name: "Organic whole milk, 1 gal", sku: "DAI-1042", quantity: 1, availability: "Unconfirmed", confidence: 42 },
      { name: "Baby spinach, 5 oz", sku: "PRD-3081", quantity: 2, availability: "Low stock", confidence: 58 },
      { name: "Sourdough loaf", sku: "BAK-2270", quantity: 1, availability: "In stock", confidence: 96 },
      { name: "Free-range eggs, 12 ct", sku: "DAI-1018", quantity: 1, availability: "In stock", confidence: 89 },
    ],
    riskFactors: ["Milk inventory not confirmed · 42% confidence", "Delivery window has 8 minutes of remaining slack", "Two items have experienced recent availability changes"],
    explanation: "One essential item has uncertain shelf availability and the current delivery window has little recovery time. If the milk cannot be picked promptly, the order may miss its promised window unless a decision is made early.",
    recommendation: "Ask the customer to approve an oat-milk alternative now, while keeping the original item active until a picker confirms availability. Escalate the delivery window if picking slips by more than 5 minutes.",
    rescueAction: "Request an approved oat-milk substitution and flag the order for priority picking.",
    outcome: "Awaiting operator review. No action has been sent to a store or customer.",
  },
  {
    id: "NR-28466",
    customer: "Jordan Kim",
    email: "jordan.kim@example.test",
    initials: "JK",
    store: "Capitol Hill · Seattle",
    storeCode: "SEA-12",
    placedAt: "10:19 AM",
    hoursAgo: 2,
    eta: "11:50 AM–12:20 PM",
    total: 56.24,
    itemsCount: 5,
    riskScore: 78,
    riskLevel: "HIGH",
    status: "Rescue in progress",
    confidence: 88,
    products: [
      { name: "Avocados, 4 ct", sku: "PRD-2025", quantity: 1, availability: "Low stock", confidence: 54 },
      { name: "Corn tortillas, 30 ct", sku: "PAN-1114", quantity: 1, availability: "In stock", confidence: 92 },
      { name: "Black beans, 15 oz", sku: "PAN-0930", quantity: 2, availability: "In stock", confidence: 98 },
    ],
    riskFactors: ["Preferred avocado variety is running low", "Substitution preference is available", "Picker assignment is 6 minutes behind the usual pace"],
    explanation: "The requested avocado quantity is greater than the store's recent available-to-pick estimate. A saved substitution preference and a still-open delivery window make early customer approval a practical recovery path.",
    recommendation: "Offer the customer's saved Hass avocado alternative and notify the picker to confirm quantity before the order leaves the store.",
    rescueAction: "Customer-approved Hass avocado alternative added to the simulated pick plan.",
    outcome: "In progress · awaiting final picker confirmation.",
  },
  {
    id: "NR-28458",
    customer: "Olivia Brooks",
    email: "olivia.brooks@example.test",
    initials: "OB",
    store: "Lakeview · Chicago",
    storeCode: "CHI-08",
    placedAt: "9:46 AM",
    hoursAgo: 4,
    eta: "11:30 AM–12:00 PM",
    total: 112.08,
    itemsCount: 11,
    riskScore: 71,
    riskLevel: "HIGH",
    status: "Needs review",
    confidence: 79,
    products: [
      { name: "Greek yogurt, plain 32 oz", sku: "DAI-3190", quantity: 1, availability: "Unconfirmed", confidence: 63 },
      { name: "Blueberries, 1 pint", sku: "PRD-1160", quantity: 2, availability: "Low stock", confidence: 57 },
      { name: "Rolled oats, 42 oz", sku: "PAN-6812", quantity: 1, availability: "In stock", confidence: 95 },
    ],
    riskFactors: ["Two fresh items have uncertain pick availability", "Larger basket requires additional picking time", "Traffic estimate is above the morning baseline"],
    explanation: "Two produce and dairy lines have below-target availability confidence, and a larger basket leaves less spare preparation time. Delivery risk is elevated but not yet critical.",
    recommendation: "Confirm the two at-risk items with the store and review the delivery estimate before sending any customer update.",
    rescueAction: "No rescue action taken. Operator confirmation requested.",
    outcome: "Under review · no customer-facing change has been made.",
  },
  {
    id: "NR-28439",
    customer: "Ethan Rivera",
    email: "ethan.rivera@example.test",
    initials: "ER",
    store: "Pearl District · Portland",
    storeCode: "PDX-03",
    placedAt: "8:15 AM",
    hoursAgo: 12,
    eta: "10:30–11:00 AM",
    total: 38.75,
    itemsCount: 4,
    riskScore: 54,
    riskLevel: "MEDIUM",
    status: "Monitoring",
    confidence: 83,
    products: [
      { name: "Roma tomatoes, 2 lb", sku: "PRD-4052", quantity: 1, availability: "Low stock", confidence: 67 },
      { name: "Fresh basil, 1 bunch", sku: "PRD-1286", quantity: 1, availability: "In stock", confidence: 87 },
    ],
    riskFactors: ["Produce availability is slightly below target", "Normal delivery buffer remains"],
    explanation: "A produce item is less certain than the store's preferred threshold. The order still has a normal delivery buffer and no immediate intervention is indicated.",
    recommendation: "Keep monitoring availability; ask the picker to confirm the tomatoes at the start of the pick.",
    rescueAction: "Monitoring only. No intervention required at this time.",
    outcome: "On track · monitoring continues in this simulated view.",
  },
  {
    id: "NR-28412",
    customer: "Avery Chen",
    email: "avery.chen@example.test",
    initials: "AC",
    store: "Mission District · San Francisco",
    storeCode: "SFO-02",
    placedAt: "Yesterday, 6:24 PM",
    hoursAgo: 18,
    eta: "8:00–8:30 AM",
    total: 69.3,
    itemsCount: 6,
    riskScore: 18,
    riskLevel: "LOW",
    status: "Delivered",
    confidence: 97,
    products: [
      { name: "Steel-cut oats, 24 oz", sku: "PAN-4156", quantity: 1, availability: "In stock", confidence: 99 },
      { name: "Bananas, 6 ct", sku: "PRD-0095", quantity: 1, availability: "In stock", confidence: 95 },
    ],
    riskFactors: ["No active risk factors", "Store inventory confidence is high"],
    explanation: "Inventory and delivery signals are within their usual operating ranges. No intervention is recommended.",
    recommendation: "No action needed. Keep the order in standard monitoring.",
    rescueAction: "No rescue action needed.",
    outcome: "Delivered within the simulated delivery window.",
  },
  {
    id: "NR-28397",
    customer: "Noah Williams",
    email: "noah.williams@example.test",
    initials: "NW",
    store: "Midtown · Atlanta",
    storeCode: "ATL-07",
    placedAt: "Yesterday, 2:08 PM",
    hoursAgo: 31,
    eta: "4:00–4:30 PM",
    total: 93.12,
    itemsCount: 8,
    riskScore: 89,
    riskLevel: "CRITICAL",
    status: "Rescued",
    confidence: 91,
    products: [
      { name: "Ground turkey, 1 lb", sku: "MEA-1108", quantity: 2, availability: "Unavailable", confidence: 31 },
      { name: "Baby carrots, 1 lb", sku: "PRD-3042", quantity: 1, availability: "In stock", confidence: 93 },
      { name: "Penne pasta, 16 oz", sku: "PAN-0041", quantity: 2, availability: "In stock", confidence: 98 },
    ],
    riskFactors: ["Ground turkey unavailable at pick time", "Alternative protein approved before dispatch", "Customer notified before delivery window changed"],
    explanation: "The primary protein was unavailable during picking. The customer's saved substitute preference made a quick resolution possible before dispatch.",
    recommendation: "Use the approved chicken alternative and confirm the replacement quantity with the picker.",
    rescueAction: "Customer-approved chicken substitution recorded; store confirmed the updated pick.",
    outcome: "Rescued · alternative confirmed and order delivered within the adjusted window.",
  },
  {
    id: "NR-28388",
    customer: "Sofia Martinez",
    email: "sofia.martinez@example.test",
    initials: "SM",
    store: "Ballard · Seattle",
    storeCode: "SEA-09",
    placedAt: "Yesterday, 12:37 PM",
    hoursAgo: 46,
    eta: "2:00–2:30 PM",
    total: 47.89,
    itemsCount: 5,
    riskScore: 43,
    riskLevel: "MEDIUM",
    status: "Rescued",
    confidence: 86,
    products: [
      { name: "Almond milk, unsweetened", sku: "DAI-4092", quantity: 1, availability: "Low stock", confidence: 58 },
      { name: "Granola, 12 oz", sku: "PAN-8832", quantity: 1, availability: "In stock", confidence: 93 },
    ],
    riskFactors: ["Almond milk stock was below typical level", "Customer approved a replacement promptly"],
    explanation: "The requested milk alternative was in low supply, but the customer's preselected oat-milk substitute reduced the chance of a cancellation.",
    recommendation: "Confirm substitution and continue with standard dispatch monitoring.",
    rescueAction: "Oat-milk substitution approved in the simulated workflow.",
    outcome: "Rescued · customer preference used; order completed.",
  },
  {
    id: "NR-28352",
    customer: "Liam Johnson",
    email: "liam.johnson@example.test",
    initials: "LJ",
    store: "Downtown · Denver",
    storeCode: "DEN-01",
    placedAt: "Mar 11, 10:06 AM",
    hoursAgo: 90,
    eta: "12:00–12:30 PM",
    total: 121.4,
    itemsCount: 12,
    riskScore: 12,
    riskLevel: "LOW",
    status: "Delivered",
    confidence: 98,
    products: [
      { name: "Whole grain bread", sku: "BAK-1007", quantity: 1, availability: "In stock", confidence: 99 },
      { name: "Strawberries, 1 lb", sku: "PRD-2292", quantity: 2, availability: "In stock", confidence: 94 },
    ],
    riskFactors: ["No active risk factors", "Inventory and delivery within target"],
    explanation: "All observed operating signals are within expected ranges. No intervention is recommended.",
    recommendation: "No action needed.",
    rescueAction: "No rescue action needed.",
    outcome: "Delivered within the simulated delivery window.",
  },
];

export const STORES = [
  { name: "North Loop · Minneapolis", code: "NORTH-04", confidence: 88, risk: "Elevated", orders: 148, unavailable: 5, lateRate: "4.8%", trend: "up" },
  { name: "Capitol Hill · Seattle", code: "SEA-12", confidence: 93, risk: "Moderate", orders: 126, unavailable: 3, lateRate: "3.1%", trend: "steady" },
  { name: "Lakeview · Chicago", code: "CHI-08", confidence: 81, risk: "Elevated", orders: 117, unavailable: 7, lateRate: "5.4%", trend: "up" },
  { name: "Pearl District · Portland", code: "PDX-03", confidence: 96, risk: "Low", orders: 104, unavailable: 2, lateRate: "2.2%", trend: "down" },
  { name: "Midtown · Atlanta", code: "ATL-07", confidence: 91, risk: "Moderate", orders: 98, unavailable: 3, lateRate: "2.8%", trend: "down" },
];

export const INVENTORY_ITEMS = [
  { name: "Organic whole milk, 1 gal", sku: "DAI-1042", store: "North Loop · Minneapolis", confidence: 42, onHand: "2 est.", demand: "High", risk: "CRITICAL" as RiskLevel, opportunity: "Offer oat milk" },
  { name: "Baby spinach, 5 oz", sku: "PRD-3081", store: "North Loop · Minneapolis", confidence: 58, onHand: "4 est.", demand: "Rising", risk: "HIGH" as RiskLevel, opportunity: "Confirm shelf count" },
  { name: "Avocados, 4 ct", sku: "PRD-2025", store: "Capitol Hill · Seattle", confidence: 54, onHand: "3 est.", demand: "High", risk: "HIGH" as RiskLevel, opportunity: "Hass alternative" },
  { name: "Blueberries, 1 pint", sku: "PRD-1160", store: "Lakeview · Chicago", confidence: 57, onHand: "5 est.", demand: "Rising", risk: "MEDIUM" as RiskLevel, opportunity: "Verify next delivery" },
  { name: "Greek yogurt, plain 32 oz", sku: "DAI-3190", store: "Lakeview · Chicago", confidence: 63, onHand: "6 est.", demand: "Steady", risk: "MEDIUM" as RiskLevel, opportunity: "Check same-brand stock" },
  { name: "Roma tomatoes, 2 lb", sku: "PRD-4052", store: "Pearl District · Portland", confidence: 67, onHand: "7 est.", demand: "Steady", risk: "MEDIUM" as RiskLevel, opportunity: "Monitor pick rate" },
  { name: "Steel-cut oats, 24 oz", sku: "PAN-4156", store: "Mission District · San Francisco", confidence: 98, onHand: "24 est.", demand: "Steady", risk: "LOW" as RiskLevel, opportunity: "No action" },
];

export const RESCUE_STEPS = [
  { title: "Risk detected", detail: "A meaningful inventory or delivery signal crosses its review threshold.", owner: "Signal monitoring" },
  { title: "Risk factors surfaced", detail: "The operator can inspect the specific inventory, timing, and store indicators.", owner: "Context" },
  { title: "Explanation reviewed", detail: "A plain-language explanation describes why the order is flagged.", owner: "Decision support" },
  { title: "Recommendation presented", detail: "A suggested action is shown with its assumptions and confidence.", owner: "Decision support" },
  { title: "Operator review", detail: "A human checks the customer preference, policy, and store context.", owner: "Human approval" },
  { title: "Rescue action recorded", detail: "A prototype action is documented only; no customer or store is contacted.", owner: "Prototype workflow" },
  { title: "Outcome observed", detail: "The simulated result can inform future measurement and learning.", owner: "Learning loop" },
];

export const trendData = [
  { label: "Mon", value: 48 },
  { label: "Tue", value: 56 },
  { label: "Wed", value: 50 },
  { label: "Thu", value: 68 },
  { label: "Fri", value: 61 },
  { label: "Sat", value: 79 },
  { label: "Sun", value: 74 },
];
