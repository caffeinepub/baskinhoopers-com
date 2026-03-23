import { Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl font-black tracking-tight text-gold">
              🏀 BASKIN HOOPERS
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Premium hand-crafted basketball trading cards for serious
              collectors. Every card tells a story.
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              Contact:{" "}
              <a
                href="mailto:info@baskethoopers.com"
                className="text-gold hover:underline"
              >
                info@baskethoopers.com
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 font-display text-xs font-black uppercase tracking-widest text-foreground/60">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              {["All Cards", "Legendary", "Epic", "Rare", "Common"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="/"
                      className="text-muted-foreground transition-colors hover:text-gold"
                    >
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 font-display text-xs font-black uppercase tracking-widest text-foreground/60">
              Info
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About Us", href: "/#about" },
                {
                  label: "Custom Cards",
                  href: "mailto:info@baskethoopers.com",
                },
                { label: "FAQ", href: "/#faq" },
                { label: "Shipping", href: "/#shipping" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-gold"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <span>© {year} Baskin Hoopers. All rights reserved.</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            Built with <Heart className="h-3 w-3 fill-gold text-gold" /> using
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
