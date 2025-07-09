import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { FiCopy, FiCheck, FiExternalLink } from "react-icons/fi";

export default function UPIPayment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, amount, formData } = location.state || {};

  if (!user || !amount) {
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
    return `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${txnId}&tr=${txnId}&tn=${encodeURIComponent(
      note
    )}&am=${amount}&cu=${currency}`;
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
    navigate("/booking-confirmed", { state: formData });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold text-center">UPI Payment</h1>
          <p className="text-center opacity-90 mt-1">Scan or tap to pay</p>
        </div>

        {/* Amount Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="text-center">
            <p className="text-gray-600">Amount to pay</p>
            <p className="text-3xl font-bold mt-2">₹{amount}</p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center">
            {isMobile ? (
              <button
                onClick={() => (window.location.href = upiUrl)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FiExternalLink />
                Open UPI App
              </button>
            ) : (
              qrImage && (
                <div className="flex flex-col items-center">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 mb-4">
                    <img src={qrImage} alt="UPI QR Code" className="w-48 h-48" />
                  </div>
                  <p className="text-gray-600 text-sm mb-2">Scan QR code with any UPI app</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* UPI ID Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 mb-2">Pay to this UPI ID</p>
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <span className="font-mono font-medium">{upiId}</span>
              <button
                onClick={copyToClipboard}
                className="ml-3 text-blue-600 hover:text-blue-800 transition-colors"
                title="Copy UPI ID"
              >
                {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
              </button>
            </div>
          </div>
        </div>

        {/* Payment Note */}
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm text-center">
              Please complete the payment and click "I've Paid" below to confirm your booking.
            </p>
          </div>

          <button
            onClick={handlePaymentDone}
            className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            I've Paid
          </button>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Having trouble?{' '}
            <a href={upiUrl} className="text-blue-600 hover:underline">
              Try manual payment
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}