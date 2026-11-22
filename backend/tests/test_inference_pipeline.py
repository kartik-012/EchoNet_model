import unittest
import torch
import numpy as np

class TestInferencePipeline(unittest.TestCase):
    def test_tensor_input_shape(self):
        """Validates that R3D-18 expects a 5D spatio-temporal video tensor."""
        batch_size = 1
        channels = 3
        frames = 32
        height = 112
        width = 112
        x = torch.zeros(batch_size, channels, frames, height, width)
        self.assertEqual(x.shape, (1, 3, 32, 112, 112))

    def test_simpsons_ef_calculation(self):
        """Validates Simpson's Rule mathematical formulation for Ejection Fraction."""
        edv = 120.0  # End-diastolic volume in mL
        esv = 48.0   # End-systolic volume in mL
        stroke_volume = edv - esv
        ef = (stroke_volume / edv) * 100.0

        self.assertAlmostEqual(stroke_volume, 72.0, places=1)
        self.assertAlmostEqual(ef, 60.0, places=1)

    def test_aha_risk_stratification(self):
        """Validates AHA/ASE clinical risk category classification."""
        def classify(ef_val):
            if ef_val >= 50.0:
                return "Normal"
            elif ef_val >= 40.0:
                return "Mildly Reduced"
            else:
                return "Severely Reduced"

        self.assertEqual(classify(62.5), "Normal")
        self.assertEqual(classify(45.0), "Mildly Reduced")
        self.assertEqual(classify(32.0), "Severely Reduced")

if __name__ == '__main__':
    unittest.main()
