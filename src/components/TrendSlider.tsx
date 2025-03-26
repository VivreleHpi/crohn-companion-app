
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  BarChart2, 
  Calendar
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Données fictives pour les tendances
const trendData = [
  {
    id: 1,
    title: "Symptômes en diminution",
    description: "Vos symptômes ont diminué de 30% cette semaine",
    icon: TrendingUp,
    color: "text-health-green",
    bgColor: "bg-health-green/10"
  },
  {
    id: 2,
    title: "Selles - Type 4",
    description: "Type de selles stable ces derniers jours",
    icon: BarChart2,
    color: "text-crohn-500",
    bgColor: "bg-crohn-100"
  },
  {
    id: 3,
    title: "Prochain RDV",
    description: "Gastro-entérologue le 20 juin",
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-100"
  }
];

const TrendSlider = () => {
  return (
    <div className="w-full pt-2 pb-6">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {trendData.map((trend) => (
            <CarouselItem key={trend.id} className="md:basis-1/2 lg:basis-1/3">
              <div className={cn(
                "rounded-xl p-4 flex items-center space-x-3",
                trend.bgColor,
                "border border-gray-100 dark:border-gray-800",
              )}>
                <div className={cn(
                  "rounded-full p-2",
                  "bg-white dark:bg-gray-800",
                  trend.color
                )}>
                  <trend.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm">{trend.title}</h3>
                  <p className="text-xs text-muted-foreground">{trend.description}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-2">
          <CarouselPrevious className="relative static left-0 translate-y-0 mr-2 h-7 w-7" />
          <CarouselNext className="relative static right-0 translate-y-0 h-7 w-7" />
        </div>
      </Carousel>
    </div>
  );
};

export default TrendSlider;
