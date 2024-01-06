import axios from "axios";
import * as xml2js from "xml2js";

export async function fetchAndParseXML(url: string) {
  try {
    // Fetch the XML file
    const response = await axios.get(url);
    const xml = response.data;

    // Parse the XML
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);

    return result.urlset.url.map((e: { loc: string }) => e.loc).flat();
  } catch (error) {
    console.error("Error fetching or parsing XML:", error);
  }
}
