import { toast } from "vue-sonner";
import { countries } from "@/others/country-list";

export const appName = "Quiz Builder";
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export const clientBaseUrl = import.meta.env.VITE_BASE_URL;
export const isProd = import.meta.env.PROD;

const reader = new FileReader();

export const convertTextToJson = (text) => {
  let allData = []; // Initialize allData as an array, not an object
  let data = { diseases_category: {} };
  let diseaseCounter = 0;
  let category = null;
  let subCategory = null;
  let disease = null;
  let n = 0;
  let lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let spaces = line.length - line.trimLeft().length;

    try {
      if (spaces === 0 && line.trim() !== "") {
        diseaseCounter = 0;
        n++;
        if (n > 1) {
          allData.push({ ...data }); // Use the spread operator to copy data
        }
        category = line.trim();
        data = { diseases_category: { disease_category_name: category } }; // Reset data for a new category
      } else if (spaces === 1 && line.trim() !== "") {
        diseaseCounter++;
        disease = line.trim();
        data.diseases_category[
          `disease-${String.fromCharCode(64 + diseaseCounter)}`
        ] = { disease_name: disease };
      } else if (spaces === 2 && line.trim() !== "") {
        subCategory = line.trim().toLowerCase();
        data.diseases_category[
          `disease-${String.fromCharCode(64 + diseaseCounter)}`
        ][subCategory] = {};
      } else if (line.trim() !== "") {
        let level4Counter =
          Object.keys(
            data.diseases_category[
              `disease-${String.fromCharCode(64 + diseaseCounter)}`
            ][subCategory],
          ).length + 1;

        let item = line.trim();

        if (spaces === 3) {
          data.diseases_category[
            `disease-${String.fromCharCode(64 + diseaseCounter)}`
          ][subCategory][
            `${subCategory.slice(0, 3)}-${String.fromCharCode(
              64 + level4Counter,
            )}`
          ] = { name: item, details: {} };
        } else {
          let level5Counter =
            Object.keys(
              data.diseases_category[
                `disease-${String.fromCharCode(64 + diseaseCounter)}`
              ][subCategory][
                `${subCategory.slice(0, 3)}-${String.fromCharCode(
                  64 + (level4Counter - 1),
                )}`
              ]["details"],
            ).length + 1;

          data.diseases_category[
            `disease-${String.fromCharCode(64 + diseaseCounter)}`
          ][subCategory][
            `${subCategory.slice(0, 3)}-${String.fromCharCode(
              64 + (level4Counter - 1),
            )}`
          ]["details"][`details-${level5Counter}`] = item;
        }
      }
    } catch (err) {
      throw new Error(`Error parsing Line ${i + 1}`);
    }
  }
  // Append a copy of data to allData
  if (n > 0) {
    allData.push({ ...data });
  }
  return allData;
};

export const convertTextToArr = async (file) => {
  const fileContent = new Promise((resolve, reject) => {
    reader.readAsText(file, "utf-8");
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
  });
  const text = await fileContent;
  const lines = text.split("\n");
  const data = [];
  const level = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    const spaces = line.length - line.trimStart().length;
    const row = [null, null, null, null, null];
    line = line.trim();
    if (line !== "") {
      if (spaces === 0) {
        row[0] = line;
      } else if (spaces === 1) {
        row[1] = line;
      } else if (spaces === 2) {
        row[2] = line;
      } else if (spaces === 3) {
        row[3] = line;
      } else if (spaces === 4) {
        row[4] = line;
      }
      data.push(row);
      level.push(spaces);
    }
  }
  return { data, level };
};

export const convertArrayToText = ({ data, level }) => {
  let text = "";
  for (let row = 0; row < data.length; row++) {
    for (let col = 0; col < data[row].length; col++) {
      if (data[row][col] !== null) {
        // Append the repeated tab character and the value to the text
        text += "\t".repeat(level[row]) + data[row][col] + "\n";
      }
    }
  }
  return text;
};

export const showToast = (msg, color) => {
  if (color === "success") {
    toast.success(msg);
  } else if (color === "error") {
    toast.error(msg);
  } else if (color === "info") {
    toast.info(msg);
  } else if (color === "warning") {
    toast.warning(msg);
  } else {
    toast(msg);
  }
};

export const shuffleArray = (arr) => {
  const shuffledArr = [...arr];
  // Fisher-Yates (Knuth) shuffle algorithm
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }
  return shuffledArr;
};

export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// get iso datetime offset with timezone
export const toLocalISOString = (inputDate) => {
  const date = new Date(inputDate);
  const tzoffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISOTime = new Date(date - tzoffset).toISOString().slice(0, -1);
  return localISOTime;
};

export const formatDateTime = (inputDateTime) => {
  const formattedDate = formatDate(inputDateTime);
  const date = new Date(inputDateTime);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  // const seconds = `0${date.getSeconds()}`.slice(-2);
  return `${formattedDate} ${hours}:${minutes}`;
};

export const getClientPublicImgUrl = (imageName) =>
  imageName ? `/img/${imageName}` : null;

export const getApiPublicImgUrl = (imageName, type) =>
  isProd
    ? `${apiBaseUrl}/api/public/${type}/${imageName}`
    : `${apiBaseUrl}/${type}/${imageName}`;

export const getUserImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? getClientPublicImgUrl("default-user.jpg")
    : getApiPublicImgUrl(imageName, "user");
};

export const getEventImageUrl = (imageName) => {
  return imageName === "null" || !imageName
    ? getClientPublicImgUrl("default-event.jpg")
    : getApiPublicImgUrl(imageName, "event");
};

export const getToLink = (item) => {
  if (item.to.params) {
    const paramKey = Object.keys(item.to.params)[0];
    const paramVal = item.to.params[paramKey];
    return {
      name: item.to.name,
      params: { [paramKey]: paramVal },
    };
  }
  return item.to;
};

export const getQueryParam = (param) => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(param);
};

export const removeQueryParams = (url, paramsToRemove) => {
  const parsedUrl = new URL(url);

  // Create a URLSearchParams object from the URL's search parameters
  const searchParams = new URLSearchParams(parsedUrl.search);

  // Remove the specified query parameters
  paramsToRemove.forEach((param) => {
    searchParams.delete(param);
  });

  // Construct the new URL with the updated search parameters
  parsedUrl.search = searchParams.toString();

  // Return the updated URL as a string
  return parsedUrl.toString();
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidImage = (file) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  return allowedTypes.includes(file?.type);
};

export const isValidTxtfile = (file) => {
  const allowedTypes = ["text/plain"];
  return allowedTypes.includes(file?.type);
};

export const isValidPass = [
  (v) => !!v || "Password is required!",
  (v) => v.length >= 8 || "Password must be 8 or more characters!",
  (v) => /\d/.test(v) || "Password must include at least one number!",
];

export const showApiQueryMsg = (color = "blue") => {
  if (localStorage.hasOwnProperty("apiQueryMsg")) {
    toast(localStorage.getItem("apiQueryMsg"), {
      cardProps: { color },
      action: {
        label: "Close",
        buttonProps: {
          color: "white",
        },
        onClick() {},
      },
    });
    localStorage.removeItem("apiQueryMsg");
  }
};

export const input_fields = [
  { id: 0, title: "Short answer" },
  { id: 1, title: "Paragraph" },
  { id: 2, title: "Multiple choice" },
  { id: 3, title: "Checkboxes" },
  { id: 4, title: "Dropdown" },
];

export const getCountryList = (filterName) => {
  if (filterName === "all") return countries;
  return countries.map((item) => item[filterName]);
};

export const getCurrencySymbol = (currencyCode, type) => {
  const currencyCodeLower = currencyCode.toString().toLowerCase();

  const currencyMap = {
    usd: { icon: "mdi-currency-usd", symbol: "$" },
    gbp: { icon: "mdi-currency-gbp", symbol: "£" },
    eur: { icon: "mdi-currency-eur", symbol: "€" },
  };

  return currencyMap[currencyCodeLower][type];
};
