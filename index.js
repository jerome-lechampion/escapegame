const axios = require("axios");
const data = require("./data.json");
const htmlparser = require("htmlparser2");

const articles = [];
const parser = new htmlparser.Parser(
  {
    onopentag: (name, attrib) => {
      if (name == "p")
        console.log("a paragraph element is opening", attrib.tamere);
    },
  },
  { decodeEntities: true }
);
parser.write(`<!DOCTYPE html><p tamere="test">Hello world</p>`);
parser.end();

axios
  .get("https://www.escapegame.fr/paris/")
  .then(function (response) {
    const a = response.data
      .substr(response.data.indexOf("<article"))
      .substr(0, response.data.lastIndexOf("</article") + 12);
    //console.log(a);

    const dom = htmlparser.parseDocument(response.data);
    console.log(dom.children);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
data.body.article
  .map((a) => ({
    theme: a["@data-theme"],
    level: a["@data-levels"],
    nbPlayer: a["@data-players"],
    name: a.div.find(
      (d) => d["@class"] === "row gx-2 align-items-center bottom15 top10"
    ).div[0].h2.a["#text"],
    company: a.div.find(
      (d) => d["@class"] === "row gx-2 align-items-center bottom15 top10"
    )?.div[0].div["#text"],
    siteRating: a.div
      .find((d) => d["@class"] === "rating ")
      ?.div[1]["@style"].replace("width: ", "")
      .replace("px;", ""),
    userRating: parseInt(
      a.div
        .find(
          (d) =>
            d["@class"] ===
            "rating user-rating user-rating-label user-rating-pos"
        )
        ?.text.replace("%", "")
    ),
  }))
  .filter((a) => a.userRating)
  .sort((a, b) => b.userRating - a.userRating)
  .map((a) => console.log(a.name + " " + a.userRating));
