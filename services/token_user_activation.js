var models  = require('../models');
var Op = require('sequelize').Op || {}
// module.exports = () => {
    
//     this._expirationInterval = setInterval(this.clearExpiredSessions.bind(this), this.options.checkExpirationInterval)
// }

module.exports = {

    options: {
        checkExpirationInterval: 15 * 60 * 1000,
    },

    init: function() {
        this._expirationInterval = setInterval(this.clearExpiredTokens.bind(this), this.options.checkExpirationInterval)
    },

    clearExpiredTokens: function () {
        models.User_activation.destroy({where: {'expires': {[Op.lt || 'lt']: new Date()}}})
    }
}
