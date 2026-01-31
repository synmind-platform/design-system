import * as React from "react"

import { cn } from "@/lib/utils"
import { SynMindLogo, MindScanBadge, BrandDotsGroup } from "@/components/brand"

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "default" | "b2b" | "b2c" | "minimal"
  sections?: FooterSection[]
  showMindScanBadge?: boolean
  showBrandDots?: boolean
  copyright?: string
  socialLinks?: React.ReactNode
}

function Footer({
  className,
  variant = "default",
  sections = [],
  showMindScanBadge = true,
  showBrandDots = true,
  copyright,
  socialLinks,
  children,
  ...props
}: FooterProps) {
  const currentYear = new Date().getFullYear()
  const defaultCopyright = `© ${currentYear} SynMind. Todos os direitos reservados.`

  if (variant === "minimal") {
    return (
      <footer
        data-slot="footer"
        className={cn(
          "border-t bg-background py-6",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <SynMindLogo variant="symbol" size="sm" />
          <p className="text-sm text-muted-foreground">
            {copyright || defaultCopyright}
          </p>
          {showMindScanBadge && <MindScanBadge variant="inline" />}
        </div>
      </footer>
    )
  }

  return (
    <footer
      data-slot="footer"
      className={cn(
        "border-t bg-muted/30",
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <SynMindLogo
              variant="full"
              size="sm"
              className="mb-4"
            />
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              {variant === "b2c"
                ? "Transformando autoconhecimento em ação."
                : "Inteligência de Negócios através de Pessoas."
              }
            </p>
            {showBrandDots && <BrandDotsGroup size="sm" gap="tight" />}
          </div>

          {/* Link Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={cn(
                        "text-sm text-muted-foreground transition-colors",
                        variant === "b2c"
                          ? "hover:text-[#D98D38]"
                          : "hover:text-[#5B7B93]"
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {children}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {copyright || defaultCopyright}
          </p>

          <div className="flex items-center gap-6">
            {socialLinks}
            {showMindScanBadge && <MindScanBadge variant="compact" colorScheme="blue" />}
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export type { FooterProps, FooterSection, FooterLink }
