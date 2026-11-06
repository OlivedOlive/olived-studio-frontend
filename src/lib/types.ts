export type Role = "CLIENT_MEMBER" | "CLIENT_ADMIN" | "OLIVED_REVIEWER" | "OLIVED_ADMIN";
export type DesignStatus = "DRAFT" | "SUBMITTED" | "CHANGES_REQUESTED" | "APPROVED";

export type Me = {
  user: { id: string; email: string; name: string };
  organization: { id: string; name: string };
  role: Role;
};

export type Template = {
  id: string;
  kind: string;
  name: string;
  widthMm: string;
  heightMm: string;
};

export type Variant = { id: string; name: string; volumeMl: number; templates: Template[] };
export type Product = { id: string; name: string; description: string | null; variants: Variant[] };
export type Market = { id: string; code: string; name: string; languages: string[] };

export type DesignContent = {
  fields: Record<string, string>;
  colors: { primary: string; secondary: string };
};

export type Issue = { field: string; message: string };
export type RequiredField = { key: string; label: string };

type TemplateWithProduct = Template & { variant: Variant & { product: Product } };

export type DesignSummary = {
  id: string;
  name: string;
  status: DesignStatus;
  updatedAt: string;
  market: Market;
  template: TemplateWithProduct;
};

export type DesignDetail = DesignSummary & {
  market: Market & { ruleSets: { rules: { requiredFields: RequiredField[] } }[] };
  versions: {
    id: string;
    number: number;
    content: DesignContent;
    validationResults: { passed: boolean; issues: Issue[] }[];
    approvals: { decision: "APPROVED" | "CHANGES_REQUESTED"; comment: string | null }[];
  }[];
};

export type ReviewDesign = DesignDetail & { organization: { name: string } };
