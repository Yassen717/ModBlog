import { Category } from '@/types/blog'
import { Button } from '@/components/ui/button'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
}

export function CategoryFilter({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Button
        variant={selectedCategory === '' ? 'default' : 'secondary'}
        size="sm"
        onClick={() => onCategorySelect('')}
        className="rounded-full"
      >
        All Categories
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onCategorySelect(category.id)}
          className="rounded-full"
          style={{
            backgroundColor: selectedCategory === category.id ? category.color : undefined,
            borderColor: category.color,
            color: selectedCategory === category.id ? 'white' : category.color,
          }}
        >
          <span 
            className="w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: selectedCategory === category.id ? 'white' : category.color }}
          />
          {category.name}
        </Button>
      ))}
    </div>
  )
}