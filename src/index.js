"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var jsdom_1 = require("jsdom");
var fetchAndParseXML_1 = require("./utils/fetchAndParseXML");
var fs = require("fs");
function scrap(url, cancelToken) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __awaiter(this, void 0, void 0, function () {
        var response, htmlContent, dom, document, name, image, street, city, region, country, elements, phones, diseaseList, about, reviewElements, reviews, doctor;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0: return [4 /*yield*/, (0, axios_1.default)(url, { cancelToken: cancelToken })];
                case 1:
                    response = _k.sent();
                    htmlContent = response.data;
                    dom = new jsdom_1.JSDOM(htmlContent);
                    document = dom.window.document;
                    name = ((_a = document.querySelector('span[itemprop="name"]')) === null || _a === void 0 ? void 0 : _a.innerHTML.trim()) || "";
                    image = ((_c = (_b = document
                        .querySelector('a[itemprop="image"]')) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) === null || _c === void 0 ? void 0 : _c.substring(2)) || "";
                    street = ((_e = (_d = document
                        .querySelector('span[itemprop="streetAddress"]')) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.replace(/\s+/g, " ").trim()) || "";
                    city = ((_f = document
                        .querySelector('span[itemprop="addressLocality"]')) === null || _f === void 0 ? void 0 : _f.getAttribute("content")) || "";
                    region = ((_g = document
                        .querySelector('span[itemprop="addressRegion"]')) === null || _g === void 0 ? void 0 : _g.getAttribute("content")) || "";
                    country = ((_h = document
                        .querySelector('span[itemprop="addressCountry"]')) === null || _h === void 0 ? void 0 : _h.getAttribute("content")) || "";
                    elements = document.querySelectorAll('a[data-patient-app-event-name="dp-call-phone"]');
                    phones = Array.from(elements || [], function (e) { var _a; return (_a = e.textContent) === null || _a === void 0 ? void 0 : _a.replace(/\D/g, ""); });
                    diseaseList = Array.from(document.querySelectorAll('div[id="data-type-disease"] li')).map(function (e) { var _a; return ((_a = e.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || ""; });
                    about = ((_j = document.querySelector('div[id="data-type-about"] div.modal-body p')) === null || _j === void 0 ? void 0 : _j.textContent) || "";
                    reviewElements = document.querySelectorAll("div[data-test-id='opinion-block']");
                    reviews = [];
                    reviewElements.forEach(function (reviewElement) {
                        var _a, _b, _c, _d, _e;
                        var name = (_b = (_a = reviewElement
                            .querySelector("h4[itemprop='author'] [itemprop='name']")) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim();
                        var date = (_c = reviewElement
                            .querySelector("time[itemprop='datePublished']")) === null || _c === void 0 ? void 0 : _c.getAttribute("datetime");
                        var comment = (_e = (_d = reviewElement
                            .querySelector("p[itemprop='description']")) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim();
                        var review = {
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
                    doctor = {
                        url: url,
                        name: name,
                        about: about,
                        image: image,
                        diseaseList: diseaseList,
                        phones: phones.filter(function (phone) { return phone !== undefined; }),
                        address: {
                            street: street,
                            city: city,
                            region: region,
                            country: country,
                        },
                        reviews: reviews,
                    };
                    return [2 /*return*/, doctor];
            }
        });
    });
}
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var sitemapUrls, data, failedUrls, fileCount, totalProcessed, writeDataToFile, writeFailedUrlsToFile, _loop_1, _i, sitemapUrls_1, url;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    sitemapUrls = [
                        "https://www.doctoraliar.com/sitemap.doctor.xml",
                        "https://www.doctoraliar.com/sitemap.doctor_0.xml",
                        "https://www.doctoraliar.com/sitemap.doctor_1.xml",
                    ];
                    data = [];
                    failedUrls = [];
                    fileCount = 0;
                    totalProcessed = 0;
                    writeDataToFile = function () {
                        fs.writeFileSync("OUTPUT_DOCTORALIA_ES_".concat(fileCount, ".json"), JSON.stringify(data, null, 2));
                        fileCount++;
                        data = []; // Reset the data array for the next chunk
                    };
                    writeFailedUrlsToFile = function () {
                        fs.writeFileSync("FAILED_URLS_DOCTORALIA_ES.json", JSON.stringify(failedUrls, null, 2));
                    };
                    _loop_1 = function (url) {
                        var urls, _loop_2, index;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    console.log("Processing sitemap: ".concat(url));
                                    return [4 /*yield*/, (0, fetchAndParseXML_1.fetchAndParseXML)(url)];
                                case 1:
                                    urls = _c.sent();
                                    console.log("".concat(urls.length, " URLs parsed from ").concat(url, "."));
                                    _loop_2 = function (index) {
                                        var CancelToken, source, doctor, error_1;
                                        return __generator(this, function (_d) {
                                            switch (_d.label) {
                                                case 0:
                                                    CancelToken = axios_1.default.CancelToken;
                                                    source = CancelToken.source();
                                                    // Set a timeout to cancel the request after 60 seconds
                                                    setTimeout(function () {
                                                        source.cancel("Request cancelled due to timeout: ".concat(urls[index]));
                                                    }, 60000); // 60 seconds timeout
                                                    _d.label = 1;
                                                case 1:
                                                    _d.trys.push([1, 3, , 4]);
                                                    console.log("-> Scraping ".concat(index + 1, "/").concat(urls.length));
                                                    return [4 /*yield*/, scrap(urls[index], source.token)];
                                                case 2:
                                                    doctor = _d.sent();
                                                    //
                                                    // console.log(doctor);
                                                    //
                                                    data.push(doctor);
                                                    totalProcessed++;
                                                    if (totalProcessed % 10000 === 0) {
                                                        writeDataToFile();
                                                    }
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    error_1 = _d.sent();
                                                    if (axios_1.default.isCancel(error_1)) {
                                                        console.log("Request to ".concat(urls[index], " aborted: ").concat(error_1.message));
                                                        failedUrls.push(urls[index]);
                                                    }
                                                    else if (axios_1.default.isAxiosError(error_1) &&
                                                        ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                                                        console.log("Error 404, page not found");
                                                    }
                                                    else if (error_1 instanceof Error) {
                                                        console.log("An error occurred:", error_1);
                                                        failedUrls.push(urls[index]);
                                                    }
                                                    else {
                                                        console.log("An unknown error occurred:", error_1);
                                                        failedUrls.push(urls[index]);
                                                    }
                                                    return [3 /*break*/, 4];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    };
                                    index = 0;
                                    _c.label = 2;
                                case 2:
                                    if (!(index < urls.length)) return [3 /*break*/, 5];
                                    return [5 /*yield**/, _loop_2(index)];
                                case 3:
                                    _c.sent();
                                    _c.label = 4;
                                case 4:
                                    index++;
                                    return [3 /*break*/, 2];
                                case 5: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, sitemapUrls_1 = sitemapUrls;
                    _b.label = 1;
                case 1:
                    if (!(_i < sitemapUrls_1.length)) return [3 /*break*/, 4];
                    url = sitemapUrls_1[_i];
                    return [5 /*yield**/, _loop_1(url)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    // Write remaining data if any
                    if (data.length > 0) {
                        writeDataToFile();
                    }
                    // Write failed URLs to file
                    if (failedUrls.length > 0) {
                        writeFailedUrlsToFile();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () {
    console.log("\n\n\nSCRAPE SCRIPT ENDED SUCCESSFULLY\n\n\n");
});
