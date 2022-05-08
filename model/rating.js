import pkg from 'mongoose';
const {Schema, model} = pkg;

const Rating = new Schema({
    user: {
        type: String,
        required: true
    },
    time: {
        type: Schema.Types.Decimal128,
        required: true
    },
});

export default model('Rating', Rating, 'rating');