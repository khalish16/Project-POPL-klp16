import { NutritionCalculator, NutritionInput } from '@/lib/calculators/NutritionCalculator';
export class NutritionFacade { calculate(input:NutritionInput){ return new NutritionCalculator(input).calculate(); } }
