const fs = require("fs");
const readline = require("readline");

exports.parseTextToJson = async (inputTextFile) => {
  let data = { Diseases_category: {} };
  let disease_counter = 0;
  let category = null;
  let sub_category = null;
  let disease = null;

  const fileStream = fs.createReadStream(inputTextFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    if (!line.startsWith("\t") && line.trim() !== "") {
      category = line;
      data["Diseases_category"]["Disease_category_name"] = category;
    } else if (
      line.startsWith("\t") &&
      !line.startsWith("\t\t") &&
      line.trim() !== ""
    ) {
      disease_counter += 1;
      disease = line.trim();
      data["Diseases_category"][
        "Disease-" + String.fromCharCode(64 + disease_counter)
      ] = { Disease_Name: disease };
    } else if (
      line.startsWith("\t\t") &&
      !line.startsWith("\t\t\t") &&
      line.trim() !== ""
    ) {
      sub_category = line.trim();
      data["Diseases_category"][
        "Disease-" + String.fromCharCode(64 + disease_counter)
      ][sub_category] = {};
    } else if (line.trim() !== "") {
      item_counter =
        Object.keys(
          data["Diseases_category"][
            "Disease-" + String.fromCharCode(64 + disease_counter)
          ][sub_category]
        ).length + 1;
      item = line.trim();
      data["Diseases_category"][
        "Disease-" + String.fromCharCode(64 + disease_counter)
      ][sub_category][
        sub_category.slice(0, 4) + "-" + String.fromCharCode(64 + item_counter)
      ] = item;
    }
  }
  return data;
};
