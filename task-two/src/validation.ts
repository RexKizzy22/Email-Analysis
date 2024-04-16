/**
 * Stretch goal - Validate all the emails in this files and output the report
 *
 * @param {string[]} inputPath An array of csv files to read
 * @param {string} outputFile The path where to output the report
 */

import dns from "dns";
import fs from "fs";

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

const validator = (mails: string[], outputFile: string) => {
  const emailAdds = mails.filter((mail) => mail.includes("@"));
  const validEmailAdds = emailAdds.filter((mail) => isValid(mail));

  validEmailAdds.forEach((mail) => {
    const domain = mail.split("@")[1];

    dns.resolve(domain, "MX", (err, address) => {
      if (err) {
        console.log("Error occured: ", err);
      } else if (address && address.length > 0) {
        fs.appendFile(
          outputFile,
          `${JSON.stringify(mail)}\n`,
          (err) => err && console.log(err),
        );
      }
    });
  });
};

function validateEmailAddresses(inputPath: string[], outputFile: string) {
  if (inputPath && outputFile) {
    validator(prepareMails(inputPath[0]), outputFile);
  }
}

export default validateEmailAddresses;
