"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleController = void 0;
const common_1 = require("@nestjs/common");
const tenant_decorators_1 = require("../tenancy/tenant.decorators");
const tenant_scope_1 = require("../tenancy/tenant-scope");
const create_person_dto_1 = require("./dto/create-person.dto");
const list_people_query_dto_1 = require("./dto/list-people-query.dto");
const update_person_dto_1 = require("./dto/update-person.dto");
const people_service_1 = require("./people.service");
let PeopleController = class PeopleController {
    peopleService;
    constructor(peopleService) {
        this.peopleService = peopleService;
    }
    list(scope, query) {
        return this.peopleService.list(scope, query);
    }
    create(scope, dto) {
        return this.peopleService.create(scope, dto);
    }
    update(scope, id, dto) {
        return this.peopleService.update(scope, id, dto);
    }
    remove(scope, id) {
        return this.peopleService.remove(scope, id);
    }
};
exports.PeopleController = PeopleController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, list_people_query_dto_1.ListPeopleQueryDto]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, create_person_dto_1.CreatePersonDto]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, String, update_person_dto_1.UpdatePersonDto]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, tenant_decorators_1.Tenant)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_scope_1.TenantScope, String]),
    __metadata("design:returntype", Promise)
], PeopleController.prototype, "remove", null);
exports.PeopleController = PeopleController = __decorate([
    (0, common_1.Controller)('people'),
    (0, tenant_decorators_1.TenantProtected)(),
    __metadata("design:paramtypes", [people_service_1.PeopleService])
], PeopleController);
//# sourceMappingURL=people.controller.js.map