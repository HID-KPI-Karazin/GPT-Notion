import { metrics } from '@opentelemetry/api';
import {
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader
} from '@opentelemetry/sdk-metrics';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { OTEL_EXPORTER, OTEL_PROM_HOST, OTEL_PROM_PORT } from './config';

export function initOTEL(): void {
  if (OTEL_EXPORTER === 'prometheus') {
    const exporter = new PrometheusExporter(
      {
        preventServerStart: process.env.NODE_ENV === 'test',
        port: OTEL_PROM_PORT,
        host: OTEL_PROM_HOST
      },
      () => {
        console.log('Prometheus metrics exporter started');
      }
    );
    const provider = new MeterProvider({ readers: [exporter] });
    metrics.setGlobalMeterProvider(provider);
  } else {
    const exporter = new ConsoleMetricExporter();
    const reader = new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 1000
    });
    const provider = new MeterProvider({ readers: [reader] });
    metrics.setGlobalMeterProvider(provider);
    console.log('OTEL exporter initialized (stdout)');
  }
}
