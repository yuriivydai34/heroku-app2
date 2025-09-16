export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI CRM",
  description: "CRM application built with Next.js and HeroUI.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Tasks",
      href: "/tasks",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Tasks",
      href: "/tasks",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
