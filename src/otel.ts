import { metrics } from '@opentelemetry/api';
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader
} from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTEL_EXPORTER } from './config';

export function initOTEL(): void {
  const exporter =
    OTEL_EXPORTER === 'prometheus'
      ? new PrometheusExporter({ startServer: true })
      : new ConsoleMetricExporter();
  const reader = new PeriodicExportingMetricReader({
    exporter,
    exportIntervalMillis: 1000
  });
  const provider = new MeterProvider({
    readers: [reader]
  });
  metrics.setGlobalMeterProvider(provider);
  console.log(`OTEL exporter initialized (${OTEL_EXPORTER})`);
}
