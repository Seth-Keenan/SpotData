import { cookies } from "next/headers";
import Navbar from "./Navbar";

export default async function NavbarWrapper() {
  const token = (await cookies()).get("spotify_access_token")?.value;
  return <Navbar token={!!token} />;
}
