import z from "zod";
import { zodStringRequired } from "../utils/zod";
import { regexes } from "../constants";

export const contactUsSchema = z.object({
  name: zodStringRequired({
    field: "name",
    showingFieldName: "Name",
    blockMultipleSpaces: true,
    min: 2,
    max: 50,
    customRegexes: [
      {
        regex: regexes.validName,
        message:
          "can only contain letters and only one space is allowed between words",
      },
    ],
  }),
  phoneNumber: zodStringRequired({
    field: "phoneNumber",
    showingFieldName: "Phone number",
    blockSingleSpace: true,
    customRegexes: [
      { regex: regexes.phoneStart, message: "must start with 6, 7, 8, or 9" },
      { regex: regexes.phoneExactLength, message: "must be exactly 10 digits" },
      {
        regex: regexes.validPhone,
        message: "must be exactly 10 digits and must start with 6, 7, 8, or 9",
      },
    ],
  }),
  email: zodStringRequired({
    field: "email",
    showingFieldName: "Email",
    blockSingleSpace: true,
    customRegexes: [{ regex: regexes.validEmail, message: "must be a valid" }],
  }).toLowerCase(),
  message: zodStringRequired({
    field: "message",
    showingFieldName: "Message",
    blockMultipleSpaces: true,
    min: 10,
  }),
});
