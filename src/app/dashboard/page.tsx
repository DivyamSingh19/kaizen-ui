"use client"

import React from "react"
import Link from "next/link"
import { Package, BookText, PenLine, Mail, Users, Plus, BarChart, FileText } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
 
const sections = [
  {
    title: "Blogs",
    description: "Create, manage, and update blog posts for the Haru Memoirs content platform.",
    icon: <Package className="w-5 h-5 text-blue-600" />,
    quickActions: [
      { label: "Add Blog", link: "/dashboard/blogs/new-blog" },
      { label: "All Blogs", link: "/dashboard/blogs/all-blogs" }
    ]
  },
  {
    title: "Journals",
    description: "Manage all journal entries, publish drafts, and track engagement.",
    icon: <BookText className="w-5 h-5 text-green-600" />,
    quickActions: [
      { label: "Add Journal", link: "/dashboard/journals/new-journal" },
      { label: "All Journals", link: "/dashboard/journals/all-journals" }
    ]
  },
  {
    title: "Poems",
    description: "Create and organize poetry content for the platform.",
    icon: <PenLine className="w-5 h-5 text-purple-600" />,
    quickActions: [
      { label: "Add Poem", link: "/dashboard/poems/new-poem" },
      { label: "All Poems", link: "/dashboard/poems/all-poems" }
    ]
  },
  {
    title: "Letters",
    description: "Write letters, manage submissions, and track interactions.",
    icon: <Mail className="w-5 h-5 text-red-600" />,
    quickActions: [
      { label: "Add Letter", link: "/dashboard/letters/new-letter" },
      { label: "All Letters", link: "/dashboard/letters/all-letters" }
    ]
  },
  {
    title: "Newsletters",
    description: "Track subscribers, send newsletters, and view engagement statistics.",
    icon: <Users className="w-5 h-5 text-orange-600" />,
    quickActions: [
      { label: "Total Subscribers", link: "/dashboard/newsletter/subscribers" },
      { label: "Send Newsletter", link: "/dashboard/newsletter/new-broadcast" },
      // { label: "Analytics", link: "/dashboard/newsletter/analytics" }
    ]
  },
]

const DashboardPage = () => {
  return (
    <div className="px-6 py-6 space-y-8">
      {/* Top Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Haru Memoirs Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-base mt-2">
          Manage all content types, newsletters, and platform analytics from one central panel.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card key={section.title} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                {section.icon}
                {section.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>

              <div className="flex flex-col gap-2">
                {section.quickActions.map((action, index) => (
                  <Button
                    key={index}
                    asChild
                    size="sm"
                    variant={index === 0 ? "default" : "outline"}
                    className={index === 0 
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }
                  >
                    <Link href={action.link}>
                      {/* Icons per action */}
                      {index === 0 && <Plus className="w-4 h-4 mr-2" />}
                      {action.label.toLowerCase().includes("subscribers") && <Users className="w-4 h-4 mr-2" />}
                      {action.label.toLowerCase().includes("analytics") && <BarChart className="w-4 h-4 mr-2" />}
                      {action.label.toLowerCase().includes("newsletter") && <Mail className="w-4 h-4 mr-2" />}
                      {action.label.toLowerCase().includes("all") && <FileText className="w-4 h-4 mr-2" />}

                      {action.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-12 p-6 bg-gray-100 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Link href="/dashboard/blogs/add"><Plus className="w-4 h-4 mr-2" />Add Blog</Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Link href="/dashboard/journals/add"><Plus className="w-4 h-4 mr-2" />Add Journal</Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Link href="/dashboard/poems/add"><Plus className="w-4 h-4 mr-2" />Add Poem</Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Link href="/dashboard/letters/add"><Plus className="w-4 h-4 mr-2" />Add Letter</Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Link href="/dashboard/newsletter/send"><Mail className="w-4 h-4 mr-2" />New Broadcast</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
