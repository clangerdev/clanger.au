import { updateSession } from "@/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "clanger_site_access";

export async function middleware(request: NextRequest) {
  // First, handle site password protection
  const passwordResponse = checkSitePassword(request);
  if (passwordResponse) {
    return passwordResponse;
  }

  // Then, handle Supabase session
  return await updateSession(request);
}

function checkSitePassword(request: NextRequest): NextResponse | null {
  const expectedPassword = process.env.SITE_PASSWORD;
  const { pathname, searchParams } = request.nextUrl;
  const cookies = request.cookies;

  // If no password is configured, don't block anything
  if (!expectedPassword) {
    return null;
  }

  // If cookie is already set and matches expected password, allow access
  const accessCookie = cookies.get(ACCESS_COOKIE)?.value;
  if (accessCookie === expectedPassword) {
    return null;
  }

  // Check for password in query (simple prompt page will submit here)
  const passwordAttempt = searchParams.get("site_password");
  if (passwordAttempt === expectedPassword) {
    const response = NextResponse.redirect(new URL(pathname, request.url));
    // Set a long-lived cookie so user isn't asked again
    response.cookies.set(ACCESS_COOKIE, expectedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return response;
  }

  // If password not provided or incorrect, show a basic password form
  const url = request.nextUrl.clone();
  url.searchParams.delete("site_password");

  return new NextResponse(
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Clanger</title>
    <style>
      :root {
        /* Match your dark theme tokens from globals.css / Tailwind config */
        --background: hsl(220 18% 11%);
        --foreground: hsl(216 18% 97%);
        --card: hsl(220 12% 16%);
        --card-foreground: hsl(216 18% 97%);
        --border: hsl(220 12% 20%);
        --primary: hsl(24 100% 50%);
        --secondary: hsl(82 100% 54%);
        --muted-foreground: hsl(218 7% 58%);
        --destructive: hsl(0 84% 60%);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
          sans-serif;
        background: radial-gradient(circle at top, #020617, #020617),
          var(--background);
        color: var(--foreground);
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
      }

      .card {
        background: var(--card);
        border-radius: 0.75rem;
        padding: 2rem 2.5rem;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.75);
        border: 1px solid var(--border);
        max-width: 360px;
        width: 100%;
      }

      h1 {
        font-size: 1.5rem;
        margin-bottom: 0.6rem;
        letter-spacing: -0.03em;
      }

      p {
        font-size: 0.9rem;
        color: var(--muted-foreground);
        margin-bottom: 1.6rem;
      }

      label {
        display: block;
        font-size: 0.85rem;
        margin-bottom: 0.35rem;
      }

      input[type="password"] {
        width: 100%;
        padding: 0.65rem 0.75rem;
        border-radius: 0.6rem;
        border: 1px solid var(--border);
        background: #020617;
        color: var(--foreground);
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease,
          background-color 0.15s ease;
      }

      input[type="password"]:focus {
        border-color: var(--primary);
        box-shadow: 0 0 0 1px var(--primary);
        background-color: #020617;
      }

      button {
        margin-top: 1rem;
        width: 100%;
        padding: 0.7rem 0.75rem;
        border-radius: 9999px;
        border: none;
        background: linear-gradient(
          to right,
          var(--primary),
          var(--secondary)
        );
        color: #020617;
        font-weight: 600;
        cursor: pointer;
        font-size: 0.95rem;
        transition: transform 0.15s ease, box-shadow 0.15s ease,
          filter 0.15s ease;
        box-shadow: 0 0 35px hsl(24 100% 50% / 0.35);
      }

      button:hover {
        filter: brightness(1.05);
        transform: translateY(-1px);
        box-shadow: 0 0 40px hsl(82 100% 54% / 0.45);
      }

      .error {
        margin-top: 0.75rem;
        font-size: 0.8rem;
        color: var(--destructive);
      }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>Clanger</h1>
      <p>Enter the access password to continue.</p>
      <form method="GET" action="${url.pathname}">
        <label for="site_password">Password</label>
        <input
          id="site_password"
          name="site_password"
          type="password"
          autocomplete="off"
          required
          autofocus
        />
        <button type="submit">Unlock</button>
        ${
          passwordAttempt && passwordAttempt !== expectedPassword
            ? '<div class="error">Incorrect password. Please try again.</div>'
            : ""
        }
      </form>
    </main>
  </body>
</html>`,
    {
      status: 401,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
