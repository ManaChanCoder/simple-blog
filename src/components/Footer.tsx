import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa";

import { DARK_LOGO } from "../local_db/localStorage";
import { FOOTER_TITLE, FOOTER_DESCRIPTION } from "../local_db/localStorage";

export default function Footer() {
  return (
    <div
      className={`mt-5 w-full px-5 py-2 flex justify-between items-center bg-white text-black`}
    >
      <img src={DARK_LOGO} alt="logo" className="w-15 h-15" />

      <div className="text-center font-semibold">
        <span className="block">{FOOTER_TITLE}</span>
        <span className="block text-xs">{FOOTER_DESCRIPTION}</span>
      </div>

      <div className="flex gap-4">
        <a
          href="https://www.facebook.comhttps://www.linkedin.com/in/rhogenn-saingga-070b0834a//Rhogenn"
          target="_blank"
        >
          <FaFacebook size={30} className="hover:scale-90 duration-300" />
        </a>
        <a
          href="https://github.com/ManaChanCoder?tab=repositories"
          target="_blank"
        >
          <FaGithub size={30} className="hover:scale-90 duration-300" />
        </a>
        <a
          href="https://www.linkedin.com/in/rhogenn-saingga-070b0834a/"
          target="_blank"
        >
          <FaLinkedin size={30} className="hover:scale-90 duration-300" />
        </a>
      </div>
    </div>
  );
}
