const { v4: uuidv4 } = require('uuid');
const bycryptjs = require("bcryptjs")


const createOutput = (success, body, error=false) => {
    return {success, body, error}
}

const hashPassword = async (password) => {
    const generatedSalt = await bycryptjs.genSalt(10);
    const hashedPassword = await bycryptjs.hash(password, generatedSalt);
    return hashedPassword;
}

const createuuid = () => {
return uuidv4(); 
}
const comparePassword = async (password, hashedPassword) => {
    const comparisonResult = await bycryptjs.compare(password, hashedPassword);
    return comparisonResult;
}

module.exports = {
    createOutput, hashPassword, createuuid, hashPassword, comparePassword
}