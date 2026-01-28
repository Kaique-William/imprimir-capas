const mongoose = require("mongoose")

const Reg = new mongoose.Schema({

    nome:{
        type: String,
        required: true,
        unique: true
    },
    codigo:{
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("reg", Reg);