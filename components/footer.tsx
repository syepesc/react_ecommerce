import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t">
      <p className="p-5 flex-center">
        {currentYear} {APP_NAME}. All rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
