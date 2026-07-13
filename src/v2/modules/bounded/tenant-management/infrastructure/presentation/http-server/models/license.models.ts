export class IssueLicenseRequest {
  tenantId!: string;
  licenseKey?: string;
  planType!: string;
  maxBranches!: number;
  maxUsers!: number;
  featuresEnabled?: Record<string, unknown>;
  validFrom?: Date;
  validUntil!: Date;
  graceDays?: number;
  signatureHash!: string;
  issuedBy!: string;
}

export class RenewLicenseRequest {
  planType?: string;
  maxBranches?: number;
  maxUsers?: number;
  featuresEnabled?: Record<string, unknown>;
  validFrom?: Date;
  validUntil!: Date;
  graceDays?: number;
  signatureHash!: string;
  issuedBy!: string;
}

export class RevokeLicenseRequest {
  revokedBy!: string;
  revocationReason!: string;
  revokedAt?: Date;
}

export class ActivateLicenseRequest {
  activatedBy!: string;
  activatedAt?: Date;
}

export class ValidateTenantOperationRequest {
  asOf?: Date;
  requiredBranches?: number;
  requiredUsers?: number;
  requiredFeatures?: string[];
}

export class LicenseKeyResponse {
  id!: string;
  tenantId!: string;
  licenseKey!: string;
  planType!: string;
  maxBranches!: number;
  maxUsers!: number;
  featuresEnabled?: Record<string, unknown>;
  validFrom!: string;
  validUntil!: string;
  graceDays!: number;
  signatureHash!: string;
  issuedBy!: string;
  status!: string;
  activatedAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  createdAt?: string;
  updatedAt?: string;
}
