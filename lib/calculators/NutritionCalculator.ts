export type Gender = 'PRIA' | 'WANITA';
export type Goal = 'CUTTING' | 'MAINTAIN' | 'BULKING';
export type Activity = 'SANGAT_RENDAH' | 'RINGAN' | 'SEDANG' | 'TINGGI' | 'SANGAT_TINGGI';
export interface NutritionInput { age:number; gender:Gender; height:number; weight:number; activityLevel:Activity; goal:Goal; }
export class NutritionCalculator {
  private input: NutritionInput;
  private activityMultipliers: Record<Activity, number> = { SANGAT_RENDAH:1.2, RINGAN:1.375, SEDANG:1.55, TINGGI:1.725, SANGAT_TINGGI:1.9 };
  constructor(input:NutritionInput){ this.input=input; }
  bmi(){ return this.input.weight / ((this.input.height/100)**2); }
  bmiCategory(){ const v=this.bmi(); if(v<18.5)return 'Kurus'; if(v<25)return 'Normal'; if(v<30)return 'Overweight'; return 'Obesitas'; }
  bmiDescription(){ return {Kurus:'Berat badan di bawah rentang normal.',Normal:'Berat badan berada pada rentang normal.',Overweight:'Berat badan berada di atas rentang normal.',Obesitas:'Berat badan berada pada kategori obesitas.'}[this.bmiCategory()]; }
  bmr(){ const {weight,height,age,gender}=this.input; return gender==='PRIA' ? 10*weight+6.25*height-5*age+5 : 10*weight+6.25*height-5*age-161; }
  tdee(){ return this.bmr()*this.activityMultipliers[this.input.activityLevel]; }
  calorieTarget(){ const t=this.tdee(); return this.input.goal==='CUTTING'?t-400:this.input.goal==='BULKING'?t+300:t; }
  protein(){ const multiplier=this.input.goal==='CUTTING'?2.2:this.input.goal==='BULKING'?2:1.8; return this.input.weight*multiplier; }
  macros(){ const protein=this.protein(); const calories=this.calorieTarget(); const proteinCal=protein*4; const fatCal=calories*0.25; return {protein, fat:fatCal/9, carbs:Math.max(0,(calories-proteinCal-fatCal)/4)}; }
  water(){ return this.input.weight*0.035; }
  calculate(){ const bmi=this.bmi(); return { bmi, category:this.bmiCategory(), description:this.bmiDescription(), bmr:this.bmr(), tdee:this.tdee(), calories:this.calorieTarget(), protein:this.protein(), macros:this.macros(), water:this.water() }; }
}
