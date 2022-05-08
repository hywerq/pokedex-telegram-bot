import Rating from './model/rating.js';

class MongooseController {
    getRating = async () => {
        const rating = await Rating.find({}).sort({time: 1}).limit(10).exec();

        let result = '';
        for(let i = 0; i < rating.length; i++) {
            result += `${i+1}. ${rating[i].user} : ${rating[i].time}\n`;
        }
        console.log(result);
        return result;
    }

    putResult = async (resultData) => {
        const rating = new Rating({
            user: resultData.user,
            time: resultData.time
        });
        return await rating.save();
    }
}

export default new MongooseController();