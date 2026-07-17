export type Role = "Admin" | "Architect" | "Security" | "Viewer";
export type JobStatus = "queued" | "running" | "completed" | "failed";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationId: string;
}
export interface Organization {
  id: string;
  name: string;
  industry: string;
  plan: string;
}
export interface Project {
  id: string;
  name: string;
  company: string;
  industry: string;
  cloudProvider: "Azure" | "AWS" | "GCP" | "Hybrid" | null;
  migrationType: string;
  status: string;
  completion?: number;
  lastUpdated?: string;
  createdAt?: string;
  updatedAt?: string;
  generatedArtifacts?: number;
  openRisks?: number;
  securityScore?: number;
  estimatedMonthlyCost?: number;
  businessProblem?: string;
  currentArchitecture?: string;
  targetGoal?: string;
  compliance?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
}
export interface DiscoveryQuestion {
  id: string;
  text: string;
  category: string;
  optional: boolean;
  answered: boolean;
}
export interface DiscoveryAnswer {
  questionId: string;
  answer: string;
  skipped?: boolean;
}
export interface ArchitectureModel {
  businessContext: string;
  currentState: string;
  targetState: string;
  applications: string[];
  integrations: string[];
  dataStores: string[];
  infrastructure: string[];
  security: string[];
  deployment: string[];
  operations: string[];
  assumptions: string[];
  constraints: string[];
  decisions: string[];
  risks: Risk[];
}
export interface Artifact {
  id: string;
  projectId: string;
  type: string;
  name: string;
  status: string;
  language: "markdown" | "yaml" | "json" | "terraform" | "mermaid";
  version: string;
  content: string;
  updatedAt: string;
}
export interface ADR {
  id: string;
  title: string;
  status: string;
  context: string;
  decision: string;
  consequences: string;
}
export interface Risk {
  risk: string;
  category: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  probability: string;
  impact: string;
  mitigation: string;
  owner: string;
  status: string;
}
export interface SecurityFinding {
  title: string;
  area: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
}
export interface CostEstimate {
  monthly: number;
  yearly: number;
  compute: number;
  storage: number;
  database: number;
  network: number;
  monitoring: number;
  nonProduction: number;
  production: number;
  assumptions: string[];
}
export interface GenerationJob {
  id: string;
  status: JobStatus;
  progress: number;
  categories: Record<string, number>;
  message: string;
}
export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  createdAt: string;
  ipAddress: string;
}
