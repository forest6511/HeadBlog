'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText, FolderTree, Users } from 'lucide-react'
import { ROUTES } from '@/config/routes'

const menuItems = [
  {
    title: 'コンテンツ',
    submenu: [
      {
        title: '記事投稿',
        href: ROUTES.ADMIN.DASHBOARD.POSTS.BASE,
        icon: FileText,
      },
      {
        title: 'カテゴリ',
        href: ROUTES.ADMIN.DASHBOARD.CATEGORIES.BASE,
        icon: FolderTree,
      },
    ],
  },
  {
    title: '権限管理',
    submenu: [
      { title: 'ユーザー', href: '/admin/dashboard/users', icon: Users },
    ],
  },
]

export default function AdminDashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r">
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-3 px-3">
              {item.title}
            </h2>
            <ul>
              {item.submenu.map((subItem, subIndex) => {
                const Icon = subItem.icon
                return (
                  <li key={subIndex} className="mb-1">
                    <Link
                      href={subItem.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                        pathname === subItem.href
                          ? 'bg-[#6366F1] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
