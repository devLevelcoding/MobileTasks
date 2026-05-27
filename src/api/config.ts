/**
 * Gateway URL configuration.
 *
 * Android emulator  → 10.0.2.2 maps to host localhost
 * iOS simulator     → localhost works directly
 * Real device       → use your machine's LAN IP, e.g. 192.168.1.100
 *
 * The NestJS gateway runs on port 3100.
 */
export const GATEWAY_URL = 'http://10.0.2.2:3100/api';

// For real device testing, replace with your LAN IP:
// export const GATEWAY_URL = 'http://192.168.1.100:3100/api';
