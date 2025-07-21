import { ChartType, PluginOptionsByType } from 'chart.js';

// Bu dosya, 'chart.js' modülünün orijinal tiplerini genişletmemizi sağlar.
declare module 'chart.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface PluginOptionsByType<TType extends ChartType> {
    // plugins objesinin içinde 'centerText' adında bir alan olabileceğini,
    // ve bu alanın içinde de 'total' adında bir sayı olabileceğini TypeScript'e bildiriyoruz.
    centerText?: {
      total?: number;
    };
  }
}