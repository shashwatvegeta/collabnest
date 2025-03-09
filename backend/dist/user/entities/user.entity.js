"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserType = void 0;
var UserType;
(function (UserType) {
    UserType["STUDENT"] = "student";
    UserType["MENTOR"] = "mentor";
    UserType["PROFESSOR"] = "professor";
})(UserType || (exports.UserType = UserType = {}));
class User {
    user_id;
    username;
    password;
    email;
    isVerified;
    roll_number;
    notifications;
    projects;
    user_type;
    student_skills;
    certificates;
    project_application;
    rating;
    achievements;
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map