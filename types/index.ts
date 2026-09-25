/**
 * TechSphere Technology — Core Domain Types & Content Interfaces
 * 
 * Based strictly on verified company data and architectural specifications.
 * All pending data marked with [REQUIRES COMPANY INFORMATION] in docs/CONTENT.md.
 */

// --- Company Identity & Growth ---

export type GrowthStage = "India" | "UAE" | "USA" | "Global As Per Demand";

export interface CoreValue {
  id: string;
  name: string;
  description: string;
}

// --- Technology Solutions ---

export type ServiceCategorySlug =
  | "custom-software-solutions"
  | "ai-automation"
  | "web-application-development"
  | "ecommerce-solutions"
  | "cybersecurity-solutions"
  | "cloud-it-solutions"
  | "data-business-intelligence"
  | "technology-consulting";

export interface ServiceCapability {
  id: string;
  title: string;
  description?: string;
}

export interface ServiceItem {
  id: string;
  slug: ServiceCategorySlug;
  title: string;
  summary: string;
  description?: string;
  iconName: string;
  capabilities?: ServiceCapability[];
  displayOrder: number;
}

// --- Industry Verticals ---

export type IndustrySlug =
  | "real-estate"
  | "ecommerce"
  | "manufacturing"
  | "professional-services"
  | "startups-smes"
  | "healthcare";

export interface IndustryItem {
  id: string;
  slug: IndustrySlug;
  name: string;
  summary: string;
  description?: string;
  iconName: string;
  displayOrder: number;
}

// --- Case Studies (Pending Verified Client Data) ---

export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  clientName?: string; // Optional until verified
  industry: IndustrySlug;
  challenge: string;
  solution: string;
  outcome: string;
  technologies: string[];
  isFeatured: boolean;
  publishedAt?: string;
}

// --- Inquiries & Intake ---

export interface ContactInquiryPayload {
  fullName: string;
  email: string;
  companyName?: string;
  phone?: string;
  serviceInterest?: ServiceCategorySlug;
  message: string;
}

export interface JobApplicationPayload {
  jobId: string;
  fullName: string;
  email: string;
  phone?: string;
  resumeUrl: string;
  coverNote?: string;
}
