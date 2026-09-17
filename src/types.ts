export interface TriageCase {
  id: string;
  sNo: number;
  caseNumber: string; // Case Number from table e.g. "76000020"
  title: string; // Title from table
  departmentName: string; // Department Name e.g. "AlRajhiBankUAT", "Customer Retention", "Customer Care"
  createdOn: string; // Created On e.g. "8/25/2026 5:31"
  owner: string; // Owner e.g. "Dummy Name", "Thamer"
  action: 'Closed' | 'Open'; // Action from table
  problemCode: string; // Problem Code e.g. "CD000855", "CC000006"
  slaHours: number; // SLA Hrs e.g. 2, 24
  responsibleAgent: string; // Responsible Agent e.g. "Shahad", "Ahmed", "Ali"
  samaRef: string; // SAMA Ref (Case AHT) (Case) e.g. "C2608081000"
  customerQuery: string; // Customer Query in Arabic
  origin: string; // Origin e.g. "SAMA Level 1"
  
  // Operational and UI presentation fields
  status: 'locked' | 'queued' | 'in_review' | 'resolved';
  category: 'urgent' | 'loan_ops' | 'card_ops' | 'car_leasing' | 'general' | 'wire_ach';
  timeAgo: string;
  customerName: string;
  customerTier: string;
  accountNumber: string;
  slaMinutesLeft: number;
  slaFormatted: string;
  priority: 'P1' | 'P2' | 'P3';
  amount?: string;
  inboundChannel: string;
  clientUuid: string;
  timestamp: string;
  originalCustomerMessage: string;
  suggestedResolution: string;
  policyProtocol: string;
  policyTitle: string;
  complianceRate: string;
  latency: string;
  actionsPerformed: string[];

  // CRM Human Agent Resolution & Audit
  agentResolution: string; // Human agent resolution fetched from CRM
  agentResolutionStatus?: string; // e.g. "Logged in CRM", "Closed by Agent"
  agentLoggedAt?: string; // CRM timestamp
  crmTicketId?: string; // CRM ticket identifier

  // LLM context fields (used by LLM for analysis and suggested response; NOT displayed on front end)
  issueStatus?: string;
  reviewerComments?: string;
  correctnessScore?: number;
  correctnessAnalysis?: string;
}

export interface AuditLog {
  timestamp: string;
  actor: string;
  action: string;
  details: string;
}

export type ViewTab = 'live-queue-copilot' | 'inquiry-workbench' | 'escalation-hub' | 'performance-analytics' | 'knowledge-base' | 'automation-rules';
