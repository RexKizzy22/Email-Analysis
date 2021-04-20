"use strict";
/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */
exports.__esModule = true;
var fs_1 = require("fs");
var isValid = function (mail) {
    var re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return re.test(String(mail).toLowerCase());
};
var prepareMails = function (path) {
    var emails = fs_1["default"].readFileSync(path);
    var allMails = JSON.parse(JSON.stringify(emails.toString()));
    var mailArray = allMails.split("\n");
    return mailArray;
};
var categorizeDomain = function (mails) {
    var emailAdds = mails.filter(function (mail) { return mail.includes("@"); });
    var validEmailAdds = emailAdds.filter(function (mail) { return isValid(mail); });
    var domains = validEmailAdds.map(function (mail) { return mail.split("@")[1]; });
    var uniqueDomains = Array.from(new Set(domains));
    var category = {};
    for (var _i = 0, domains_1 = domains; _i < domains_1.length; _i++) {
        var domain = domains_1[_i];
        if (!category.hasOwnProperty(domain)) {
            category[domain] = 1;
        }
        else {
            category[domain]++;
        }
    }
    return {
        "valid-domains": uniqueDomains,
        totalEmailsParsed: emailAdds.length,
        totalValidEmails: validEmailAdds.length,
        categories: category
    };
};
function analyseFiles(inputPaths, outputPath) {
    if (inputPaths) {
        if (inputPaths.length === 1) {
            var categorized = categorizeDomain(prepareMails(inputPaths[0]));
            fs_1["default"].writeFile(outputPath, JSON.stringify(categorized, null, 2), function (err) { return err && console.log(err); });
        }
        else {
            var emailArray = inputPaths.map(function (path) {
                var emailAdds = prepareMails(path);
                return emailAdds;
            });
            var allEmailAdds = emailArray.flat(1);
            var categorized = categorizeDomain(allEmailAdds);
            fs_1["default"].writeFile(outputPath, JSON.stringify(categorized, null, 2), function (err) { return err && console.log(err); });
        }
    }
}
analyseFiles(["/Users/decagon/Desktop/tasks/week-4-node-007-RexKizzy22/task-two/fixtures/inputs/small-sample.csv"], "/Users/decagon/Desktop/tasks/week-4-node-007-RexKizzy22/task-two/fixtures/outputs/report-analysis.json");
exports["default"] = analyseFiles;
