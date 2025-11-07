import { envs } from "../../envs/index.env";
import { TQueryParams } from "../types";

export const send_contact_request_and_mail = async (body: TQueryParams) => {
  try {
    const resp = await fetch(envs.CONTACT_US_GOOGLE_APP_SCRIPTS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }
  } catch (error) {
    return (error as Error).message;
  }
};

export const send_job_application_request_and_mail = async (body: TQueryParams) => {
  try {
    const resp = await fetch(envs.OPENING_GOOGLE_APP_SCRIPTS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (data.status === "error") {
      throw new Error(data.message);
    }
  } catch (error) {
    return (error as Error).message;
  }
};
