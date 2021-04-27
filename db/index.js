const mongoose = require('mongoose')

mongoose.connect(
    'mongodb+srv://luan:luan30798@juno-integration.kjl52.mongodb.net/marketplace?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
)
mongoose.Promise = global.Promise

module.exports = mongoose