/**
 * Generates a numeric one-time password (OTP).
 *
 * @param {number} length - The length of the OTP (number of digits).
 * @returns {string} The generated numeric OTP.
 */
function OTP(length: number): string {
  let otp = "";
  const possibleChars = "918273645";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * possibleChars.length);
    otp += possibleChars[index];
  }

  return otp;
}
export { OTP };
