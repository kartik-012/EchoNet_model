export const heartVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform float uPulse;
  uniform float uWave;
  uniform vec2 uMouse;

  attribute vec3 aRandomPos;
  attribute vec3 aColor;
  attribute float aSize;

  varying vec3 vColor;
  varying float vWaveFactor;
  varying float vDistance;

  void main() {
    // Progress interpolation: 0.0 = exploded cloud, 1.0 = anatomical heart
    float smoothP = smoothstep(0.0, 1.0, uProgress);
    vec3 mixedPos = mix(aRandomPos, position, smoothP);

    // Anatomical myocardial contraction (lub-dub pulse)
    // Contraction pulls towards the ventricular center-of-mass
    vec3 contractionCenter = vec3(0.0, -0.3, 0.0);
    vec3 toCenter = normalize(mixedPos - contractionCenter);
    mixedPos += toCenter * (uPulse * 0.08);

    // Mouse magnetic parallax deflection
    float mouseDist = length(mixedPos.xy - uMouse * 2.0);
    float mouseRepulse = smoothstep(1.5, 0.0, mouseDist) * 0.15;
    mixedPos.xy += normalize(mixedPos.xy - uMouse * 2.0 + vec2(0.001)) * mouseRepulse;

    // Acoustic ultrasound scanning wave (travels vertically from apex to base)
    // normalized height around y = -2.0 to +2.0
    float wavePos = sin(uTime * 1.5 - mixedPos.y * 1.2) * 0.5 + 0.5;
    vWaveFactor = smoothstep(0.85, 1.0, wavePos);

    vec4 mvPosition = modelViewMatrix * vec4(mixedPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Attenuated particle sizing with depth
    float sizeFactor = (smoothP * 0.6 + 0.4);
    gl_PointSize = (aSize * sizeFactor * (320.0 / -mvPosition.z));

    vColor = aColor;
    vDistance = -mvPosition.z;
  }
`;

export const heartFragmentShader = `
  uniform float uPulse;
  uniform float uProgress;

  varying vec3 vColor;
  varying float vWaveFactor;
  varying float vDistance;

  void main() {
    // Generate smooth circular particles
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Radial gaussian-like falloff for luminous soft glow
    float alpha = smoothstep(0.5, 0.05, dist);

    // Acoustic wave highlight and systolic brightness surge
    vec3 finalColor = vColor;
    finalColor += vec3(0.3, 0.4, 0.8) * vWaveFactor * 0.6;
    finalColor += vec3(0.2, 0.1, 0.3) * (uPulse * 0.8);

    gl_FragColor = vec4(finalColor, alpha * 0.85);
  }
`;
