import { metrics } from '@opentelemetry/api';
import {
  MeterProvider,
  PeriodicExportingMetricReader
} from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';

export function initOTEL(): void {
  const exporter = new PrometheusExporter();
  const reader = new PeriodicExportingMetricReader({
    exporter,
    exportIntervalMillis: 1000
  });
  const provider = new MeterProvider({
    readers: [reader]
  });
  metrics.setGlobalMeterProvider(provider);
  console.log('Prometheus exporter initialized on /metrics');
}
