import { type UnknowFunction } from '@syseven/utils';

type Task = UnknowFunction;

export class Concurrent {
  private _counter: number = 0;
  private _queue: Array<Task> = [];
  private _limit: number = 3;
  result: unknown[] = [];
  constructor(tasks: Array<Task>, limit?: number) {
    this._queue = tasks;
    if (typeof limit === 'number' && limit > 0) {
      this._limit = limit;
    } else if (typeof limit !== 'undefined') {
      throw TypeError('limit must be a number greater than 0');
    }
  }

  start(tasks: Array<Task>) {
    for (let i = 0; i < this._limit; i++) {
      if (!tasks[i]) {
        break;
      }
      this._run(tasks[i]);
    }
  }

  async _run(task: Task) {
    const res = await task();
    this.result.push(res);
    this._counter++;
    if (this._queue.length > this._counter) {
      this._run(this._queue[this._counter]);
    }
  }
}
