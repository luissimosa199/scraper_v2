import axios, { CancelToken } from "axios";
import { JSDOM } from "jsdom";
import { Doctor } from "./types";
import { fetchAndParseXML } from "./utils/fetchAndParseXML";
import * as fs from "fs";

async function scrap(url: string, cancelToken: CancelToken): Promise<Doctor> {
  const response = await axios(url, { cancelToken });

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

  const reviewElements = document.querySelectorAll(
    "div[data-test-id='opinion-block']"
  );
  const reviews: Doctor["reviews"] = [];

  reviewElements.forEach((reviewElement) => {
    const name = reviewElement
      .querySelector("h4[itemprop='author'] [itemprop='name']")
      ?.textContent?.trim();
    const date = reviewElement
      .querySelector("time[itemprop='datePublished']")
      ?.getAttribute("datetime");
    const comment = reviewElement
      .querySelector("p[itemprop='description']")
      ?.textContent?.trim();

    const review = {
      author: name || "",
      date: date || "",
      comment: comment || "",
      rate: null,
      origin: url,
      firstScanned: Date.now(),
      updatedAt: null,
    };

    reviews.push(review);
  });

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
    reviews,
  };

  return doctor;
}

async function main() {
  const sitemapUrls = ["https://www.doctoralia.es/sitemap.doctor_0.xml"];

  let data: Doctor[] = [];
  const failedUrls: string[] = [];
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

  const writeFailedUrlsToFile = () => {
    fs.writeFileSync(
      `FAILED_URLS_DOCTORALIA_ES.json`,
      JSON.stringify(failedUrls, null, 2)
    );
  };

  for (const url of sitemapUrls) {
    console.log(`Processing sitemap: ${url}`);

    const urls = await fetchAndParseXML(url);

    console.log(`${urls.length} URLs parsed from ${url}.`);

    for (let index = 0; index < urls.length; index++) {
      if (index < 39999) continue;
      // Create a new Axios CancelToken for each request
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      // Set a timeout to cancel the request after 60 seconds
      setTimeout(() => {
        source.cancel(`Request cancelled due to timeout: ${urls[index]}`);
      }, 60000); // 60 seconds timeout

      try {
        console.log(`-> Scraping ${index + 1}/${urls.length}`);
        const doctor = await scrap(urls[index], source.token);
        data.push(doctor);
        totalProcessed++;

        if (totalProcessed % 10000 === 0) {
          writeDataToFile();
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log(`Request to ${urls[index]} aborted: ${error.message}`);
          failedUrls.push(urls[index]);
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 404
        ) {
          console.log("Error 404, page not found");
        } else if (error instanceof Error) {
          console.log("An error occurred:", error);
          failedUrls.push(urls[index]);
        } else {
          console.log("An unknown error occurred:", error);
          failedUrls.push(urls[index]);
        }
      }
    }
  }

  // Write remaining data if any
  if (data.length > 0) {
    writeDataToFile();
  }

  // Write failed URLs to file
  if (failedUrls.length > 0) {
    writeFailedUrlsToFile();
  }
}

main().then(() => {
  console.log("\n\n\nSCRAPE SCRIPT ENDED SUCCESSFULLY\n\n\n");
});
