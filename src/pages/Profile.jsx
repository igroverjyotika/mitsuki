import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState({ name: "", address: "", phone: "", email: "" });
  const [shipping, setShipping] = useState({ name: "", address: "", phone: "" });

  useEffect(() => {
    if (currentUser) {
      setBilling({
        name: currentUser.name || "",
        address: (currentUser.billing && currentUser.billing.address) || currentUser.address || "",
        phone: (currentUser.billing && currentUser.billing.phone) || currentUser.phone || "",
        email: currentUser.email || "",
      });
      setShipping({
        name: (currentUser.shipping && currentUser.shipping.name) || currentUser.name || "",
        address: (currentUser.shipping && currentUser.shipping.address) || "",
        phone: (currentUser.shipping && currentUser.shipping.phone) || "",
        email: (currentUser.shipping && currentUser.shipping.email) || "",
      });
    }
  }, [currentUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // persist both billing and shipping, and keep legacy top-level address/phone in sync with billing
      await updateProfile({
        billing: {
          name: billing.name,
          address: billing.address,
          phone: billing.phone,
          email: billing.email,
        },
        shipping: {
          name: shipping.name,
          address: shipping.address,
          phone: shipping.phone,
          email: shipping.email,
        },
        // legacy fields for compatibility
        address: billing.address,
        phone: billing.phone,
      });
      alert("Profile saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <PageWrapper>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <div className="flex gap-4 mb-6">
              <Link to="/orders" className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">My Orders</Link>
              <Link to="/orders?tab=quotes" className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">My Quotes</Link>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Bill To</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Name</label>
                    <input value={billing.name} onChange={(e)=>setBilling(b=>({...b,name:e.target.value}))} className="w-full p-2 rounded border" />
                  </div>
                  <div>
                    <label className="block text-sm">Email (from account)</label>
                    <input value={billing.email} disabled className="w-full p-2 rounded border bg-gray-100" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm">Address</label>
                    <textarea value={billing.address} onChange={(e)=>setBilling(b=>({...b,address:e.target.value}))} rows={3} className="w-full p-2 rounded border" />
                  </div>
                  <div>
                    <label className="block text-sm">Phone</label>
                    <input value={billing.phone} onChange={(e)=>setBilling(b=>({...b,phone:e.target.value}))} className="w-full p-2 rounded border" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Ship To</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm">Name</label>
                    <input value={shipping.name} onChange={(e)=>setShipping(s=>({...s,name:e.target.value}))} className="w-full p-2 rounded border" />
                  </div>
                  <div>
                    <label className="block text-sm">Phone</label>
                    <input value={shipping.phone} onChange={(e)=>setShipping(s=>({...s,phone:e.target.value}))} className="w-full p-2 rounded border" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm">Address</label>
                    <textarea value={shipping.address} onChange={(e)=>setShipping(s=>({...s,address:e.target.value}))} rows={3} className="w-full p-2 rounded border" />
                  </div>
                  <div>
                    <label className="block text-sm">Email</label>
                    <input value={shipping.email} onChange={(e)=>setShipping(s=>({...s,email:e.target.value}))} className="w-full p-2 rounded border" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading? 'Saving...' : 'Save Profile'}</button>
              </div>
            </form>
          </div>

          <aside className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h4 className="font-semibold mb-3">Account</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400">Signed in as</div>
            <div className="font-medium mt-1">{currentUser?.name || currentUser?.email}</div>
            <div className="text-sm text-gray-500 mt-2">Email: {currentUser?.email}</div>
          </aside>
        </div>
      </PageWrapper>
    </div>
  );
}
