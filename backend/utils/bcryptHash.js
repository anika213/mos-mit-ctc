const bcrypt = require("bcryptjs");

const saltLen = 10;

const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltLen);
    return bcrypt.hashSync(password, salt);
};

module.exports = hashPassword;