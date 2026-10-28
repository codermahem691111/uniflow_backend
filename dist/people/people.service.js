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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeopleService = void 0;
const common_1 = require("@nestjs/common");
const people_repository_1 = require("./people.repository");
let PeopleService = class PeopleService {
    people;
    constructor(people) {
        this.people = people;
    }
    list(scope, query) {
        return this.people.list(scope, query);
    }
    create(scope, dto) {
        return this.people.create(scope, dto);
    }
    async update(scope, id, dto) {
        const person = await this.people.update(scope, id, dto);
        if (!person)
            throw new common_1.NotFoundException('Person not found.');
        return person;
    }
    async remove(scope, id) {
        const wasDeleted = await this.people.delete(scope, id);
        if (!wasDeleted)
            throw new common_1.NotFoundException('Person not found.');
    }
};
exports.PeopleService = PeopleService;
exports.PeopleService = PeopleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [people_repository_1.PeopleRepository])
], PeopleService);
//# sourceMappingURL=people.service.js.map