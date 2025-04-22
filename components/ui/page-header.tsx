interface PageHeaderProps {
  title: string
  description: string
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-[#8b95a7] text-sm">{description}</p>
    </div>
  )
}
