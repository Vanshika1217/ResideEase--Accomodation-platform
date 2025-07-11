import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function UPIPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuth(); // ✅ logged-in user

  const state = location.state || {};
  const { user, amount, formData, bookingId } = state;

  if (!user || !amount || !formData) {
    return (
      <div className="text-red-500 text-center mt-10">
        Missing payment info. Please go back and try again.
      </div>
    );
  }

  const { upiId = "gvanshika528@okaxis", name } = user;
  const txnId = useMemo(() => `TXN${Date.now()}`, []);
  const note = "Hotel Booking Payment";
  const currency = "INR";

  const upiUrl = useMemo(() => {
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${txnId}&tr=${txnId}&tn=${encodeURIComponent(note)}&am=${amount}&cu=${currency}`;
  }, [upiId, name, txnId, amount]);

  const [isMobile, setIsMobile] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    QRCode.toDataURL(upiUrl, { width: 300, margin: 2 }, (err, url) => {
      if (!err) setQrImage(url);
    });
  }, [upiUrl]);

  const handlePaymentDone = () => {
    const enrichedFormData = {
      ...formData,
      accommodationId: bookingId,
      userId: loggedInUser?._id,
    };

    console.log("✅ Navigating to booking-confirmed with:", enrichedFormData);

    navigate("/booking-confirmed", {
      state: { formData: enrichedFormData },
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">UPI Payment</h1>
          <p className="opacity-90 mt-1">Scan or tap to pay</p>
        </div>

        <div className="p-6 border-b border-gray-200 text-center">
          <p className="text-gray-600">Amount to pay</p>
          <p className="text-3xl font-bold mt-2">₹{amount}</p>
        </div>

        <div className="p-6 border-b border-gray-200 flex flex-col items-center">
          {isMobile ? (
            <button
              onClick={() => (window.location.href = upiUrl)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium flex items-center gap-2"
            >
              <FiExternalLink />
              Open UPI App
            </button>
          ) : (
            qrImage && (
              <>
                <img src={qrImage} alt="QR Code" className="w-48 h-48 mb-2" />
                <p className="text-sm text-gray-600">Scan QR with any UPI app</p>
              </>
            )
          )}
        </div>

        <div className="p-6 border-b border-gray-200 text-center">
          <p className="text-gray-600 mb-2">Pay to this UPI ID</p>
          <div className="inline-flex items-center bg-gray-100 px-4 py-2 rounded-lg">
            <span className="font-mono">{upiId}</span>
            <button onClick={copyToClipboard} className="ml-3 text-blue-600">
              {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center text-yellow-800 text-sm">
            Complete the payment and click "I've Paid" to confirm your booking.
          </div>

          <button
            onClick={handlePaymentDone}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg"
          >
            I've Paid
          </button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Having trouble?{" "}
            <a href={upiUrl} className="text-blue-600 hover:underline">
              Try manual payment
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
