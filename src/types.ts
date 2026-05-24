/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RSVPEntry {
  id: string;
  name: string;
  guestsCount: number;
  phone: string;
  isAttending: boolean;
  timestamp: string;
  notes?: string;
}

export interface PhotoAsset {
  id: string;
  url: string;
  caption: string;
  category: "famille" | "elegance" | "jeunesse";
}
