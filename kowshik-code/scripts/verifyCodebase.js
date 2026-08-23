// Codebase Static Verification & Algorithmic Unit Test Suite for ARTICULA
import fs from 'fs';
import path from 'path';
import { syntheticCases } from '../src/data/syntheticCases.js';
import { implantDatabase, findNearestImplantMatch } from '../src/data/implantDatabase.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

console.log('======================================================================');
console.log('ARTICULA PLATFORM — STATIC CODEBASE & ALGORITHMIC TEST SUITE');
console.log('======================================================================\n');

// TEST SUITE 1: Synthetic Cases Dataset Verification
console.log('TEST SUITE 1: Synthetic Cases Data Schema & Metrics Integrity');
assert(Array.isArray(syntheticCases), 'syntheticCases is an array');
assert(syntheticCases.length >= 6, `syntheticCases dataset contains ${syntheticCases.length} entries (>= 6 required)`);

syntheticCases.forEach((c, idx) => {
  console.log(`\n  Checking Case ${idx + 1}: ${c.id} (${c.patientAlias})`);
  assert(typeof c.id === 'string' && c.id.startsWith('CASE-'), `Case ID format valid (${c.id})`);
  assert(c.age >= 18 && c.age <= 100, `Patient age valid (${c.age})`);
  assert(['Male', 'Female'].includes(c.sex), `Patient sex valid (${c.sex})`);
  assert(c.oaGrade >= 0 && c.oaGrade <= 4, `KL OA Grade within 0-4 range (Grade ${c.oaGrade})`);
  
  // DICOM Quality Check
  assert(c.quality && ['Pass', 'Warning', 'Fail'].includes(c.quality.status), `Quality status valid (${c.quality.status})`);
  assert(c.quality.overallScore > 0 && c.quality.overallScore <= 100, `Quality score valid (${c.quality.overallScore}%)`);

  // Meniscus Metrics
  const meniscus = c.measurements?.meniscus;
  assert(meniscus && meniscus.anteriorMm > 0, `Anterior meniscus thickness positive (${meniscus?.anteriorMm} mm)`);
  assert(meniscus && meniscus.middleMm > 0, `Middle meniscus thickness positive (${meniscus?.middleMm} mm)`);
  assert(meniscus && meniscus.posteriorMm > 0, `Posterior meniscus thickness positive (${meniscus?.posteriorMm} mm)`);
  assert(meniscus && meniscus.confidence >= 70 && meniscus.confidence <= 100, `Meniscus extraction confidence valid (${meniscus?.confidence}%)`);

  // Bone Metrics
  const bone = c.measurements?.bone;
  assert(bone && bone.femoralCondyleWidthMm > 50, `Femoral condyle width valid (${bone?.femoralCondyleWidthMm} mm)`);
  assert(bone && bone.tibialPlateauWidthMm > 50, `Tibial plateau width valid (${bone?.tibialPlateauWidthMm} mm)`);
  assert(bone && bone.confidence >= 70 && bone.confidence <= 100, `Bone sizing confidence valid (${bone?.confidence}%)`);
});

// TEST SUITE 2: Nearest Implant Match Algorithm Verification
console.log('\n----------------------------------------------------------------------');
console.log('TEST SUITE 2: TKA Implant Nearest-Neighbor Matching Algorithm');
assert(Array.isArray(implantDatabase) && implantDatabase.length >= 10, `Implant catalog has ${implantDatabase.length} entries`);

// Test matching logic against CASE-2026-001 measurements
const sampleBone = syntheticCases[0].measurements.bone;
const matchResult = findNearestImplantMatch(
  sampleBone.femoralCondyleWidthMm,
  sampleBone.tibialPlateauWidthMm,
  sampleBone.femoralApMm,
  sampleBone.tibialApMm
);

assert(matchResult !== null, 'Matching engine returns a valid match result');
assert(matchResult.implant && matchResult.implant.manufacturer, `Matched manufacturer: ${matchResult.implant.manufacturer}`);
assert(matchResult.fitScore > 80 && matchResult.fitScore <= 100, `Fit score calculated (${matchResult.fitScore}%)`);
assert(typeof matchResult.fitErrorMm === 'number' && matchResult.fitErrorMm >= 0, `Euclidean fit error calculated (${matchResult.fitErrorMm} mm)`);
assert(matchResult.deltas && typeof matchResult.deltas.femoralWidth === 'number', 'Dimensional fit error deltas calculated');

// TEST SUITE 3: Component & View Files Existence Audit
console.log('\n----------------------------------------------------------------------');
console.log('TEST SUITE 3: Core UI Component & View Modules Audit');

const requiredFiles = [
  'src/components/Header.jsx',
  'src/components/DisclaimerBanner.jsx',
  'src/components/Footer.jsx',
  'src/components/QualityCheckCard.jsx',
  'src/components/SegmentationViewer.jsx',
  'src/components/MeasurementCard.jsx',
  'src/components/ClinicianVerification.jsx',
  'src/components/ImplantMatchCard.jsx',
  'src/components/ImplantTable.jsx',
  'src/components/PopulationChart.jsx',
  'src/components/Tier1PreviewCard.jsx',
  'src/components/AuditLog.jsx',
  'src/views/LandingView.jsx',
  'src/views/HowItWorksView.jsx',
  'src/views/WorkspaceView.jsx',
  'src/views/PopulationView.jsx',
  'src/views/ImplantMatchingView.jsx',
  'src/views/ReportView.jsx',
  'src/views/AboutView.jsx',
  'src/App.jsx',
  'src/main.jsx',
  'PRD.md',
  'DESIGN_DOC.md'
];

requiredFiles.forEach((relPath) => {
  const fullPath = path.resolve('.', relPath);
  const exists = fs.existsSync(fullPath);
  assert(exists, `File exists: ${relPath}`);
});

// Summary Output
console.log('\n======================================================================');
console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('======================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
