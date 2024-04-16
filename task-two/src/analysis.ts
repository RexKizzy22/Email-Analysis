/**
 * First task - Read the csv files in the inputPath and analyse them
 *
 * @param {string[]} inputPaths An array of csv files to read
 * @param {string} outputPath The path to output the analysis
 */

import fs from "fs";

interface EmailAnalysis {
  "valid-domains": string[];
  totalEmailsParsed: number;
  totalValidEmails: number;
  categories: Record<string, number>;
}

const isValid = (mail: string): boolean => {
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return re.test(String(mail).toLowerCase());
};

const prepareMails = (path: string): string[] => {
  const emails = fs.readFileSync(path);
  const allMails = JSON.parse(JSON.stringify(emails.toString()));
  const mailArray = allMails.split("\n");
  return mailArray;
};

const categorize = (mails: string[]): EmailAnalysis => {
  const emailAdds = mails.filter((mail) => mail.includes("@"));
  const validEmailAdds = emailAdds.filter((mail) => isValid(mail));
  const domains = validEmailAdds.map((mail: string) => mail.split("@")[1]);
  const uniqueDomains = Array.from(new Set(domains));
  const category: Record<string, number> = {};

  for (const domain of domains) {
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

function analyseFiles(inputPaths: string[], outputPath: string) {
  if (inputPaths && outputPath) {
    if (inputPaths.length === 1) {
      const categorized = categorize(prepareMails(inputPaths[0]));

      fs.writeFile(
        outputPath,
        JSON.stringify(categorized, null, 2),
        (err: Error | null) => err && console.log(err),
      );
    } else {
      const emailArray = inputPaths.map((path) => {
        const emailAdds = prepareMails(path);
        return emailAdds;
      });

      const allEmailAdds: string[] = emailArray.flat();
      const categorized = categorize(allEmailAdds);

      fs.writeFile(
        outputPath,
        JSON.stringify(categorized, null, 2),
        (err: Error | null) => err && console.log(err),
      );
    }
  }
}

export default analyseFiles;
