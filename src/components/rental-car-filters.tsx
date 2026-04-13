'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const carTypes = ["Компакт", "Эконом", "Седан", "SUV", "Премиум"];
const transmissionTypes = ["Автомат", "Механика"];
const options = ["Кондиционер", "4+ двери"];


export function RentalCarFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h4 className="font-semibold mb-4">Тип автомобиля</h4>
          <div className="space-y-2">
            {carTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`type-${type}`} />
                <Label htmlFor={`type-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Коробка передач</h4>
          <div className="space-y-2">
            {transmissionTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox id={`transmission-${type}`} />
                <Label htmlFor={`transmission-${type}`} className="cursor-pointer font-normal">{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Опции</h4>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox id={`option-${option}`} />
                <Label htmlFor={`option-${option}`} className="cursor-pointer font-normal">{option}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Цена в день</h4>
          <Slider defaultValue={[4000]} max={10000} step={500} />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>₽1000</span>
            <span>₽10000+</span>
          </div>
        </div>

        <Button className="w-full">Применить фильтры</Button>
      </CardContent>
    </Card>
  );
}
