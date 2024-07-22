
const mongoose = require('mongoose');
const { Schema } = mongoose;

const personSchema = new Schema({
    name: { type: String, required: true },
    parents: [{ type: Schema.Types.ObjectId, ref: 'Person' }], 
    siblings: [{ type: Schema.Types.ObjectId, ref: 'Person' }], 
    children: [{ type: Schema.Types.ObjectId, ref: 'Person' }], 
    cousins: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
