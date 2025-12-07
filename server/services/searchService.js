

const searchFunc = async (search, model, field, limit, skip) => {
     if (search.length === 0) {
          return model.find().limit(limit).skip(skip);
     }

     // create regex pattern for case insensitive search
     const pattern = search.split("").join("\\s*") // insert s* to cater for spaces between character

     return await model.find({
          [field]: {
               $regex: pattern,
               $options: "i", // case insensitive
          }
     }).limit(limit).skip(skip) || [];
}

export {
     searchFunc,
}