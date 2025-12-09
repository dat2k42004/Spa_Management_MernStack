
// function to remove punctuation
const removePunctuation = (text) => {
     return text
          .normalize("NFD") // decompose combined letters into letter + diacritic
          .replace(/[\u0300-\u036f]/g, "") // remove diacritics
          .replace(/â/g, "a")
          .replace(/Â/g, "A")
          .replace(/ă/g, "a")
          .replace(/Ă/g, "A")
          .replace(/ê/g, "e")
          .replace(/Ê/g, "E")
          .replace(/ơ/g, "o")
          .replace(/Ơ/g, "O")
          .replace(/ô/g, "o")
          .replace(/Ô/g, "O")
          .replace(/ư/g, "u")
          .replace(/Ư/g, "U")
          .replace(/đ/g, "d")
          .replace(/Đ/g, "D");
}

const searchFunc = async (search, model, field, limit, skip, skipField = "") => {
     if (search.length === 0) {
          return model.find().limit(limit).skip(skip);
     }

     // normalize punctuation
     const normalizedSearch = removePunctuation(search);

     // create regex pattern for case insensitive search
     const pattern = normalizedSearch.split("").join("\\s*") // insert s* to cater for spaces between character

     // regex search
     const regex = new RegExp(pattern, "i");

     // get all documents
     const allDocs = await model.find().select(skipField);

     // filter
     const result = await allDocs.filter(doc => {
          const fieldValue = doc[field] || "";
          const normalizedField = removePunctuation(fieldValue);
          return regex.test(normalizedField);
     })

     return result.slice(Math.min(skip, result.length), Math.min(skip + limit, result.length));;
}

export {
     searchFunc,
}