export interface DashboardStatisticsModel {
  id: string
  name: string
  years: Year[];
  colors: string[];
  fact: number[];
  plan: number[];
  years_number: number[];
  title: string;
  curve: 'smooth' | 'straight' | 'stepline' | 'monotoneCubic',
  postfix: string
  reversed: boolean
}

export interface Year {
  year: number
  plan?: number
  fact: any
}
