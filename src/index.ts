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
  const sitemapUrls = [
    "https://www.doctoralia.es/sitemap.doctor.xml",
    "https://www.doctoralia.es/sitemap.doctor_0.xml",
    "https://www.doctoralia.es/sitemap.doctor_1.xml",
  ];

  let data: Doctor[] = [];
  let fileCount = 0;
  let totalProcessed = 0;

  const writeDataToFile = () => {
    fs.writeFileSync(
      `OUTPUT_DOCTORALIA_ES_${fileCount}.json`,
      JSON.stringify(data, null, 2)
    );
    fileCount++;
    data = []; // Reset the data array for the next chunk
  };

  for (const url of sitemapUrls) {
    console.log(`Processing sitemap: ${url}`);

    const urls = await fetchAndParseXML(url);

    console.log(`${urls.length} URLs parsed from ${url}.`);

    for (let index = 0; index < urls.length; index++) {
      try {
        console.log(`-> Scraping ${index + 1}/${urls.length} from ${url}`);
        const doctor = await scrap(urls[index]);
        data.push(doctor);
        totalProcessed++;

        if (totalProcessed % 10000 === 0) {
          writeDataToFile();
        }
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
  }

  // Write remaining data if any
  if (data.length > 0) {
    writeDataToFile();
  }
}

main();
