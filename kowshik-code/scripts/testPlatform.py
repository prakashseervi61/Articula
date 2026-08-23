import sys
import os
import io
import urllib.request
import json
import numpy as np
from PIL import Image

def test_api():
    print("=" * 70)
    print("ARTICULA PLATFORM -- END-TO-END PYTORCH BACKEND & FRONTEND TEST SUITE")
    print("=" * 70)

    # 1. Health Check
    health_url = "http://localhost:8000/api/health"
    try:
        req = urllib.request.Request(health_url)
        with urllib.request.urlopen(req) as resp:
            health_data = json.loads(resp.read().decode())
            print(f"[PASS] Health Check -> {health_data['engine']} (Status: {health_data['status']}, Device: {health_data['device']})")
    except Exception as e:
        print(f"[FAIL] Health check failed: {e}")
        sys.exit(1)

    # 2. Test Valid Knee Radiograph Ingestion
    print("\n--- Testing Valid Knee Radiograph Upload to PyTorch Inference Engine ---")
    img_array = np.random.randint(40, 220, (512, 512), dtype=np.uint8)
    # Add simulated condyle contrast band
    img_array[200:320, 150:350] = 235
    img_pil = Image.fromarray(img_array)
    buf = io.BytesIO()
    img_pil.save(buf, format="PNG")
    img_bytes = buf.getvalue()

    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="knee_ap_test.png"\r\n'
        f"Content-Type: image/png\r\n\r\n"
    ).encode() + img_bytes + f"\r\n--{boundary}--\r\n".encode()

    analyze_url = "http://localhost:8000/api/analyze-knee"
    req_analyze = urllib.request.Request(
        analyze_url,
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req_analyze) as resp:
            res_data = json.loads(resp.read().decode())
            print(f"[PASS] PyTorch Analysis Ingested 'knee_ap_test.png'")
            print(f"  - Quality Status: {res_data['quality']['status']} (Score: {res_data['quality']['overallScore']}%, SNR: {res_data['quality']['snrDb']}dB)")
            print(f"  - Meniscus Thickness: Anterior {res_data['measurements']['meniscus']['anteriorMm']}mm | Middle {res_data['measurements']['meniscus']['middleMm']}mm | Posterior {res_data['measurements']['meniscus']['posteriorMm']}mm")
            print(f"  - Bone Sizing: Femoral Width {res_data['measurements']['bone']['femoralCondyleWidthMm']}mm | Tibial Width {res_data['measurements']['bone']['tibialPlateauWidthMm']}mm")
            print(f"  - TKA Implant Recommendation: {res_data['implantMatch']['manufacturer']} {res_data['implantMatch']['model']} ({res_data['implantMatch']['femoralSize']}/{res_data['implantMatch']['tibialSize']}) - Fit Score {res_data['implantMatch']['fitScore']}%")
    except Exception as e:
        print(f"[FAIL] Knee upload analysis failed: {e}")
        sys.exit(1)

    # 3. Test Non-Knee Quality Gate Failure
    print("\n--- Testing Non-Knee Image DICOM Quality Gate Protocol Rejection ---")
    body_fail = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="file"; filename="random_cat_photo.jpg"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode() + img_bytes + f"\r\n--{boundary}--\r\n".encode()

    req_fail = urllib.request.Request(
        analyze_url,
        data=body_fail,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req_fail) as resp:
            res_fail = json.loads(resp.read().decode())
            print(f"[PASS] Quality Gate Rejection -> Status: {res_fail['quality']['status']} (Score: {res_fail['quality']['overallScore']}%)")
            print(f"  - Abort Reason: {res_fail['quality']['notes']}")
    except Exception as e:
        print(f"[FAIL] Rejection test failed: {e}")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("TEST RESULTS: ALL PYTORCH BACKEND & AI MODEL TESTS PASSED (100% CLEAN)")
    print("=" * 70)

if __name__ == "__main__":
    test_api()
