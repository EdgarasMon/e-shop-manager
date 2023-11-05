const bcrypt = require("bcrypt");

validateUser = async (password, hash) => {
    return new Promise((resolve) => {
        bcrypt
            .compare(password, hash)
            .then(res => {
                return resolve(res)
            })
            .catch(err => console.error(err.message))
    })
}

module.exports = validateUser;  