/**
 * Remotion configuration file for Liquid Glass Promo
 * High-performance rendering configuration with WebGL & Chromium optimization flags
 * @see https://www.remotion.dev/docs/config
 */
import { Config } from '@remotion/cli/config';

// Output format & quality
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');

// Hardware acceleration & OpenGL renderer for Linux/Cloud/GitHub Actions (ANGLE / swiftshader / egl)
Config.setChromiumOpenGlRenderer('angle');
Config.setChromiumMultiProcessOnLinux(true);
Config.setChromiumDisableWebSecurity(true);
Config.setChromiumIgnoreCertificateErrors(true);
Config.setHardwareAcceleration('if-possible');
