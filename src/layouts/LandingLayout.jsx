import LandingNavbar from "../pages/landing/LandingNavbar";

export default function LandingLayout({ children }) {
  return (
    <>
      <LandingNavbar />
      {children}
    </>
  );
}