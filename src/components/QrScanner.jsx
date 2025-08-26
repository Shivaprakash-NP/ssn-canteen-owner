import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-reader', 
      {
        qrbox: {
          width: 250,
          height: 250,
        },
        fps: 5,
      },
      false // verbose
    );

    function success(result) {
      scanner.clear();
      onScanSuccess(result);
    }

    function error(err) {
      // console.warn(err);
    }

    scanner.render(success, error);

    return () => {
      scanner.clear();
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" className="w-full"></div>;
};

export default QrScanner;
