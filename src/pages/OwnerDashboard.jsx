import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import QrScanner from '../components/QrScanner';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

const OwnerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [scanMessage, setScanMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Auth listener is handled by ProtectedRoute, this one can be removed
    const q = query(
      collection(db, 'orders'),
      where('canteenId', '==', 'main_canteen'),
      where('status', '==', 'pending')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      fetchedOrders.sort((a, b) => a.createdAt.seconds - b.createdAt.seconds); // Oldest first
      setOrders(fetchedOrders);
    });
    return () => unsubscribe();
  }, []);

  const handleScanSuccess = async (orderId) => {
    setScanMessage({ type: '', text: '' }); // Reset message on new scan
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        setScanMessage({ type: 'error', text: 'Error: Order not found.' });
        return;
      }

      const orderData = orderSnap.data();
      if (orderData.status !== 'pending') {
        setScanMessage({ type: 'error', text: `Order already marked as "${orderData.status}".` });
        return;
      }
      
      await updateDoc(orderRef, { status: "delivered" });
      setScanMessage({ type: 'success', text: `Success! Order for ${orderData.studentName} delivered.` });
    } catch (error) {
      console.error("Error updating order status: ", error);
      setScanMessage({ type: 'error', text: 'Failed to update order.' });
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-8 text-slate-800">Pending Orders</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-xl shadow-lg text-center text-slate-500 border border-slate-200">
              <FiCheckCircle className="mx-auto text-6xl text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">All Caught Up!</h2>
              <p>No pending orders at the moment.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 transition-shadow hover:shadow-xl">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                  <h2 className="text-2xl font-bold text-blue-600">{order.studentName}</h2>
                  <p className="font-extrabold text-xl text-slate-800">₹{order.totalAmount}</p>
                </div>
                <ul className="space-y-2 text-slate-600 mb-4">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex justify-between text-lg">
                      <span>{item.name}</span>
                      <span className="font-medium text-slate-500">x {item.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-4 pt-4 border-t">
                  <FiClock />
                  <span>{new Date(order.createdAt.seconds * 1000).toLocaleTimeString()}</span>
                  <span className='font-mono'>({order.id.substring(0, 8)})</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg sticky top-28 border border-slate-200">
          <h2 className="text-2xl font-bold mb-4 text-center text-slate-800">Scan QR to Deliver</h2>
          <div className="aspect-square max-w-sm mx-auto p-4 bg-slate-100 rounded-lg overflow-hidden">
            <QrScanner onScanSuccess={handleScanSuccess} />
          </div>
          {scanMessage.text && (
            <div className={`mt-4 p-3 rounded-lg text-center font-semibold ${scanMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {scanMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;