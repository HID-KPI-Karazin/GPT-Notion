import { metrics } from '@opentelemetry/api';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export function initOTEL(): void {
  const exporter = new PrometheusExporter(
    { preventServerStart: process.env.NODE_ENV === 'test' },
    () => {
      console.log('Prometheus metrics exporter started');
    }
  );
  const provider = new MeterProvider({ readers: [exporter] });
  metrics.setGlobalMeterProvider(provider);
}
