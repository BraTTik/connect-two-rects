import { Evented } from "./Evented";

export class EventListeners<T extends Record<string, unknown>>
  implements Evented<T>
{
  private listeners: Map<keyof T, Set<Function>> = new Map();

  on<Type extends keyof T>(type: Type, callback: (event: T[Type]) => void) {
    if (!this.listeners.has(type)) this.createType(type);
    const set = this.listeners.get(type)!;
    set.add(callback);
  }

  off<Type extends keyof T>(type: Type, callback: (event: T[Type]) => void) {
    if (this.listeners.has(type)) {
      const set = this.listeners.get(type)!;
      set.delete(callback);
    }
  }

  notify(type: keyof T, event: T[keyof T]) {
    if (this.listeners.has(type)) {
      const set = this.listeners.get(type)!;
      set.forEach((callback) => callback(event));
    }
  }

  hasListeners(type: keyof T) {
    return this.listeners.has(type) && this.listeners.get(type)!.size > 0;
  }

  destroy() {
    this.listeners = new Map();
  }

  private createType = (type: keyof T) => {
    this.listeners.set(type, new Set());
  };
}
