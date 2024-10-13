export type EventHandler<T> = (event: T) => void;

export interface Evented<Events extends Record<string, unknown> = {}> {
  on: <Type extends keyof Events>(type: Type, callback: EventHandler<Events[Type]>) => void;
  off: <Type extends keyof Events>(type: Type, callback: EventHandler<Events[Type]>) => void;
  notify: (type: keyof Events, event: Events[keyof Events]) => void;
}
