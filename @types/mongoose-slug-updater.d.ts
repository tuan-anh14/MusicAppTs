declare module 'mongoose-slug-updater' {
    import { Schema } from 'mongoose';
  
    export function plugin(schema: Schema, options?: any): void;
  }