
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Filters {
  category: string;
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, onClose }) => {
  const categories = ['Electronics', 'Accessories', 'Clothing', 'Home & Garden'];

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
  };

  return (
    <div className="w-80 border-r border-gray-200 bg-white/80 backdrop-blur-md p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="minPrice" className="text-sm font-medium">
                Min Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="$0"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-sm font-medium">
                Max Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="$999"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="inStock" className="text-sm font-medium">
              In Stock Only
            </Label>
            <Switch
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => setFilters(prev => ({ ...prev, inStock: checked }))}
            />
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
