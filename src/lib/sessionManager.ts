import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

const ENV_FILE_PATH = join(process.cwd(), '.env.local');

interface SessionConfig {
  secret: string;
  lastRotated: number;
  rotationInterval: number; // in milliseconds
}

class SessionManager {
  private config: SessionConfig;
  private rotationTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.config = {
      secret: this.generateSecret(),
      lastRotated: Date.now(),
      rotationInterval: 15 * 60 * 1000 // 15 minutes
    };
    
    this.initializeRotation();
  }

  private generateSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  private updateEnvFile(newSecret: string): void {
    try {
      // Only update process.env for now to avoid file system issues during development
      process.env.SESSION_SECRET = newSecret;
      console.log(`🔄 Session secret rotated at ${new Date().toISOString()}`);
      
      // In production, you might want to update the .env.local file
      // For development, we'll just update the runtime environment
    } catch (error) {
      console.error('❌ Failed to update session secret:', error);
    }
  }

  private rotateSecret(): void {
    const newSecret = this.generateSecret();
    this.config.secret = newSecret;
    this.config.lastRotated = Date.now();
    
    // Update the .env.local file
    this.updateEnvFile(newSecret);
    
    // Update process.env for immediate effect
    process.env.SESSION_SECRET = newSecret;
    
    console.log('🔐 All admin sessions invalidated - users must re-login');
  }

  private initializeRotation(): void {
    // Clear any existing timer
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }

    // Set up rotation timer
    this.rotationTimer = setInterval(() => {
      this.rotateSecret();
    }, this.config.rotationInterval);

    console.log(`🕐 Session secret rotation enabled: every ${this.config.rotationInterval / 60000} minutes`);
  }

  public getCurrentSecret(): string {
    return this.config.secret;
  }

  public getTimeUntilNextRotation(): number {
    const elapsed = Date.now() - this.config.lastRotated;
    return Math.max(0, this.config.rotationInterval - elapsed);
  }

  public getRotationInfo() {
    const timeUntilNext = this.getTimeUntilNextRotation();
    const minutesUntilNext = Math.floor(timeUntilNext / 60000);
    const secondsUntilNext = Math.floor((timeUntilNext % 60000) / 1000);
    
    return {
      lastRotated: new Date(this.config.lastRotated).toISOString(),
      nextRotationIn: `${minutesUntilNext}m ${secondsUntilNext}s`,
      rotationIntervalMinutes: this.config.rotationInterval / 60000
    };
  }

  public forceRotation(): void {
    console.log('🔄 Manual session secret rotation triggered');
    this.rotateSecret();
  }

  public destroy(): void {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

// Initialize rotation on server start
if (typeof window === 'undefined') {
  // Server-side only
  console.log('🚀 Session Manager initialized');
}

export default sessionManager;