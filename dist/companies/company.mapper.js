"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyMapper = void 0;
class CompanyMapper {
    static toEntity(row) {
        return {
            id: row.id,
            companyName: row.company_name,
            licenseNumber: row.license_number,
            ownerName: row.owner_name,
            businessDescription: row.business_description,
            createdAt: new Date(row.created_at),
        };
    }
    static toInsertRow(input) {
        return {
            id: input.id,
            company_name: input.companyName,
            license_number: input.licenseNumber,
            owner_name: input.ownerName,
            business_description: input.businessDescription,
        };
    }
    static toPublic(company, user) {
        return { ...company, email: user.email, emailVerified: user.emailVerified };
    }
}
exports.CompanyMapper = CompanyMapper;
//# sourceMappingURL=company.mapper.js.map