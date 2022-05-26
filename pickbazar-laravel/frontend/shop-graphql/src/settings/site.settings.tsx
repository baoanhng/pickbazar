import { FacebookIcon } from "@components/icons/facebook";
import { InstagramIcon } from "@components/icons/instagram";
import { TwitterIcon } from "@components/icons/twitter";
import { YouTubeIcon } from "@components/icons/youtube";
import { ROUTES } from "@utils/routes";
export const siteSettings = {
  name: "PickBazar",
  description: "",
  logo: {
    url: "/logo.svg",
    alt: "PickBazar",
    href: "/grocery",
    width: 128,
    height: 40,
  },
  defaultLanguage: "en",
  currencyCode: "USD",
  product: {
    placeholderImage: "/product-placeholder.svg",
    cardMaps: {
      grocery: "Krypton",
      furniture: "Radon",
      bag: "Oganesson",
      makeup: "Neon",
      book: "Xenon",
      medicine: "Helium",
      default: "Argon",
    },
  },
  author: {
    name: "RedQ, Inc.",
    websiteUrl: "https://redq.io",
    address: "115 E 9th St, New York, CA 90079,USA",
    phone: "+971-321-4841-78",
    social: [
      {
        link: "https://www.facebook.com",
        icon: <FacebookIcon width="16px" height="16px" />,
        hoverClass: "text-social-facebook",
      },
      {
        link: "https://www.instagram.com",
        icon: <InstagramIcon width="16px" height="16px" />,
        hoverClass: "text-social-instagram",
      },
      {
        link: "https://www.twitter.com",
        icon: <TwitterIcon width="16px" height="16px" />,
        hoverClass: "text-social-twitter",
      },
      {
        link: "https://www.youtube.com",
        icon: <YouTubeIcon width="16px" height="16px" />,
        hoverClass: "text-social-youtube",
      },
    ],
  },
  headerLinks: [
    { href: ROUTES.SHOPS, icon: null, label: "nav-menu-shops" },
    { href: ROUTES.OFFERS, icon: null, label: "nav-menu-offer" },
    { href: ROUTES.HELP, label: "nav-menu-faq" },
    { href: ROUTES.CONTACT, label: "nav-menu-contact" },
  ],
  authorizedLinks: [
    { href: ROUTES.PROFILE, label: "auth-menu-profile" },
    { href: ROUTES.CHECKOUT, label: "auth-menu-checkout" },
    { href: ROUTES.ORDERS, label: "auth-menu-my-orders" },
    { href: ROUTES.LOGOUT, label: "auth-menu-logout" },
  ],
  dashboardSidebarMenu: [
    {
      href: ROUTES.PROFILE,
      menulabel: "profile-sidebar-profile",
    },
    {
      href: ROUTES.CHANGE_PASSWORD,
      menulabel: "profile-sidebar-password",
    },
    {
      href: ROUTES.ORDERS,
      menulabel: "profile-sidebar-orders",
    },
    {
      href: ROUTES.HELP,
      menulabel: "profile-sidebar-help",
    },
    {
      href: ROUTES.LOGOUT,
      menulabel: "profile-sidebar-logout",
    },
  ],
};
