import { readFile } from "fs/promises";
import { join } from "path";

/**
 * Email template placeholders that should be replaced
 */
export type EmailTemplateVariables = {
  VERIFY_URL?: string;
  RESET_URL?: string;
  [key: string]: string | undefined;
};

/**
 * Replaces placeholders in email templates with actual values
 */
export function replaceTemplateVariables(
  template: string,
  variables: EmailTemplateVariables
): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    if (value) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
      result = result.replace(regex, value);
    }
  }
  return result;
}

/**
 * Loads and processes the verify email template
 */
export async function getVerifyEmailTemplate(
  verifyUrl: string
): Promise<string> {
  const templatePath = join(process.cwd(), "lib/templates/verify-email.html");
  const template = await readFile(templatePath, "utf-8");
  return replaceTemplateVariables(template, { VERIFY_URL: verifyUrl });
}

/**
 * Loads and processes the reset password email template
 */
export async function getResetPasswordEmailTemplate(
  resetUrl: string
): Promise<string> {
  const templatePath = join(
    process.cwd(),
    "lib/templates/reset-password-email.html"
  );
  const template = await readFile(templatePath, "utf-8");
  return replaceTemplateVariables(template, { RESET_URL: resetUrl });
}


