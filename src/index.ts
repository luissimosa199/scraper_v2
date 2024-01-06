import axios from "axios";
import { JSDOM } from "jsdom";
import { Doctor } from "./types";
import { fetchAndParseXML } from "./utils/fetchAndParseXML";
import * as fs from "fs";

async function scrap(url: string): Promise<Doctor> {
  const response = await axios(url);

  const htmlContent = response.data;

  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const name =
    document.querySelector('span[itemprop="name"]')?.innerHTML.trim() || "";
  const image =
    document
      .querySelector('a[itemprop="image"]')
      ?.getAttribute("href")
      ?.substring(2) || "";
  const street =
    document
      .querySelector('span[itemprop="streetAddress"]')
      ?.textContent?.replace(/\s+/g, " ")
      .trim() || "";
  const city =
    document
      .querySelector('span[itemprop="addressLocality"]')
      ?.getAttribute("content") || "";
  const region =
    document
      .querySelector('span[itemprop="addressRegion"]')
      ?.getAttribute("content") || "";
  const country =
    document
      .querySelector('span[itemprop="addressCountry"]')
      ?.getAttribute("content") || "";

  const elements = document.querySelectorAll(
    'a[data-patient-app-event-name="dp-call-phone"]'
  );
  const phones = Array.from(elements || [], (e: Element) =>
    e.textContent?.replace(/\D/g, "")
  );

  console.log({ phones });

  const doctor: Doctor = {
    url,
    name,
    image,
    phones: phones.filter(
      (phone: string | undefined): phone is string => phone !== undefined
    ),
    address: {
      street,
      city,
      region,
      country,
    },
  };

  return doctor;
}

async function main() {
  const urls = await fetchAndParseXML(
    "https://www.doctoralia.es/sitemap.doctor.xml"
  );

  console.log(`${urls.length} URLS PARSED.`);

  const data: Doctor[] = [];

  for (let index = 0; index < urls.length; index++) {
    try {
      console.log(`-> Scraping ${index + 1}/${urls.length}`);
      const doctor = await scrap(urls[index]);
      data.push(doctor);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log("Error 404, page not found");
      } else if (error instanceof Error) {
        console.log("An error occurred:", error);
      } else {
        console.log("An unknown error occurred:", error);
      }
    }
  }

  fs.writeFileSync("OUTPUT_DOCTORALIA_ES.json", JSON.stringify(data, null, 2));
}

main();
