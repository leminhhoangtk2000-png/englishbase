import { ReactNode } from "react"
import { MainNav } from "@/components/main-nav"
import { Footer } from "@/components/footer"
import { getNavigationStructure } from "@/lib/markdown"
import { b1niveauConfig } from "@/config/b1niveau"

interface LayoutProps {
  children: ReactNode
}

export default async function B1NiveauLayout({ children }: LayoutProps) {
  // Try to get navigation from markdown files, fallback to config
  let navigation = []
  try {
    navigation = await getNavigationStructure('b1niveau')
  } catch (error) {
    console.log('Using fallback navigation for b1niveau')
    navigation = b1niveauConfig.sidebarNav || []
  }

  const allDocs = navigation.flatMap(section => 
    section.items?.map(item => ({
      title: item.title,
      href: item.href
    })) || []
  )

  return (
    <div className="border-b">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
          <div className="h-full py-6 pr-6 lg:py-8">
            <nav className="w-full">
              {navigation.map((section, index) => (
                <div key={index} className="pb-4">
                  <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
                    {section.title}
                  </h4>
                  {section.items && (
                    <div className="grid grid-flow-row auto-rows-max text-sm">
                      {section.items.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.href}
                          className="group flex w-full items-center rounded-md border border-transparent px-2 py-1 text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {item.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
