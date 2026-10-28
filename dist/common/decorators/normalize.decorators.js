"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uppercase = exports.EmptyToNull = exports.Lowercase = exports.Trim = void 0;
const class_transformer_1 = require("class-transformer");
const applyToStrings = (transform) => (0, class_transformer_1.Transform)(({ value }) => (typeof value === 'string' ? transform(value) : value));
const Trim = () => applyToStrings((value) => value.trim());
exports.Trim = Trim;
const Lowercase = () => applyToStrings((value) => value.toLowerCase());
exports.Lowercase = Lowercase;
const EmptyToNull = () => (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' && value.trim() === '' ? null : value);
exports.EmptyToNull = EmptyToNull;
const Uppercase = () => applyToStrings((value) => value.toUpperCase());
exports.Uppercase = Uppercase;
//# sourceMappingURL=normalize.decorators.js.map