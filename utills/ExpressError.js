class ExpressError extends Error {
    constructor(statusCode,massege) {
        super();
this.statusCode = statusCode;
this.message = massege;
    }
}
module.exports = ExpressError;