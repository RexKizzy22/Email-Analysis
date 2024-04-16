"use strict";
/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */

exports.__esModule = true;

const fs_1 = require("fs");
const isValid = function (mail) {
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  return re.test(String(mail).toLowerCase());
};

const prepareMails = function (path) {
  const emails = fs_1["default"].readFileSync(path);
  const allMails = JSON.parse(JSON.stringify(emails.toString()));
  const mailArray = allMails.split("\n");
  return mailArray;
};

const categorizeDomain = function (mails) {
  const emailAdds = mails.filter(function (mail) {
    return mail.includes("@");
  });
  const validEmailAdds = emailAdds.filter(function (mail) {
    return isValid(mail);
  });
  const domains = validEmailAdds.map(function (mail) {
    return mail.split("@")[1];
  });
  const uniqueDomains = Array.from(new Set(domains));
  const category = {};
  for (let _i = 0, domains_1 = domains; _i < domains_1.length; _i++) {
    const domain = domains_1[_i];
    // eslint-disable-next-line no-prototype-builtins
    if (!category.hasOwnProperty(domain)) {
      category[domain] = 1;
    } else {
      category[domain]++;
    }
  }
  return {
    "valid-domains": uniqueDomains,
    totalEmailsParsed: emailAdds.length,
    totalValidEmails: validEmailAdds.length,
    categories: category,
  };
};

function analyseFiles(inputPaths, outputPath) {
  if (inputPaths) {
    if (inputPaths.length === 1) {
      const categorized = categorizeDomain(prepareMails(inputPaths[0]));
      fs_1["default"].writeFile(
        outputPath,
        JSON.stringify(categorized, null, 2),
        function (err) {
          return err && console.log(err);
        },
      );
    } else {
      const emailArray = inputPaths.map(function (path) {
        const emailAdds = prepareMails(path);
        return emailAdds;
      });
      const allEmailAdds = emailArray.flat(1);
      const categorized = categorizeDomain(allEmailAdds);
      fs_1["default"].writeFile(
        outputPath,
        JSON.stringify(categorized, null, 2),
        function (err) {
          return err && console.log(err);
        },
      );
    }
  }
}

// eslint-disable-next-line no-warning-comments
// TODO: replace arguments with an absolute path to the input and ouput files
analyseFiles(
  ["/Users/engineering-problem-3/task-two/fixtures/inputs/small-sample.csv"],
  "/Users/engineering-problem-3/task-two/fixtures/outputs/report-analysis.json",
);

exports["default"] = analyseFiles;
