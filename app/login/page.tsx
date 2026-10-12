import LoginShell from "../components/LoginShell";

// Redirects away when a session exists, which blocks the segment,
// so opt out of instant validation for navigations into /login.
export const instant = false;

export default function LoginPage() {
  return <LoginShell />;
}
