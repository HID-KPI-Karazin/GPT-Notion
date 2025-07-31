import { metrics } from '@opentelemetry/api';
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader
} from '@opentelemetry/sdk-metrics';

export function initOTEL(): void {
  const exporter = new ConsoleMetricExporter();
  const reader = new PeriodicExportingMetricReader({
    exporter,
    exportIntervalMillis: 1000
  });
  const provider = new MeterProvider({
    readers: [reader]
  });
  metrics.setGlobalMeterProvider(provider);
  console.log('OTEL exporter initialized (stdout)');
}
