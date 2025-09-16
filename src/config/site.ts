export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI CRM",
  description: "CRM application built with Next.js and HeroUI.",
  navigationItems: [
    { name: "Dashboard", icon: "lucide:layout-dashboard", href: "/dashboard" },
    { name: "Analytics", icon: "lucide:bar-chart", href: "/analytics" },
    { name: "Tasks", icon: "lucide:check-square", href: "/tasks" },
    { name: "Customers", icon: "lucide:users", href: "/customers" },
    { name: "Orders", icon: "lucide:shopping-cart", href: "/orders" },
    { name: "Settings", icon: "lucide:settings", href: "/settings" },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
