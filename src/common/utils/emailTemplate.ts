import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

export const signUpEmailTemplateHTML = async ({
  email,
  link,
  otp,
}: {
  email: string;
  link?: string;
  otp?: string;
}) => {
  const templateFileName = link ? "signUpTemplate.html" : "otpTemplate.html";
  const filePath = path.join(
    __dirname,
    "..", // Adjust according to the actual path
    "..",
    "..",
    "src/common/utils/emailTemplates",
    templateFileName
  );

  return new Promise((res, rej) => {
    fs.readFile(filePath, "utf8", (err, htmlContent) => {
      if (err) {
        console.error("Error reading file:", err);
        return rej("Error reading file");
      }

      // Load the HTML content into cheerio
      const $ = cheerio.load(htmlContent);

      // Replace the placeholders with actual values
      if (link) {
        $('a[href="{{link}}"]').attr("href", link);
        $("body").html(
          $("body")
            .html()
            .replace(/{{email}}/g, email)
        );
      } else if (otp) {
        $("p.otp-code").text(otp);
        $("body").html(
          $("body")
            .html()
            .replace(/{{email}}/g, email)
        );
      }

      // Get the updated HTML content
      const updatedHtmlContent = $.html();

      res(updatedHtmlContent);
    });
  });
};
