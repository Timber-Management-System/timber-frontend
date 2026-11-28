
import type { Trip } from '../types/log-receiving.types';
import { initialTrips, logs } from './mockReceivingData';


// ==================================================
// FR-24 — Log Receiving API
// ==================================================


// ---------- Configuration ----------

// Backend contract pending; mock mode is the only implemented mode.
const USE_MOCK = true;

const KEY = 'fr24-receiving-demo-v1';


// ---------- Retrieve All Trips ----------

export function getTrips(): Trip[] {
  if (!USE_MOCK) {
    throw new Error(
      'Receiving API contract is not available yet.'
    );
  }

  if (typeof window === 'undefined') {
    return initialTrips;
  }

  try {
    const saved = JSON.parse(
      window.localStorage.getItem(KEY) || 'null'
    );

    return Array.isArray(saved)
      ? saved
      : initialTrips;

  } catch {
    return initialTrips;
  }
}


// ---------- Retrieve a Specific Trip ----------

export function getTrip(id: string) {
  return getTrips().find(
    (t) => t.id === id
  );
}


// ---------- Save Updated Trip ----------

export function saveTrip(updated: Trip) {
  const trips = getTrips().map(
    (t) => t.id === updated.id ? updated : t
  );

  window.localStorage.setItem(
    KEY,
    JSON.stringify(trips)
  );

  return updated;
}


// ---------- Verify Incoming Log ----------

export function verifyLog(trip: Trip, rawId: string) {
  const id = rawId.trim().toUpperCase();


  // Check whether a Log ID was entered.

  if (!id) {
    return {
      error: 'Enter a Log ID.',
    };
  }


  // Check whether the log exists.

  if (!logs[id]) {
    return {
      error: `Log ${id} was not found.`,
    };
  }


  // Check whether the log belongs to the selected trip.

  if (logs[id].tripId !== trip.id) {
    return {
      error: `Log ${id} belongs to ${logs[id].tripId}, not ${trip.id}.`,
    };
  }


  // Prevent duplicate log receiving.

  if (trip.received.includes(id)) {
    return {
      error: `Log ${id} has already been received.`,
    };
  }


  // Check whether the log was previously rejected.

  if (trip.rejected.includes(id)) {
    return {
      error: `Log ${id} was rejected in this receipt.`,
    };
  }


  // Return the successfully verified log.

  return {
    log: logs[id],
  };
}


// ---------- Reset Demo Data ----------

export function resetDemo() {
  window.localStorage.removeItem(KEY);
}
