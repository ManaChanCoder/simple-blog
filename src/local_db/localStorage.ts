import LogoLightMode from "../assets/logo-light-mode.png";
import LogoDarkMode from "../assets/logo-dark-mode.png";
// import {
//   FaGithub,
//   FaFacebook,
//   FaLinkedin,
//   FaLongArrowAltRight,
//   FaBloggerB,
// } from "react-icons/fa";

// import {
//   IoCloseOutline,
//   IoMenuOutline,
//   IoMoonSharp,
//   IoSunnyOutline,
//   IoLogOut,
//   IoHome,
// } from "react-icons/io5";

// import { CiViewTimeline } from "react-icons/ci";

import type { NavLinkState } from "../interface";

// already login
export const ESC_BTN: string = "ESC";
export const LoginNavLink: NavLinkState[] = [
  { title: "Home", location: "/" },
  { title: "Post" },
  { title: "Your Post", location: "/view-post" },
  { title: "Logout", location: "/" },
];

export const ACCOUNT_GREET: string = "Welcome";
export const DASHBOARD_DESCRIPTION: string =
  "Genns Blog is a simple space for sharing thoughts, ideas, and experiences about coding, life, and everyday learning journeys.";
export const POST_COUNT: string = "your post";

// logout
export const navLink: NavLinkState[] = [
  { title: "Home", location: "/" },
  { title: "View Post", location: "/view-post" },
  { title: "Login/Sign up" },
];

export const WELCOME_BANNER: string = "Welcome";
export const WELCOME_BANNER_DESCRIPTION: string =
  "Genns Blog is a simple space for sharing thoughts, ideas, and experiences about coding, life, and everyday learning journeys.";
export const BANNER_TEXT: string = "Total Post:";

// global
export const LIGHT_LOGO: string = LogoLightMode;
export const DARK_LOGO: string = LogoDarkMode;

export const BANNER_TITLE: string = "Genn's Blog";
export const BANNER_DESCRIPTION: string = "A simple and stylish blog theme";
export const BANNER_CARD_TITLE: string = "Post what’s in your mind";
export const BANNER_CARD_DESCRIPTION: string =
  "Coding dreams into reality, learning every day, embracing challenges, and building a better future one line of code at a time.";
export const BANNER_BUTTON_TEXT: string = "Post";

export const CARD_BUTTON_TEXT: string = "more post";

export const FOOTER_TITLE: string = "Manachan";
export const FOOTER_DESCRIPTION: string = "Design & Develop";
