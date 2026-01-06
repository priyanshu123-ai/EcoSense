import Tesseract from "tesseract.js";

export const extractTextFromImage = async (buffer) => {
  const { data } = await Tesseract.recognize(buffer, "eng");
  return data.text || "";
};
