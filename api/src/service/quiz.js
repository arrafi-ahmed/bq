const fs = require("fs");
const readline = require("readline");
const { sql } = require("../db");

exports.saveQuiz = async (payload, userId) => {
  if (typeof payload.data === "string") {
    payload.data = JSON.parse(payload.data);
  }
  if (typeof payload.level === "string") {
    payload.level = JSON.parse(payload.level);
  }
  if (typeof payload.jsonData === "string") {
    payload.jsonData = JSON.parse(payload.jsonData);
  }
  let upsertedQuiz = null;
  if (payload.id) {
    [upsertedQuiz] = await sql`
            update quiz
            set name=${payload.name},
                level_question=${payload.levelQuestion},
                level_answer=${payload.levelAnswer},
                level_deepest=${payload.levelDeepest},
                data=${payload.data}::json,
                level=${payload.level}::json,
                json_data=${payload.jsonData}::json,
                user_id=${userId}
            where id = ${payload.id}
            returning *`;
  } else {
    [upsertedQuiz] = await sql`
            insert into quiz
            (name, level_question, level_answer, level_deepest, data, level, json_data, user_id)
            values (${payload.name}, ${payload.levelQuestion}, ${payload.levelAnswer}, ${payload.levelDeepest},
                    ${payload.levelDeepest}, ${payload.data}::json, ${payload.level}::json, ${payload.jsonData}::json,
                    ${userId})
            returning *`;
  }

  return !!upsertedQuiz;
};

exports.getQuizzes = async (payload) => {
  return await sql`
        select *
        from quiz
        where user_id = ${payload}`;
};

exports.getQuiz = async (payload) => {
  const [result] = await sql`
        select *
        from quiz
        where id = ${payload}`;
  return result;
};

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
