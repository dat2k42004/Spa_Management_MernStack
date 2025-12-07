const endChar = ".?!:;";
const interruptChar = ".?!:;,";
const textNormalize = (text, type) => {
     console.log("[textNormalize] Original text: ", text);

     // split by space
     let words = text.trim().split(/\s+/); // split by one or more spaces
     let upperWords = true;


     // normalize each word
     let normalizedText = "";
     if (type === "name") {
          for (let i = 0; i < words.length; ++i) {
               let w = words[i].trim();
               while (interruptChar.includes(w[w.length - 1])) {
                    w = w.slice(0, w.length - 1);
               }
               if (w.length === 0) {
                    continue;
               }
               normalizedText += w[0].toUpperCase() + w.slice(1).toLowerCase() + " ";
          }
     }
     else {
          for (let i = 0; i < words.length; ++i) {
               let w = words[i].trim();
               w = (upperWords ? w[0].toUpperCase() : w[0]) + w.slice(1).toLowerCase();
               if (!endChar.includes(w[w.length - 1])) {
                    upperWords = false;
               }
               normalizedText += w + " ";
          }
     }
     console.log("[textNormalize] Normalized text: ", normalizedText.trim());
     return normalizedText.trim();
}

export {
     textNormalize,
}