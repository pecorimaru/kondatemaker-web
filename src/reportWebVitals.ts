import { Metric } from 'web-vitals';  // Metricをインポート

export function reportWebVitals(onPerfEntry: (metric: Metric) => void): void {  // 型をMetricに変更
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}