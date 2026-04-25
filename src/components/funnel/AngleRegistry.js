'use client';

import PitchAngle from './angles/PitchAngle';
import PayItForwardAngle from './angles/PayItForwardAngle';
import PayItForwardAngleV2 from './angles/PayItForwardAngleV2';
import ConsultativeAngle from './angles/ConsultativeAngle';

// This registry maps "Angle IDs" to their corresponding React components
// When you add a new angle in the future, you just add it here.
const AngleRegistry = {
  'pitch': PitchAngle,
  'direct': PitchAngle,
  'consultative': ConsultativeAngle,
  'pay-it-forward': PayItForwardAngle,
  'pay-it-forward-v2': PayItForwardAngleV2,
};

export default AngleRegistry;
