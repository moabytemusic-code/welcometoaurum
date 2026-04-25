'use client';

import PitchAngle from './angles/PitchAngle';

// This registry maps "Angle IDs" to their corresponding React components
// When you add a new angle in the future, you just add it here.
const AngleRegistry = {
  'pitch': PitchAngle,
  'direct': PitchAngle, // Placeholder for same layout, different copy
  'consultative': PitchAngle, // We'll create a dedicated ConsultativeAngle later
};

export default AngleRegistry;
