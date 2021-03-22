"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailPatternString = exports.emailPattern = exports.passwordSpecialChars = exports.passwordPatternString = exports.passwordPattern = void 0;
exports.passwordPattern = /^(?=.{8,128})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=~]).*$/g;
exports.passwordPatternString = exports.passwordPattern.source;
exports.passwordSpecialChars = '@#$%^&+=~';
exports.emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.emailPatternString = exports.emailPattern.source;
