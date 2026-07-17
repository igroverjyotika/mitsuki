/**
 * Utility to dynamically load Razorpay checkout script only when needed
 * This prevents unnecessary network requests on app startup
 */

let razorpayLoaded = false;

export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.Razorpay) {
      resolve();
      return;
    }

    // If script is being loaded, wait for it
    if (razorpayLoaded) {
      const checkRazorpay = setInterval(() => {
        if (window.Razorpay) {
          clearInterval(checkRazorpay);
          resolve();
        }
      }, 100);
      return;
    }

    razorpayLoaded = true;

    // Load the script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      if (window.Razorpay) {
        resolve();
      } else {
        reject(new Error("Razorpay failed to load"));
      }
    };

    script.onerror = () => {
      razorpayLoaded = false;
      reject(new Error("Failed to load Razorpay script"));
    };

    document.head.appendChild(script);
  });
};
