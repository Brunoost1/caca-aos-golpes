import { storage } from "../game/storage.js";

const KEY = "metrics";
const initial = {
  sessions: 0,
  answered: 0,
  correct: 0,
  wrong: 0,
  perChannel: { sms:0, email:0, whatsapp:0, push:0, ligacao:0 },
  startedAt: null,
  totalMs: 0
};

export const metrics = {
  _m: null,
  start() {
    this._m = storage.get(KEY, initial);
    this._m.sessions += 1;
    this._m.startedAt = Date.now();
    storage.set(KEY, this._m);
  },
  markAnswer(card, correct, ms=0) {
    const m = this._m || storage.get(KEY, initial);
    m.answered += 1;
    if (correct) m.correct += 1; else m.wrong += 1;
    if (m.perChannel[card.channel] != null) m.perChannel[card.channel] += 1;
    m.totalMs += ms;
    storage.set(KEY, m);
  },
  snapshot() {
    return storage.get(KEY, initial);
  },
  reset() { storage.set(KEY, initial); }
};