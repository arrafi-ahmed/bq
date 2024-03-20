const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const CustomError = require("../model/CustomError");
const { sql } = require("../db");

const generateAuthData = (result) => {
  let token = "";
  let currentUser = {};
  if (result) {
    currentUser = {
      id: result.id,
      role: result.role === 10 ? "admin" : "user",
      name: result.fullName,
      image: result.image,
    };
    token = jwt.sign({ currentUser }, process.env.TOKEN_SECRET);
  }
  return { token, currentUser };
};

exports.register = async (payload) => {
  payload.role = 20;
  const [insertedUser] = await sql`insert into app_user ${sql(
    payload
  )} returning *`;
  if (insertedUser) {
    return generateAuthData(insertedUser);
  } else {
    throw new CustomError("Registration Failed!");
  }
};

exports.signin = async ({ email, password }) => {
  const result = await sql`select *
                             from app_user
                             where email = ${email}
                               and password = ${password}`;
  if (result.length > 0) {
    return generateAuthData(result[0]);
  } else {
    throw new CustomError("Incorrect email/password!", 401);
  }
};
